import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { 
  processSale, 
  generateInvoice, 
  searchProductByBarcode,
  getCartSummary
} from '../controllers/billingCartController';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// POST /api/billing-cart/process-sale - Process a sale
router.post('/process-sale', processSale);

// POST /api/billing-cart/generate-invoice - Generate invoice
router.post('/generate-invoice', generateInvoice);

// GET /api/billing-cart/search-product/:barcode - Search product by barcode
router.get('/search-product/:barcode', searchProductByBarcode);

// POST /api/billing-cart/summary - Get cart summary with tax calculation
router.post('/summary', getCartSummary);

export default router;
