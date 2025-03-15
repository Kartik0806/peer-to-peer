import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useParams } from "react-router";
import { useAuth } from "../providers/authProvider.jsx";

export const Meet = () => {
    const { id } = useParams();
    const meetCode = id;
    const [socket, setSocket] = useState(null);
    const { user } = useAuth();  // Removed unused setUser and loading
    const [messages, setMessages] = useState([]);  // Fixed naming consistency
    const videoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const stream = useRef(null);
    const peer = useRef(null);  // Changed to useRef for consistent cleanup
    const [isClient, setClient] = useState(false); 

    // Centralized error handling
    const handleError = (error, context) => {
        console.error(`Error in ${context}:`, error);
    };

    useEffect(() => {

        const setupRTC = async (socketInstance) => {
            try {
                stream.current = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

                videoRef.current.srcObject = stream.current;
            } catch (error) {
                handleError(error, "media device access");
                return;
            }

            try {
                peer.current = new RTCPeerConnection({
                    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
                });

                stream.current.getTracks().forEach(track => {
                    peer.current.addTrack(track, stream.current);
                });

                peer.current.ontrack = (event) => {
                    if (remoteVideoRef.current && event.streams[0]) {
                        remoteVideoRef.current.srcObject = event.streams[0];
                    }
                };

                peer.current.onicecandidate = (event) => {
                    if (event.candidate) {
                        socketInstance.emit("sendIce", event.candidate);
                    }
                };

                // if(isClient == false)
                //     createOffer(socketInstance);

            } catch (error) {
                handleError(error, "peer connection setup");
            }
        };

        const newSocket = io("http://localhost:5000", {
            withCredentials: true,
            query: { meetCode },
            auth: { user_token: user?.token || "" },  // Use actual user token
        });

        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Connected to socket", newSocket.id);
            setupRTC(newSocket).then(() => {
                newSocket.on("createOffer", () => createOffer(newSocket));
                newSocket.on("recieveOffer", (offer) => handleOffer(offer, newSocket));
                newSocket.on("recieveAnswer", handleAnswer);
                newSocket.on("receiveIce", handleIceCandidate);
            });
            newSocket.emit("joinRoom", meetCode);
        });

        newSocket.on("createOffer", () => createOffer(newSocket));  

        newSocket.on("recieveOffer", (offer) => {
            handleOffer(offer, newSocket);
        });
        newSocket.on("recieveAnswer", handleAnswer);
        newSocket.on("receiveIce", handleIceCandidate);
        newSocket.on("message", (data) => {
            setMessages(prev => [...prev, data]);
        });

        return () => {
            if (newSocket.connected) {
                newSocket.disconnect();
            }
            if (stream.current) {
                stream.current.getTracks().forEach(track => track.stop());
            }
            if (peer.current) {
                peer.current.close();
            }
        };
    }, [meetCode, user?.token]);  

    const createOffer = async (socket) => {
        try {
            if (!peer.current) return;
            const offer = await peer.current.createOffer();
            await peer.current.setLocalDescription(offer);
            socket.emit("sendOffer", offer);
        } catch (error) {
            handleError(error, "offer creation");
        }
    };

    const handleOffer = async (offer, socket) => {
        let retries = 0;
        while (!peer.current && retries < 5) {
            console.log("Waiting for peer connection to initialize...");
            await new Promise(resolve => setTimeout(resolve, 500));
            retries++;
        }

        console.log(peer.current , socket)
        try {
            if (!peer.current || !socket) return;
            console.log("inside handle offer:", socket)

            await peer.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peer.current.createAnswer();
            await peer.current.setLocalDescription(answer);
            console.log("sending answer", answer)
            socket.emit("sendAnswer", answer);
        } catch (error) {
            handleError(error, "offer handling");
        }
    };

    const handleAnswer = async (answer) => {
        let retries = 0;
        while (!peer.current && retries < 5) {
            console.log("Waiting for peer connection to initialize...");
            await new Promise(resolve => setTimeout(resolve, 500));
            retries++;
        }
        try {
            if (!peer.current) return;
            console.log("lol")
            await peer.current.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (error) {
            handleError(error, "answer handling");
        }
    };

    const handleIceCandidate = async (candidate) => {
        try {
            if (!peer.current) return;
            await peer.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
            handleError(error, "ICE candidate handling");
        }
    };

    const sendMessage = () => {
        const message = prompt("Enter message");
        if (message && socket) {
            socket.emit("message", message);
        }
    };

    return (
        <div>
            <h3>Meet {meetCode}</h3>
            <div className="video-container">
                <video ref={videoRef} autoPlay muted playsInline></video>
                <video ref={remoteVideoRef} autoPlay playsInline style={{ transform: 'scaleX(-1)', transformOrigin: 'center' }}></video>
            </div>
            <button onClick={sendMessage}>Send Message</button>
            <div className="messages">
                {messages.map((msg, i) => (
                    <p key={i}>{msg}</p>
                ))}
            </div>
        </div>
    );
};