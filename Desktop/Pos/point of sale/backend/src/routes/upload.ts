import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { upload, handleUploadError } from '../middleware/upload';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// POST /api/upload/:type - Upload file by type
router.post('/:type', (req, res, next) => {
  const { type } = req.params;
  
  // Configure upload based on type
  let uploadMiddleware;
  switch (type) {
    case 'product':
      uploadMiddleware = upload.single('image');
      break;
    case 'finance':
      uploadMiddleware = upload.single('checkImage');
      break;
    case 'orderMemo':
      uploadMiddleware = upload.single('bookingSlipImage');
      break;
    default:
      return res.status(400).json({ error: 'Invalid upload type' });
  }
  
  uploadMiddleware(req, res, next);
}, handleUploadError, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path.replace(/\\/g, '/'); // Normalize path for Windows
    const fileUrl = `/uploads/${filePath.split('uploads/')[1]}`;

    res.json({
      message: 'File uploaded successfully',
      file: {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: fileUrl,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Upload route error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
