import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { getSalesHistory, createSalesRecord } from '../controllers/salesHistoryController';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get sales history with optional date filters
router.get('/', getSalesHistory);

// Create a new sales record
router.post('/', createSalesRecord);

export default router;
