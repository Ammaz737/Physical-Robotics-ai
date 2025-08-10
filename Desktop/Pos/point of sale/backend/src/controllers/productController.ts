import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(products);
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      barcode,
      name,
      weight,
      purchasePrice,
      salePrice,
      stock
    } = req.body;

    if (!barcode || !name || !purchasePrice || !salePrice || stock === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if barcode already exists
    const existingProduct = await prisma.product.findUnique({
      where: { barcode }
    });

    if (existingProduct) {
      return res.status(400).json({ error: 'Product with this barcode already exists' });
    }

    const product = await prisma.product.create({
      data: {
        barcode,
        name,
        weight: weight ? parseFloat(weight) : null,
        purchasePrice: parseFloat(purchasePrice),
        salePrice: parseFloat(salePrice),
        stock: parseInt(stock),
        image: req.file ? req.file.path : null
      }
    });

    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      barcode,
      name,
      weight,
      purchasePrice,
      salePrice,
      stock
    } = req.body;

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if barcode is being changed and if it already exists
    if (barcode && barcode !== product.barcode) {
      const existingProduct = await prisma.product.findUnique({
        where: { barcode }
      });

      if (existingProduct) {
        return res.status(400).json({ error: 'Product with this barcode already exists' });
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        barcode: barcode || product.barcode,
        name: name || product.name,
        weight: weight !== undefined ? parseFloat(weight) : product.weight,
        purchasePrice: purchasePrice ? parseFloat(purchasePrice) : product.purchasePrice,
        salePrice: salePrice ? parseFloat(salePrice) : product.salePrice,
        stock: stock !== undefined ? parseInt(stock) : product.stock,
        image: req.file ? req.file.path : product.image
      }
    });

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    await prisma.product.delete({
      where: { id }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateStock = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined) {
      return res.status(400).json({ error: 'Stock value is required' });
    }

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: { stock: parseInt(stock) }
    });

    res.json({
      message: 'Stock updated successfully',
      product: updatedProduct
    });
  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
