import Message from '../models/MessageModel.js';

import cloudinary from '../configs/cloudinary.js';
import fs from 'fs';





export const getMessages = async (req, res) => {
  try {
   
    const user1=req.userId;
    const user2=req.body.id;

    if(!user1||!user2){
      return res.status(400).json({
        success:false,
        message:"Both user IDs are required"
      })
    }
 
    const messages=await Message.find({
      $or:[
        {sender:user1,recipient:user2},
        {sender:user2,recipient:user1},

      ]
    }).sort({timestamp:1});
   

    res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};








export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    // Multer + Cloudinary middleware already uploads the file
    // File URL is available at req.file.path
    return res.status(200).json({
      success: true,
      filePath: req.file.path, // Cloudinary secure_url
    });

  } catch (error) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        message: "File too large. Max size is 10MB.",
      });
    }

    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};
