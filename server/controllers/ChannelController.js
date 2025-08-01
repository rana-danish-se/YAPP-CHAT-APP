import User from '../models/UserModel.js';
import Channel from '../models/ChannelModel.js';
import mongoose from 'mongoose';

export const createChannel = async (req, res) => {
  try {
    const { name, members } = req.body;
    const userId = req.userId;
    const admin = await User.findById(userId);
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: 'Admin user not found',
      });
    }
    const validMembers = await User.find({ _id: { $in: members } });
    if (validMembers.length !== members.length) {
      return res.status(400).json({
        success: false,
        message: 'Some of the members are not valid',
      });
    }
    const newChannel = new Channel({
      name,
      admin: userId,
      members,
    });
    await newChannel.save();
    return res.status(201).json({
      success: true,
      channel: newChannel,
    });
  } catch (error) {
    console.error('Error Creating Channel:', error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

export const getUserChannels = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });

    return res.status(201).json({
      success: true,
      channels,
    });
  } catch (error) {
    console.error('Error Creating Channel:', error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

export const getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.body;
    const channel = await Channel.findById(channelId).populate({
      path: 'messages',
      populate: {
        path: 'sender',
        select: 'firstName lastName email _id image color',
      },
    });

    if(!channel){
      return res.status(404).json({
        success:false,
        message:"Channel not found"
      })
    }

    const messages=channel.messages;
    

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('Error Creating Channel:', error.message);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};
