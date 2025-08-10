import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = [
    'uploads/products',
    'uploads/invoices',
    'uploads/checks',
    'uploads/order_memos'
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Configure storage for different file types
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    // Determine upload path based on route
    if (req.originalUrl.includes('/products')) {
      uploadPath += 'products/';
    } else if (req.originalUrl.includes('/finance')) {
      uploadPath += 'checks/';
    } else if (req.originalUrl.includes('/order-memos')) {
      uploadPath += 'order_memos/';
    } else {
      uploadPath += 'products/'; // default
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter to accept only images
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'));
  }
};

// Create multer instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file per request
  }
});

// Specific upload configurations for different routes
export const productUpload = upload.single('image');
export const checkUpload = upload.single('checkImage');
export const orderMemoUpload = upload.single('bookingSlipImage');

// Error handling middleware for multer
export const handleUploadError = (err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Only one file allowed.' });
    }
    return res.status(400).json({ error: 'File upload error: ' + err.message });
  }
  
  if (err.message === 'Only image files are allowed') {
    return res.status(400).json({ error: err.message });
  }
  
  next(err);
};
