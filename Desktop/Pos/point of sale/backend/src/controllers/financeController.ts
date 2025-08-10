import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createFinanceRecord = async (req: Request, res: Response) => {
  try {
    const { date, status, amount, notes } = req.body;

    if (!date || !status) {
      return res.status(400).json({ error: 'Date and status are required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Check image is required' });
    }

    const financeRecord = await prisma.financeRecord.create({
      data: {
        checkImage: req.file.path,
        date: new Date(date),
        status: status.toLowerCase(),
        amount: amount ? parseFloat(amount) : null,
        notes: notes || null
      }
    });

    res.status(201).json({
      message: 'Finance record created successfully',
      financeRecord
    });
  } catch (error) {
    console.error('Create finance record error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllFinanceRecords = async (req: Request, res: Response) => {
  try {
    const { status, startDate, endDate } = req.query;

    let whereClause: any = {};

    if (status && status !== 'all') {
      whereClause.status = status;
    }

    if (startDate && endDate) {
      whereClause.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string)
      };
    }

    const financeRecords = await prisma.financeRecord.findMany({
      where: whereClause,
      orderBy: { date: 'desc' }
    });

    res.json(financeRecords);
  } catch (error) {
    console.error('Get all finance records error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFinanceRecordById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const financeRecord = await prisma.financeRecord.findUnique({
      where: { id }
    });

    if (!financeRecord) {
      return res.status(404).json({ error: 'Finance record not found' });
    }

    res.json(financeRecord);
  } catch (error) {
    console.error('Get finance record by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateFinanceRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date, status, amount, notes } = req.body;

    const financeRecord = await prisma.financeRecord.findUnique({
      where: { id }
    });

    if (!financeRecord) {
      return res.status(404).json({ error: 'Finance record not found' });
    }

    const updateData: any = {};

    if (date) updateData.date = new Date(date);
    if (status) updateData.status = status.toLowerCase();
    if (amount !== undefined) updateData.amount = amount ? parseFloat(amount) : null;
    if (notes !== undefined) updateData.notes = notes;

    // Update image if new file is uploaded
    if (req.file) {
      updateData.checkImage = req.file.path;
    }

    const updatedRecord = await prisma.financeRecord.update({
      where: { id },
      data: updateData
    });

    res.json({
      message: 'Finance record updated successfully',
      financeRecord: updatedRecord
    });
  } catch (error) {
    console.error('Update finance record error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteFinanceRecord = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const financeRecord = await prisma.financeRecord.findUnique({
      where: { id }
    });

    if (!financeRecord) {
      return res.status(404).json({ error: 'Finance record not found' });
    }

    await prisma.financeRecord.delete({
      where: { id }
    });

    res.json({ message: 'Finance record deleted successfully' });
  } catch (error) {
    console.error('Delete finance record error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getFinanceStats = async (req: Request, res: Response) => {
  try {
    const totalRecords = await prisma.financeRecord.count();
    const pendingRecords = await prisma.financeRecord.count({
      where: { status: 'pending' }
    });
    const clearRecords = await prisma.financeRecord.count({
      where: { status: 'clear' }
    });
    const bounceRecords = await prisma.financeRecord.count({
      where: { status: 'bounce' }
    });

    const totalAmount = await prisma.financeRecord.aggregate({
      _sum: { amount: true }
    });

    res.json({
      totalRecords,
      pendingRecords,
      clearRecords,
      bounceRecords,
      totalAmount: totalAmount._sum.amount || 0
    });
  } catch (error) {
    console.error('Get finance stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
