import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const processSale = async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      customerContact,
      items,
      totalAmount,
      paidAmount,
      taxAmount,
      taxPercent,
      isTaxEnabled
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart items are required' });
    }

    // Generate unique invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Calculate change
    const change = paidAmount - totalAmount;

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNo: invoiceNumber,
        customerName: customerName || 'Walk-in Customer',
        customerContact: customerContact || null,
        total: totalAmount,
        paid: paidAmount,
        change: change > 0 ? change : 0,
        taxAmount: taxAmount || 0,
        taxPercent: taxPercent || 0,
        isTaxEnabled: isTaxEnabled || false
      }
    });

    // Create invoice items
    const invoiceItems = await Promise.all(
      items.map(async (item: any) => {
        return prisma.invoiceItem.create({
          data: {
            invoiceId: invoice.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
            total: item.total
          }
        });
      })
    );

    // Update product stock
    await Promise.all(
      items.map(async (item: any) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });

        if (product) {
          await prisma.product.update({
            where: { id: item.productId },
            data: { stock: product.stock - item.quantity }
          });
        }
      })
    );

    // Create sale record
    const sale = await prisma.sale.create({
      data: {
        invoiceId: invoice.id,
        saleDate: new Date(),
        totalAmount: totalAmount,
        profitAmount: calculateProfit(items)
      }
    });

    res.status(201).json({
      message: 'Sale processed successfully',
      invoice: {
        ...invoice,
        items: invoiceItems,
        sale
      }
    });
  } catch (error) {
    console.error('Process sale error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const generateInvoice = async (req: Request, res: Response) => {
  try {
    const { invoiceNumber } = req.body;

    const invoice = await prisma.invoice.findUnique({
      where: { invoiceNo: invoiceNumber },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    res.json({
      message: 'Invoice generated successfully',
      invoice
    });
  } catch (error) {
    console.error('Generate invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchProductByBarcode = async (req: Request, res: Response) => {
  try {
    const { barcode } = req.params;

    const product = await prisma.product.findUnique({
      where: { barcodeNo: barcode }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Search product by barcode error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCartSummary = async (req: Request, res: Response) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.json({
        subtotal: 0,
        taxAmount: 0,
        totalAmount: 0
      });
    }

    const subtotal = items.reduce((sum: number, item: any) => sum + item.total, 0);
    const taxAmount = subtotal * 0.15; // 15% FBR tax
    const totalAmount = subtotal + taxAmount;

    res.json({
      subtotal,
      taxAmount,
      totalAmount
    });
  } catch (error) {
    console.error('Get cart summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to calculate profit
const calculateProfit = (items: any[]) => {
  let totalProfit = 0;

  for (const item of items) {
    const profitPerUnit = item.price - item.purchasePrice;
    totalProfit += profitPerUnit * item.quantity;
  }

  return totalProfit;
};
