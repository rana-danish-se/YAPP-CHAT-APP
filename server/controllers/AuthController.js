import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';
import bcrypt from 'bcrypt';
import { renameSync, existsSync, mkdirSync, unlinkSync } from 'fs';
import path from 'path';
import { response } from 'express';

const jwtMaxAgeSeconds = 3 * 24 * 60 * 60;
const cookieMaxAgeMs = jwtMaxAgeSeconds * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: jwtMaxAgeSeconds,
  });
};

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists',
      });
    }
    const user = new User({ email, password, profileSetup: false });
    const createdUser = await user.save();

    const token = createToken(createdUser.email, createdUser._id);
    res.cookie('jwt', token, {
      secure: true,
      sameSite: 'None',
      maxAge: cookieMaxAgeMs,
    });

    res.status(201).json({
      success: true,
      message: 'Sign up successful',
      user: {
        id: createdUser._id,
        email: createdUser.email,
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        image: createdUser.image,
        profileSetup: createdUser.profileSetup,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = createToken(user.email, user._id);

    res.cookie('jwt', token, {
      secure: true,
      sameSite: 'None',
      maxAge: cookieMaxAgeMs,
    });

    res.status(200).json({
      success: true,
      message: 'Sign In successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Sign In successful',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
   
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};




const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, color } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'All fields are  required',
      });
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      success: true,
      message: 'Profile Setup Successfull',
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// const addProfileImage = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({
//         success: false,
//         message: 'File is required',
//       });
//     }

//     const date = Date.now();
//     const uploadDir = path.join('uploads', 'profiles');

//     // Ensure upload directory exists
//     if (!existsSync(uploadDir)) {
//       mkdirSync(uploadDir, { recursive: true });
//     }

//     const fileName = `${uploadDir}/${date}-${req.file.originalname}`;
//     renameSync(req.file.path, fileName);

//     const user = await User.findByIdAndUpdate(
//       req.userId,
//       { image: fileName },
//       { new: true, runValidators: true }
//     );

//     return res.status(200).json({
//       success: true,
//       message: 'Profile image uploaded successfully',
//       user: { image: user.image },
//     });
//   } catch (error) {
   
//     return res.status(500).json({
//       success: false,
//       message: 'Something went wrong. Please try again later.',
//     });
//   }
// };

const addProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'File is required',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      { image: req.file.path }, // Cloudinary image URL
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      user: { image: user.image },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};


const removeProfileImage = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.image) {
      const imagePath = path.resolve(user.image); 
      if (existsSync(imagePath)) {
        unlinkSync(imagePath); 
      }
    }

    user.image = null;
    await user.save();
    return res.status(200).json({
      success: true,
      message: 'Image deleted successfully',
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 1,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};



export {
  signup,
  login,
  getUserInfo,
  updateProfile,
  addProfileImage,
  removeProfileImage,
  logout
};
