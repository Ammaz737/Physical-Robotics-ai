import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { 
  getAllOrderMemos, 
  getOrderMemoById, 
  createOrderMemo, 
  updateOrderMemo, 
  deleteOrderMemo,
  searchOrderMemos
} from '../controllers/orderMemoController';
import { checkUpload, handleUploadError } from '../middleware/upload';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/order-memo - Get all order memos
router.get('/', getAllOrderMemos);

// GET /api/order-memo/search - Search order memos
router.get('/search', searchOrderMemos);

// GET /api/order-memo/:id - Get order memo by ID
router.get('/:id', getOrderMemoById);

// POST /api/order-memo - Create new order memo
router.post('/', checkUpload, handleUploadError, createOrderMemo);

// PUT /api/order-memo/:id - Update order memo
router.put('/:id', checkUpload, handleUploadError, updateOrderMemo);

// DELETE /api/order-memo/:id - Delete order memo
router.delete('/:id', deleteOrderMemo);

export default router;
