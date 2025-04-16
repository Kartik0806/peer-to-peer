import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/index.js';
import { createServer } from 'http';
import { initialiseSocket } from './socket.js';

const app = express();
app.use(cors({
    origin: ['http://localhost:5173', 'https://bringyoahhtome.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use(router);

app.use('/api', router);

const httpServer = createServer(app);
initialiseSocket(httpServer);

const PORT = process.env.PORT || 5000;


httpServer.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
