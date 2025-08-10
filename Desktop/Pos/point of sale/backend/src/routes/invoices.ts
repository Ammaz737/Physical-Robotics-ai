import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { 
  getAllInvoices, 
  getInvoiceById, 
  createInvoice, 
  updateInvoice, 
  deleteInvoice,
  searchInvoices
} from '../controllers/invoiceController';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// GET /api/invoices - Get all invoices
router.get('/', getAllInvoices);

// GET /api/invoices/search - Search invoices
router.get('/search', searchInvoices);

// GET /api/invoices/:id - Get invoice by ID
router.get('/:id', getInvoiceById);

// POST /api/invoices - Create new invoice
router.post('/', createInvoice);

// PUT /api/invoices/:id - Update invoice
router.put('/:id', updateInvoice);

// DELETE /api/invoices/:id - Delete invoice
router.delete('/:id', deleteInvoice);

export default router;
