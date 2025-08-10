import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { 
  getDashboardStats, 
  getSalesGraph, 
  getDetailedRecords 
} from '../controllers/dashboardController';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', getDashboardStats);

// GET /api/dashboard/graph - Get sales graph data
router.get('/graph', getSalesGraph);

// GET /api/dashboard/records - Get detailed records by type
router.get('/records', getDetailedRecords);

export default router;
