import multer from 'multer';

const upload = multer({
  dest: 'uploads/profiles/',
});

export default upload;
