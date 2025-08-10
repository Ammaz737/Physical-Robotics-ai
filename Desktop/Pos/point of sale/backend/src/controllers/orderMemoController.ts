import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createOrderMemo = async (req: Request, res: Response) => {
  try {
    const { company, date, notes, amount } = req.body;

    if (!company || !date) {
      return res.status(400).json({ error: 'Company and date are required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Booking slip image is required' });
    }

    const orderMemo = await prisma.orderMemo.create({
      data: {
        company,
        bookingSlip: req.file.path,
        date: new Date(date),
        notes: notes || null,
        amount: amount ? parseFloat(amount) : null
      }
    });

    res.status(201).json({
      message: 'Order memo created successfully',
      orderMemo
    });
  } catch (error) {
    console.error('Create order memo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllOrderMemos = async (req: Request, res: Response) => {
  try {
    const { company, startDate, endDate } = req.query;

    let whereClause: any = {};

    if (company) {
      whereClause.company = {
        contains: company as string,
        mode: 'insensitive'
      };
    }

    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    const orderMemos = await prisma.orderMemo.findMany({
      where: whereClause,
      orderBy: { date: 'desc' }
    });

    res.json(orderMemos);
  } catch (error) {
    console.error('Get all order memos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrderMemoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const orderMemo = await prisma.orderMemo.findUnique({
      where: { id }
    });

    if (!orderMemo) {
      return res.status(404).json({ error: 'Order memo not found' });
    }

    res.json(orderMemo);
  } catch (error) {
    console.error('Get order memo by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOrderMemo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { company, date, notes, amount } = req.body;

    const orderMemo = await prisma.orderMemo.findUnique({
      where: { id }
    });

    if (!orderMemo) {
      return res.status(404).json({ error: 'Order memo not found' });
    }

    const updateData: any = {};

    if (company) updateData.company = company;
    if (date) updateData.date = new Date(date);
    if (notes !== undefined) updateData.notes = notes;
    if (amount !== undefined) updateData.amount = amount ? parseFloat(amount) : null;

    // Update image if new file is uploaded
    if (req.file) {
      updateData.bookingSlip = req.file.path;
    }

    const updatedMemo = await prisma.orderMemo.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Order memo updated successfully',
      orderMemo: updatedMemo
    });
  } catch (error) {
    console.error('Update order memo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteOrderMemo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const orderMemo = await prisma.orderMemo.findUnique({
      where: { id }
    });

    if (!orderMemo) {
      return res.status(404).json({ error: 'Order memo not found' });
    }

    await prisma.orderMemo.delete({
      where: { id }
    });

    res.json({ message: 'Order memo deleted successfully' });
  } catch (error) {
    console.error('Delete order memo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const searchOrderMemos = async (req: Request, res: Response) => {
  try {
    const { company, query } = req.query;

    let whereClause: any = {};

    if (company) {
      whereClause.company = {
        contains: company as string,
        mode: 'insensitive'
      };
    } else if (query) {
      whereClause.OR = [
        {
          company: {
            contains: query as string,
            mode: 'insensitive'
          }
        },
        {
          notes: {
            contains: query as string,
            mode: 'insensitive'
          }
        }
      ];
    }

    const orderMemos = await prisma.orderMemo.findMany({
      where: whereClause,
      orderBy: { date: 'desc' }
    });

    res.json(orderMemos);
  } catch (error) {
    console.error('Search order memos error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrderMemoStats = async (req: Request, res: Response) => {
  try {
    const totalMemos = await prisma.orderMemo.count();
    
    const companyStats = await prisma.orderMemo.groupBy({
      by: ['company'],
      _count: {
        id: true
      },
      _sum: {
        amount: true
      }
    });

    const totalAmount = await prisma.orderMemo.aggregate({
      _sum: { amount: true }
    });

    res.json({
      totalMemos,
      totalAmount: totalAmount._sum.amount || 0,
      companyStats: companyStats.map(stat => ({
        company: stat.company,
        count: stat._count.id,
        totalAmount: stat._sum.amount || 0
      }))
    });
  } catch (error) {
    console.error('Get order memo stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
