'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Package, Search, Plus, Edit, Trash2, Plus as PlusIcon, Minus as MinusIcon } from 'lucide-react';
import { apiService } from '@/utils/api';
import Link from 'next/link';

interface Product {
  id: string;
  barcode: string;
  name: string;
  image?: string;
  weight?: number;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  createdAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [stockValue, setStockValue] = useState<number>(0);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getProducts();
      if (response.success) {
        setProducts(response.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    if (!searchTerm.trim()) {
      setFilteredProducts(products);
      return;
    }

    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleStockUpdate = async (productId: string, newStock: number) => {
    try {
      const response = await apiService.updateProduct(productId, { stock: newStock });
      if (response.success) {
        setProducts(prev => 
          prev.map(p => p.id === productId ? { ...p, stock: newStock } : p)
        );
        setEditingStock(null);
        setStockValue(0);
      }
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };

  const startStockEdit = (product: Product) => {
    setEditingStock(product.id);
    setStockValue(product.stock);
  };

  const cancelStockEdit = () => {
    setEditingStock(null);
    setStockValue(0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
            <p className="text-gray-600 mt-2">Manage your product inventory</p>
          </div>
          <Link
            href="/add-product"
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Product
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products by name or barcode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Product Image */}
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Package size={48} className="text-gray-400" />
                )}
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">Barcode: {product.barcode}</p>
                
                {product.weight && (
                  <p className="text-sm text-gray-600 mb-2">Weight: {product.weight} kg</p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Purchase Price:</span>
                    <span className="text-sm font-medium">{formatCurrency(product.purchasePrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Sale Price:</span>
                    <span className="text-sm font-medium text-green-600">{formatCurrency(product.salePrice)}</span>
                  </div>
                </div>

                {/* Stock Management */}
                <div className="border-t pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Stock:</span>
                    <span className={`text-sm font-bold ${
                      product.stock > 10 ? 'text-green-600' : 
                      product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {product.stock} units
                    </span>
                  </div>

                  {editingStock === product.id ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setStockValue(Math.max(0, stockValue - 1))}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <MinusIcon size={16} />
                      </button>
                      <input
                        type="number"
                        value={stockValue}
                        onChange={(e) => setStockValue(Math.max(0, parseInt(e.target.value) || 0))}
                        className="w-16 text-center border border-gray-300 rounded px-2 py-1 text-sm"
                        min="0"
                      />
                      <button
                        onClick={() => setStockValue(stockValue + 1)}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <PlusIcon size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startStockEdit(product)}
                        className="flex-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200 transition-colors"
                      >
                        Update Stock
                      </button>
                    </div>
                  )}

                  {editingStock === product.id && (
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleStockUpdate(product.id, stockValue)}
                        className="flex-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelStockEdit}
                        className="flex-1 px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Product Actions */}
                <div className="border-t pt-3 mt-3">
                  <div className="flex space-x-2">
                    <Link
                      href={`/products/${product.id}/edit`}
                      className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </Link>
                    <button className="flex-1 flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200 transition-colors">
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first product.'}
            </p>
            {!searchTerm && (
              <div className="mt-6">
                <Link
                  href="/add-product"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} className="mr-2" />
                  Add Product
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
