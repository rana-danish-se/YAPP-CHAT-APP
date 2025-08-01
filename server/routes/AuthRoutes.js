// import express from 'express';
// import { login, signup,getUserInfo,updateProfile,addProfileImage,removeProfileImage, logout } from '../controllers/AuthController.js';
// import { verifyToken } from '../middlewares/AuthMiddleware.js';
// import upload from '../configs/multer.js';

// const authRouter=express.Router(
// );

// authRouter.post('/signup',signup);
// authRouter.post('/login',login);
// authRouter.get('/user-info',verifyToken,getUserInfo);
// authRouter.post('/update-profile',verifyToken,updateProfile);
// authRouter.post('/add-profile-image',verifyToken,upload.single("profile-image"),addProfileImage);

// authRouter.delete('/remove-profile-image',verifyToken,removeProfileImage);

// authRouter.post('/logout',logout)

// export default authRouter;

import express from 'express';
import {
  login,
  signup,
  getUserInfo,
  updateProfile,
  addProfileImage,
  removeProfileImage,
  logout
} from '../controllers/AuthController.js';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import uploadProfile from '../middlewares/ProfileUpload.js'; // Updated import

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.get('/user-info', verifyToken, getUserInfo);
authRouter.post('/update-profile', verifyToken, updateProfile);

// ✅ Cloudinary upload for profile image
authRouter.post(
  '/add-profile-image',
  verifyToken,
  uploadProfile.single("profile-image"),
  addProfileImage
);

authRouter.delete('/remove-profile-image', verifyToken, removeProfileImage);
authRouter.post('/logout', logout);

export default authRouter;
