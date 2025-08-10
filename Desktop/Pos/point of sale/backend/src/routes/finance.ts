import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { 
  getAllFinanceRecords, 
  getFinanceRecordById, 
  createFinanceRecord, 
  updateFinanceRecord, 
  deleteFinanceRecord,
  updateFinanceRecordStatus
} from '../controllers/financeController';
import { checkUpload, handleUploadError } from '../middleware/upload';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/finance - Get all finance records
router.get('/', getAllFinanceRecords);

// GET /api/finance/:id - Get finance record by ID
router.get('/:id', getFinanceRecordById);

// POST /api/finance - Create new finance record
router.post('/', checkUpload, handleUploadError, createFinanceRecord);

// PUT /api/finance/:id - Update finance record
router.put('/:id', checkUpload, handleUploadError, updateFinanceRecord);

// DELETE /api/finance/:id - Delete finance record
router.delete('/:id', deleteFinanceRecord);

// PATCH /api/finance/:id/status - Update finance record status
router.patch('/:id/status', updateFinanceRecordStatus);

export default router;
