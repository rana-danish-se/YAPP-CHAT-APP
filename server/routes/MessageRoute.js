import express from 'express';
import { getMessages, uploadFile } from '../controllers/MessagesController.js';
import { verifyToken } from '../middlewares/AuthMiddleware.js';
import multer from 'multer'

const messageRouter = express.Router();

const upload = multer({ dest: 'uploads/files' });

messageRouter.post('/get-messages', verifyToken, getMessages);

messageRouter.post(
  '/upload-file',
  upload.single('file'),
  verifyToken,
  uploadFile
);

export default messageRouter;
