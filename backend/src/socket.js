import { Server } from "socket.io";
import { admin } from "./config/firebase.js";
import cookie from "cookie";

export function initialiseSocket(httpServer) {
    let connections = new Set()

    const io = new Server(httpServer, {
        cors: {
            origin: ["http://localhost:5173", "https://bringyoahhtome.vercel.app"], 
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.use(async (socket, next) => {
        const meetCode = socket.handshake.query.meetCode;
        const cookieString = socket.handshake.headers.cookie;
        const access_token = cookie.parse(cookieString || "").access_token;
        if (!meetCode) {
            return next(new Error("Invalid meet code"));
        }
        socket.meetCode = meetCode;
        if (!access_token) {
            return next(new Error("Invalid user token"));
        }
        try {
            const user = await admin.auth().verifyIdToken(access_token);
            socket.user = user;
            next();
        } catch (error) {
            console.error("In auth of socket.js", error);
            return next(new Error("Invalid user token"));
        }
    });

    io.on("connection", (socket) => {
        console.log(`A user connected: ${socket.user.email}`);

        socket.on("message", (data) => {
            console.log(data);
            io.emit("message", data);
        });

        socket.on("joinRoom", (data) => {

            if (connections.has(data)) {
                const clients = io.sockets.adapter.rooms.get(socket.meetCode);
                if (clients && clients.size > 1) {
                    const hostSocketId = [...clients][0];
                    io.to(hostSocketId).emit("createOffer");
                }
                socket.to(socket.meetCode).emit("createOffer");
            }
            connections.add(data);            
            socket.join(data);
            console.log(`A user entered: ${socket.user.email} in room: ${data}`);
        });

        socket.on("sendOffer", (offer) => {
            const clients = io.sockets.adapter.rooms.get(socket.meetCode);
            if (clients && clients.size > 1) {
                const newClientSocketId = [...clients].pop(); 
                console.log(newClientSocketId)
                io.to(newClientSocketId).emit("receiveOffer", offer); 
            }            
        });

        socket.on("sendAnswer", (answer) => {
            socket.to(socket.meetCode).emit("receiveAnswer", answer);
        });

        socket.on("sendIce", (candidate) => {
            socket.to(socket.meetCode).emit("receiveIce", candidate);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected: ", socket.user.email);
        });
    });

    return io;
}
