import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const { startMonth, startYear, endMonth, endYear } = req.query;
    
    const startDate = new Date(parseInt(startYear as string), parseInt(startMonth as string) - 1, 1);
    const endDate = new Date(parseInt(endYear as string), parseInt(endMonth as string), 0, 23, 59, 59);

    // Get monthly purchase amount (from products created in the period)
    const monthlyPurchaseAmount = await prisma.product.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        purchasePrice: true
      }
    });

    // Get monthly sales amount
    const monthlySalesAmount = await prisma.sale.aggregate({
      where: {
        saleDate: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        totalAmount: true
      }
    });

    // Get monthly profit amount
    const monthlyProfitAmount = await prisma.sale.aggregate({
      where: {
        saleDate: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        profitAmount: true
      }
    });

    // Get total products count
    const totalProducts = await prisma.product.count();

    // Get total invoices count
    const totalInvoices = await prisma.invoice.count();

    // Get recent sales
    const recentSales = await prisma.sale.findMany({
      take: 5,
      orderBy: { saleDate: 'desc' },
      include: {
        invoice: {
          select: {
            customerName: true,
            customerContact: true
          }
        }
      }
    });

    const stats = {
      monthlyPurchaseAmount: monthlyPurchaseAmount._sum.purchasePrice || 0,
      monthlySaleAmount: monthlySalesAmount._sum.totalAmount || 0,
      monthlyProfitAmount: monthlyProfitAmount._sum.profitAmount || 0,
      totalProducts,
      totalInvoices,
      recentSales,
      period: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSalesGraph = async (req: Request, res: Response) => {
  try {
    const { startMonth, startYear, endMonth, endYear } = req.query;
    
    const startDate = new Date(parseInt(startYear as string), parseInt(startMonth as string) - 1, 1);
    const endDate = new Date(parseInt(endYear as string), parseInt(endMonth as string), 0, 23, 59, 59);

    // Get sales data grouped by month
    const salesData = await prisma.sale.groupBy({
      by: ['saleDate'],
      where: {
        saleDate: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: {
        totalAmount: true
      }
    });

    // Process data for graph
    const graphData = salesData.map(sale => ({
      month: sale.saleDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      totalSales: sale._sum.totalAmount || 0
    }));

    res.json(graphData);
  } catch (error) {
    console.error('Get sales graph error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getDetailedRecords = async (req: Request, res: Response) => {
  try {
    const { type, startMonth, startYear, endMonth, endYear } = req.query;
    
    const startDate = new Date(parseInt(startYear as string), parseInt(startMonth as string) - 1, 1);
    const endDate = new Date(parseInt(endYear as string), parseInt(endMonth as string), 0, 23, 59, 59);

    let records = [];

    if (type === 'purchase') {
      records = await prisma.product.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        select: {
          id: true,
          name: true,
          purchasePrice: true,
          createdAt: true
        }
      });
    } else if (type === 'sales') {
      records = await prisma.sale.findMany({
        where: {
          saleDate: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          invoice: {
            select: {
              invoiceNo: true,
              customerName: true,
              customerContact: true
            }
          }
        }
      });
    } else if (type === 'profit') {
      records = await prisma.sale.findMany({
        where: {
          saleDate: {
            gte: startDate,
            lte: endDate
          }
        },
        include: {
          invoice: {
            select: {
              invoiceNo: true,
              customerName: true,
              customerContact: true
            }
          }
        }
      });
    }

    res.json(records);
  } catch (error) {
    console.error('Get detailed records error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
