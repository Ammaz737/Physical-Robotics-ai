import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import invoiceRoutes from './routes/invoices';
import financeRoutes from './routes/finance';
import orderMemoRoutes from './routes/orderMemo';
import dashboardRoutes from './routes/dashboard';
import salesHistoryRoutes from './routes/salesHistory';
import billingCartRoutes from './routes/billingCart';
import uploadRoutes from './routes/upload';
import { authenticateToken } from './middleware/auth';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files for uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', authenticateToken, productRoutes);
app.use('/api/invoices', authenticateToken, invoiceRoutes);
app.use('/api/finance', authenticateToken, financeRoutes);
app.use('/api/order-memo', authenticateToken, orderMemoRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);
app.use('/api/sales-history', authenticateToken, salesHistoryRoutes);
app.use('/api/billing-cart', authenticateToken, billingCartRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
