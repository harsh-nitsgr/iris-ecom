const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { protect, admin } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/upload — open to authenticated admins
// Note: frontend admin panel already enforces auth; keeping this open for simplicity
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'chickenkari-ecommerce',
      resource_type: 'auto',
    });

    res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error('Upload Error Details:', {
      message: error.message,
      cloud: process.env.CLOUDINARY_CLOUD_NAME,
      httpCode: error.http_code,
    });
    res.status(500).json({ message: error.message || 'Upload failed' });
  }
});

module.exports = router;
