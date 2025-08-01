import express from 'express';
import { getMessages, uploadFile } from '../controllers/MessagesController.js';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import uploadMessage from "../middlewares/cloudinaryMessageStorage.js";
import { handleMulterError } from '../middlewares/FileUploadErrorHandler.js';


const messageRouter = express.Router();

// 🟢 Get all messages
messageRouter.post('/get-messages', verifyToken, getMessages);

// 🟢 Upload file (image, video, doc, etc.)
messageRouter.post(
  '/upload-file',
  uploadMessage.single("file"),
  handleMulterError, 
  verifyToken,
  uploadFile
);

export default messageRouter;
