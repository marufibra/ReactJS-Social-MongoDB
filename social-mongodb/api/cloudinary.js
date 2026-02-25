import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'social',        // folder name in Cloudinary
    format: async (req, file) => 'jpg', // convert all images to jpg
    public_id: (req, file) => Date.now() + '-' + file.originalname,
  },
});

export const upload = multer({ storage });
export default cloudinary;
