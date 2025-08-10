'use client';

import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { Search, Plus, Minus, Trash2, Receipt, QrCode, Camera, X, Calculator, User, Phone, ShoppingCart } from 'lucide-react';
import { apiService } from '@/utils/api';

interface Product {
  id: number;
  barcodeNo: string;
  name: string;
  weight?: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  imagePath?: string;
}

interface CartItem {
  productId: number;
  barcodeNo: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  stock: number;
}

interface InvoiceData {
  customerName: string;
  customerContact: string;
  items: CartItem[];
  totalAmount: number;
  paidAmount: number;
  changeAmount: number;
  taxPercentage: number;
  taxAmount: number;
}

export default function BillingCartPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [barcodeInput, setBarcodeInput] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    customerName: '',
    customerContact: '',
    items: [],
    totalAmount: 0,
    paidAmount: 0,
    changeAmount: 0,
    taxPercentage: 15, // Default FBR tax
    taxAmount: 0
  });
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const barcodeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
    // Focus barcode input on mount
    if (barcodeInputRef.current) {
      barcodeInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    // Update invoice data when cart changes
    const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = (totalAmount * invoiceData.taxPercentage) / 100;
    
    setInvoiceData(prev => ({
      ...prev,
      items: cart,
      totalAmount,
      taxAmount,
      changeAmount: prev.paidAmount - (totalAmount + taxAmount)
    }));
  }, [cart, invoiceData.taxPercentage, invoiceData.paidAmount]);

  const fetchProducts = async () => {
    try {
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

  const handleBarcodeScan = (barcode: string) => {
    const product = products.find(p => p.barcodeNo === barcode);
    if (product) {
      addToCart(product);
      setBarcodeInput('');
      // Focus back to barcode input
      if (barcodeInputRef.current) {
        barcodeInputRef.current.focus();
      }
    } else {
      alert('Product not found with this barcode');
    }
  };

  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (barcodeInput.trim()) {
      handleBarcodeScan(barcodeInput.trim());
    }
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.productId === product.id);
      
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return prevCart.map(item =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
              : item
          );
        } else {
          alert('No more stock available for this product');
          return prevCart;
        }
      } else {
        if (product.stock > 0) {
          return [...prevCart, {
            productId: product.id,
            barcodeNo: product.barcodeNo,
            name: product.name,
            price: product.salePrice,
            quantity: 1,
            total: product.salePrice,
            stock: product.stock
          }];
        } else {
          alert('Product is out of stock');
          return prevCart;
        }
      }
    });
  };

  const updateQuantity = (productId: number, change: number) => {
    setCart(prevCart => {
      const item = prevCart.find(cartItem => cartItem.productId === productId);
      if (!item) return prevCart;

      const newQuantity = item.quantity + change;
      if (newQuantity <= 0) {
        return prevCart.filter(cartItem => cartItem.productId !== productId);
      }
      if (newQuantity > item.stock) {
        alert('Cannot exceed available stock');
        return prevCart;
      }

      return prevCart.map(cartItem =>
        cartItem.productId === productId
          ? { ...cartItem, quantity: newQuantity, total: newQuantity * cartItem.price }
          : cartItem
      );
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    if (confirm('Are you sure you want to clear the cart?')) {
      setCart([]);
      setInvoiceData(prev => ({
        ...prev,
        customerName: '',
        customerContact: '',
        paidAmount: 0
      }));
    }
  };

  const handleTaxToggle = () => {
    setInvoiceData(prev => ({
      ...prev,
      taxPercentage: prev.taxPercentage === 15 ? 0 : 15
    }));
  };

  const handlePaidAmountChange = (amount: string) => {
    const paidAmount = parseFloat(amount) || 0;
    setInvoiceData(prev => ({
      ...prev,
      paidAmount,
      changeAmount: paidAmount - (prev.totalAmount + prev.taxAmount)
    }));
  };

  const generateInvoice = async () => {
    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    if (!invoiceData.customerName.trim()) {
      alert('Please enter customer name');
      return;
    }

    if (invoiceData.paidAmount < (invoiceData.totalAmount + invoiceData.taxAmount)) {
      alert('Paid amount is less than total amount');
      return;
    }

    setIsProcessing(true);
    try {
      const invoicePayload = {
        customerName: invoiceData.customerName,
        customerContact: invoiceData.customerContact || null,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          total: item.total
        })),
        totalAmount: invoiceData.totalAmount + invoiceData.taxAmount,
        paidAmount: invoiceData.paidAmount,
        taxPercentage: invoiceData.taxPercentage,
        taxAmount: invoiceData.taxAmount
      };

      const response = await apiService.createInvoice(invoicePayload);
      if (response.success) {
        setGeneratedInvoice(response.data.invoice);
        setShowInvoiceModal(true);
        // Clear cart after successful invoice generation
        setCart([]);
        setInvoiceData(prev => ({
          ...prev,
          customerName: '',
          customerContact: '',
          paidAmount: 0
        }));
      } else {
        alert('Failed to generate invoice: ' + response.error);
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const printInvoice = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow && generatedInvoice) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${generatedInvoice.invoiceNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
              .store-name { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
              .invoice-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
              .customer-info { margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .totals { text-align: right; margin-bottom: 20px; }
              .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="store-name">Your Store Name</div>
              <div>Point of Sale System</div>
            </div>
            
            <div class="invoice-info">
              <div>
                <strong>Invoice:</strong> ${generatedInvoice.invoiceNumber}<br>
                <strong>Date:</strong> ${new Date(generatedInvoice.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            <div class="customer-info">
              <strong>Customer:</strong> ${generatedInvoice.customerName}<br>
              ${generatedInvoice.customerContact ? `<strong>Contact:</strong> ${generatedInvoice.customerContact}` : ''}
            </div>
            
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${cart.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${item.total.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="totals">
              <div><strong>Subtotal:</strong> ${invoiceData.totalAmount.toFixed(2)}</div>
              ${invoiceData.taxPercentage > 0 ? `<div><strong>Tax (${invoiceData.taxPercentage}%):</strong> ${invoiceData.taxAmount.toFixed(2)}</div>` : ''}
              <div><strong>Total:</strong> ${(invoiceData.totalAmount + invoiceData.taxAmount).toFixed(2)}</div>
              <div><strong>Paid:</strong> ${invoiceData.paidAmount.toFixed(2)}</div>
              <div><strong>Change:</strong> ${invoiceData.changeAmount.toFixed(2)}</div>
            </div>
            
            <div class="footer">
              <strong>Developed by Muhammad Ammaz</strong><br>
              Contact: 03104518257
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcodeNo.includes(searchTerm)
  );

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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Billing Cart</h1>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowScanner(!showScanner)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {showScanner ? <X size={20} className="mr-2" /> : <Camera size={20} className="mr-2" />}
              {showScanner ? 'Hide Scanner' : 'Show Scanner'}
            </button>
            <button
              onClick={clearCart}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              <Trash2 size={20} className="mr-2" />
              Clear Cart
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Search and Cart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Barcode Scanner Section */}
            {showScanner && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Barcode Scanner</h3>
                <div className="flex items-center space-x-3">
                  <QrCode size={24} className="text-blue-600" />
                  <form onSubmit={handleBarcodeSubmit} className="flex-1">
                    <input
                      ref={barcodeInputRef}
                      type="text"
                      value={barcodeInput}
                      onChange={(e) => setBarcodeInput(e.target.value)}
                      placeholder="Scan barcode or enter manually..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                  </form>
                  <button
                    onClick={() => handleBarcodeSubmit({ preventDefault: () => {} } as any)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* Product Search */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Products</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or barcode..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="mt-4 max-h-64 overflow-y-auto">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-md mb-2 hover:bg-gray-50 cursor-pointer"
                    onClick={() => addToCart(product)}
                  >
                    <div className="flex items-center space-x-3">
                      {product.imagePath && (
                        <img
                          src={product.imagePath}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">Barcode: {product.barcodeNo}</p>
                        <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{product.salePrice.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">PKR</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Items */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cart Items</h3>
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Your cart is empty</p>
                  <p className="text-sm">Add products to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.productId} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Barcode: {item.barcodeNo}</p>
                        <p className="text-sm text-gray-500">Price: {item.price.toFixed(2)} PKR</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.productId, -1)}
                          className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-semibold text-gray-900 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, 1)}
                          className="p-1 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                        >
                          <Plus size={16} />
                        </button>
                        <span className="font-semibold text-gray-900 min-w-[4rem] text-right">
                          {item.total.toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Invoice Summary */}
          <div className="space-y-6">
            {/* Customer Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User size={16} className="inline mr-2" />
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={invoiceData.customerName}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Enter customer name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone size={16} className="inline mr-2" />
                    Contact (Optional)
                  </label>
                  <input
                    type="text"
                    value={invoiceData.customerContact}
                    onChange={(e) => setInvoiceData(prev => ({ ...prev, customerContact: e.target.value }))}
                    placeholder="Enter contact number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Invoice Summary */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invoice Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">{invoiceData.totalAmount.toFixed(2)} PKR</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={invoiceData.taxPercentage > 0}
                      onChange={handleTaxToggle}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-600">FBR Tax (15%)</span>
                  </div>
                  <span className="font-semibold">{invoiceData.taxAmount.toFixed(2)} PKR</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>{(invoiceData.totalAmount + invoiceData.taxAmount).toFixed(2)} PKR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calculator size={16} className="inline mr-2" />
                    Amount Paid
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={invoiceData.paidAmount}
                    onChange={(e) => handlePaidAmountChange(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                {invoiceData.paidAmount > 0 && (
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Change:</span>
                    <span className={invoiceData.changeAmount >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {invoiceData.changeAmount.toFixed(2)} PKR
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Generate Invoice Button */}
            <button
              onClick={generateInvoice}
              disabled={cart.length === 0 || isProcessing || !invoiceData.customerName.trim()}
              className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Receipt size={20} className="mr-2" />
                  Generate Invoice
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && generatedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Invoice Generated Successfully!</h2>
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-md">
                <p className="text-green-800">
                  <strong>Invoice Number:</strong> {generatedInvoice.invoiceNumber}
                </p>
                <p className="text-green-800">
                  <strong>Customer:</strong> {generatedInvoice.customerName}
                </p>
                <p className="text-green-800">
                  <strong>Total Amount:</strong> {(invoiceData.totalAmount + invoiceData.taxAmount).toFixed(2)} PKR
                </p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={printInvoice}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Receipt size={20} className="mr-2" />
                  Print Invoice
                </button>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
