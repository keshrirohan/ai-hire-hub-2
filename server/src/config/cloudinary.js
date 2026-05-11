const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Readable } = require('stream');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage — files uploaded as buffers, then streamed to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpg|jpeg|png|gif|pdf|doc|docx|zip/;
    const ext = file.originalname.split('.').pop()?.toLowerCase() || '';
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  },
});

/**
 * Upload a buffer to Cloudinary and return the result
 * @param {Buffer} buffer
 * @param {string} folder
 * @param {string} resourceType
 */
const uploadToCloudinary = (buffer, folder = 'ai-hire-hub', resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};

module.exports = { cloudinary, upload, uploadToCloudinary };
