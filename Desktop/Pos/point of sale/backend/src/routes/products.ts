import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  updateStock
} from '../controllers/productController';
import { productUpload, handleUploadError } from '../middleware/upload';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/products - Get all products
router.get('/', getAllProducts);

// GET /api/products/:id - Get product by ID
router.get('/:id', getProductById);

// POST /api/products - Create new product
router.post('/', productUpload, handleUploadError, createProduct);

// PUT /api/products/:id - Update product
router.put('/:id', productUpload, handleUploadError, updateProduct);

// DELETE /api/products/:id - Delete product
router.delete('/:id', deleteProduct);

// PATCH /api/products/:id/stock - Update product stock
router.patch('/:id/stock', updateStock);

export default router;
