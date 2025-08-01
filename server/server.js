import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import connectDB from './configs/db.js';
import authRouter from './routes/AuthRoutes.js';
import contactRouter from './routes/ContactsRoutes.js';
import setupSocket from './socket.js';
import messageRouter from './routes/MessageRoute.js';
import channelRouter from './routes/ChannelRoutes.js';

dotenv.config();

const app = express();
await connectDB();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  })
);
app.use('/uploads/profiles', express.static('uploads/profiles'));
app.use('/uploads/files', express.static('uploads/files'));
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to server of YAPP CHAT APPLICATION');
});

app.use('/api/user', authRouter);
app.use('/api/contacts', contactRouter);
app.use('/api/messages', messageRouter);
app.use('/api/channels', channelRouter);

const server=app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
setupSocket(server);