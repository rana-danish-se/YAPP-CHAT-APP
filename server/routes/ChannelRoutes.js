import express from 'express';
import { createChannel, getChannelMessages, getUserChannels } from '../controllers/ChannelController.js';
import { verifyToken } from '../middlewares/AuthMiddleware.js';

const channelRouter=express.Router();


channelRouter.post('/create-channel',verifyToken,createChannel);
channelRouter.get('/get-user-channels',verifyToken,getUserChannels);
channelRouter.post('/get-channel-messages',verifyToken,getChannelMessages);


export default channelRouter