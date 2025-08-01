import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../configs/cloudinary.js';

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'yapp-chat-app/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    public_id: (req, file) => `profile-${Date.now()}`,
  },
});

const uploadProfile = multer({ storage: profileStorage });

export default uploadProfile;
