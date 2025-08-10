import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(invoices);
  } catch (error) {
    console.error('Get all invoices error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getInvoiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
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

    res.json(invoice);
  } catch (error) {
    console.error('Get invoice by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      customerContact,
      items,
      totalAmount,
      paidAmount,
      taxPercentage,
      taxAmount
    } = req.body;

    if (!customerName || !items || !totalAmount || !paidAmount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items array is required and cannot be empty' });
    }

    const changeAmount = parseFloat(paidAmount) - parseFloat(totalAmount);

    // Generate invoice number (format: INV-YYYYMMDD-XXXX)
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const invoiceCount = await prisma.invoice.count({
      where: {
        createdAt: {
          gte: new Date(today.getFullYear(), today.getMonth(), today.getDate())
        }
      }
    });
    const invoiceNumber = `INV-${dateStr}-${String(invoiceCount + 1).padStart(4, '0')}`;

    // Create invoice with items in a transaction
    const result = await prisma.$transaction(async (prisma) => {
      const invoice = await prisma.invoice.create({
        data: {
          invoiceNo: invoiceNumber,
          customerName,
          customerContact: customerContact || null,
          total: parseFloat(totalAmount),
          paid: parseFloat(paidAmount),
          change: changeAmount,
          taxPercent: taxPercentage ? parseFloat(taxPercentage) : 0,
          taxAmount: taxAmount ? parseFloat(taxAmount) : 0,
          isTaxEnabled: !!taxPercentage
        }
      });

      // Create invoice items and update product stock
      const invoiceItems = [];
      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        if (product.stock < parseInt(item.quantity)) {
          throw new Error(`Insufficient stock for product ${product.name}`);
        }

        // Create invoice item
        const invoiceItem = await prisma.invoiceItem.create({
          data: {
            invoiceId: invoice.id,
            productId: item.productId,
            quantity: parseInt(item.quantity),
            price: parseFloat(item.price),
            total: parseFloat(item.total)
          }
        });

        // Update product stock
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - parseInt(item.quantity) }
        });

        invoiceItems.push(invoiceItem);
      }

      // Calculate profit amount
      let profitAmount = 0;
      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });
        if (product) {
          const purchasePrice = parseFloat(product.purchasePrice.toString());
          const salePrice = parseFloat(item.price);
          const quantity = parseInt(item.quantity);
          profitAmount += ((salePrice - purchasePrice) * quantity);
        }
      }

      // Create sale record
      await prisma.sale.create({
        data: {
          invoiceId: invoice.id,
          saleDate: new Date(),
          totalAmount: parseFloat(totalAmount),
          profitAmount
        }
      });

      return { invoice, items: invoiceItems };
    });

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice: result.invoice,
      items: result.items
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const invoice = await prisma.invoice.findUnique({
      where: { id }
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Invoice updated successfully',
      invoice: updatedInvoice
    });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Restore product stock
    for (const item of invoice.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            increment: item.quantity
          }
        }
      });
    }

    // Delete invoice (cascade will delete items and sale)
    await prisma.invoice.delete({
      where: { id }
    });

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchInvoices = async (req: Request, res: Response) => {
  try {
    const { invoiceNumber, customerContact } = req.query;

    let whereClause: any = {};

    if (invoiceNumber) {
      whereClause.invoiceNo = {
        contains: invoiceNumber as string
      };
    }

    if (customerContact) {
      whereClause.customerContact = {
        contains: customerContact as string
      };
    }

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(invoices);
  } catch (error) {
    console.error('Search invoices error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
