import User from '../models/UserModel.js';
import Message from '../models/MessageModel.js';
import mongoose from 'mongoose';
export const searchContact = async (req, res) => {
  try {
    const { searchTerm } = req.body;
    if (searchTerm === undefined || searchTerm === null) {
      return res.status(200).json({
        success: false,
        message: 'Search term is required',
      });
    }
    const sanitizedSearchTerm = searchTerm.replace(
      /[.*+?^{}|()[\]\\]/g,
      '||$&'
    );
    const regex = new RegExp(sanitizedSearchTerm, 'i');
    const contacts = await User.find({
      $and: [
        { _id: { $ne: req.userId } },
        {
          $or: [{ firstName: regex }, { lastName: regex }, { email: regex }],
        },
      ],
    });
    res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

export const getContactsForDMList = async (req, res) => {
  try {
    let { userId } = req;
    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$sender', userId] },
              then: '$recipient',
              else: '$sender',
            },
          },
          lastMessageTime: { $first: '$timestamp' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'contactInfo',
        },
      },
      {
        $unwind: '$contactInfo',
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: '$contactInfo.email',
          firstName: '$contactInfo.firstName',
          lastName: '$contactInfo.lastName',
          image: '$contactInfo.image',
          color: '$contactInfo.color',
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};



export const getAllContacts = async (req, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: req.userId } },
      'firstName lastName _id email'
    );

const contacts = users.map((user) => ({
  label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email,
  value: user._id.toString(), // <- Add value too if used in frontend
}));

    res.status(200).json({
      success: true,
      contacts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};
