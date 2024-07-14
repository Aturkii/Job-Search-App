import multer from 'multer';
import path from 'path';

//^ Multer function to allow the user upload pdf
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Uploads/Resumes');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({ storage, fileFilter: (req, file, cb) => {
  if (file.mimetype !== 'application/pdf') {
    return cb(new Error('Only PDF files are allowed!'), false);
  }
  cb(null, true);
}});