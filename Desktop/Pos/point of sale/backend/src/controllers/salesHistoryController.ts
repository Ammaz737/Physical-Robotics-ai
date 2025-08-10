import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSalesHistory = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, page = 1, limit = 10 } = req.query;
    
    const where: any = {};
    
    if (startDate && endDate) {
      where.saleDate = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [sales, total] = await Promise.all([
      prisma.sale.findMany({
        where,
        include: {
          invoice: {
            include: {
              customer: true,
              items: {
                include: {
                  product: true,
                },
              },
            },
          },
        },
        orderBy: {
          saleDate: 'desc',
        },
        skip,
        take: Number(limit),
      }),
      prisma.sale.count({ where }),
    ]);
    
    res.json({
      sales,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error fetching sales history:', error);
    res.status(500).json({ error: 'Failed to fetch sales history' });
  }
};

export const createSalesRecord = async (req: Request, res: Response) => {
  try {
    const { customerInfo, items, totalAmount, taxAmount, invoiceNumber } = req.body;
    
    // Create customer if not exists
    let customer = await prisma.customer.findFirst({
      where: { contact: customerInfo.contact },
    });
    
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerInfo.name,
          contact: customerInfo.contact,
          address: customerInfo.address || '',
        },
      });
    }
    
    // Create invoice first
    const invoice = await prisma.invoice.create({
      data: {
        invoiceNo: invoiceNumber,
        customerName: customerInfo.name,
        customerContact: customerInfo.contact,
        total: totalAmount,
        paid: totalAmount,
        change: 0,
        taxAmount: taxAmount || 0,
        taxPercent: 0,
        isTaxEnabled: false
      }
    });
    
    // Create invoice items
    for (const item of items) {
      await prisma.invoiceItem.create({
        data: {
          invoiceId: invoice.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.unitPrice,
          total: item.totalPrice,
        },
      });
    }
    
    // Create sale record
    const sale = await prisma.sale.create({
      data: {
        invoiceId: invoice.id,
        saleDate: new Date(),
        totalAmount,
        profitAmount: 0 // Will be calculated based on purchase price
      },
      include: {
        invoice: {
          include: {
            customer: true,
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
    
    // Update product stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }
    
    res.status(201).json(sale);
  } catch (error) {
    console.error('Error creating sales record:', error);
    res.status(500).json({ error: 'Failed to create sales record' });
  }
};
