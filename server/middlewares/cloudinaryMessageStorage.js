import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "chat-app/messages",
    resource_type: file.mimetype.startsWith("video/")
      ? "video"
      : file.mimetype.startsWith("image/")
      ? "image"
      : "raw",
    public_id: Date.now() + "-" + file.originalname,
  }),
});

const uploadMessage = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export default uploadMessage;
