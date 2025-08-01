import { Server as SocketIOServer } from 'socket.io';
import Message from './models/MessageModel.js';
import Channel from './models/ChannelModel.js';

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN  || 'https://yapp-chat-three.vercel.app',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User connected: ${userId} with socket id ${socket.id}`);
    } else {
      console.warn('❌ userId not provided in socket handshake query');
    }

    socket.on('sendMessage', async (message) => {
      const senderSocketId = userSocketMap.get(message.sender);
      const recipientSocketId = userSocketMap.get(message.recipient);

      const createdMessage = await Message.create(message);

      const messageData = await Message.findById(createdMessage._id)
        .populate('sender', 'id email firstName lastName image color')
        .populate('recipient', 'id email firstName lastName image color');

      if (recipientSocketId) {
        io.to(recipientSocketId).emit('receiveMessage', messageData);
      }
      if (senderSocketId) {
        io.to(senderSocketId).emit('receiveMessage', messageData);
      }
    });

    socket.on('send-channel-message', async (message) => {
      const { channelId, sender, content, messageType, fileUrl } = message;

      const createdMessage = await Message.create({
        sender,
        recipient: null,
        content,
        messageType,
        timestamp: new Date(),
        fileUrl,
      });

      const messageData = await Message.findById(createdMessage._id)
        .populate('sender', 'id email firstName lastName image color')
        .exec();

      await Channel.findByIdAndUpdate(channelId, {
        $push: { messages: createdMessage._id },
      });

      const channel = await Channel.findById(channelId)
        .populate('members')
        .populate('admin');

      const finalData = { ...messageData._doc, channelId: channel._id };

      if (channel && channel.members) {
        channel.members.forEach((member) => {
          const memberSocketId = userSocketMap.get(member._id.toString());
          if (memberSocketId) {
            io.to(memberSocketId).emit('receive-channel-message', finalData);
          }
        });

        const adminSocketId = userSocketMap.get(channel.admin._id.toString());
        const isAdminInMembers = channel.members.some(
          (m) => m._id.toString() === channel.admin._id.toString()
        );
        if (adminSocketId && !isAdminInMembers) {
          io.to(adminSocketId).emit('receive-channel-message', finalData);
        }
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);

      for (const [uid, sid] of userSocketMap.entries()) {
        if (sid === socket.id) {
          userSocketMap.delete(uid);
          console.log(`Removed user ${uid} from map`);
          break;
        }
      }
    });
  });
};

export default setupSocket;
