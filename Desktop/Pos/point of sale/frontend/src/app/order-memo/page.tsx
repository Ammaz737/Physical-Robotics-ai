'use client';

import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/Layout';
import { Upload, Search, Filter, Plus, Eye, Edit, Trash2, Calendar, Building, FileText } from 'lucide-react';
import { apiService } from '@/utils/api';

interface OrderMemo {
  id: string;
  company: string;
  bookingSlip: string;
  date: string;
  notes?: string;
  amount?: number;
  createdAt: string;
}

export default function OrderMemoPage() {
  const [orderMemos, setOrderMemos] = useState<OrderMemo[]>([]);
  const [filteredMemos, setFilteredMemos] = useState<OrderMemo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    company: '',
    date: '',
    amount: '',
    notes: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchOrderMemos();
  }, []);

  useEffect(() => {
    filterMemos();
  }, [searchTerm, companyFilter, startDate, endDate, orderMemos]);

  const fetchOrderMemos = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getOrderMemos();
      if (response.success) {
        setOrderMemos(response.data);
      }
    } catch (error) {
      console.error('Error fetching order memos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterMemos = () => {
    let filtered = orderMemos;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(memo =>
        memo.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        memo.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        memo.amount?.toString().includes(searchTerm)
      );
    }

    // Filter by company
    if (companyFilter !== 'all') {
      filtered = filtered.filter(memo => memo.company === companyFilter);
    }

    // Filter by date range
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter(memo => {
        const memoDate = new Date(memo.date);
        return memoDate >= start && memoDate <= end;
      });
    }

    setFilteredMemos(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCompanyFilter('all');
    setStartDate('');
    setEndDate('');
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      alert('Please select a booking slip image');
      return;
    }

    if (!formData.company || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const formDataToSend = new FormData();
      formDataToSend.append('bookingSlip', selectedFile);
      formDataToSend.append('company', formData.company);
      formDataToSend.append('date', formData.date);
      if (formData.amount) formDataToSend.append('amount', formData.amount);
      if (formData.notes) formDataToSend.append('notes', formData.notes);

      const response = await apiService.createOrderMemo(formDataToSend);
      
      if (response.success) {
        setShowAddModal(false);
        resetForm();
        fetchOrderMemos();
      }
    } catch (error) {
      console.error('Error creating order memo:', error);
      alert('Failed to create order memo');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      company: '',
      date: '',
      amount: '',
      notes: ''
    });
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getUniqueCompanies = () => {
    const companies = orderMemos.map(memo => memo.company);
    return [...new Set(companies)];
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

  const getTotalStats = () => {
    const totalMemos = filteredMemos.length;
    const uniqueCompanies = new Set(filteredMemos.map(m => m.company)).size;
    const totalAmount = filteredMemos.reduce((sum, m) => sum + (m.amount || 0), 0);

    return { totalMemos, uniqueCompanies, totalAmount };
  };

  const stats = getTotalStats();

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
            <h1 className="text-3xl font-bold text-gray-900">Order Memos</h1>
            <p className="text-gray-600 mt-2">Manage company-wise booking slips and orders</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Add Memo
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Memos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMemos}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Companies</p>
                <p className="text-2xl font-bold text-gray-900">{stats.uniqueCompanies}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalAmount)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              <Filter size={16} className="mr-1" />
              {showFilters ? 'Hide' : 'Show'} Filters
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by company, notes, or amount..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <select
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Companies</option>
                  {getUniqueCompanies().map(company => (
                    <option key={company} value={company}>{company}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {showFilters && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Memos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMemos.map((memo) => (
            <div key={memo.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Booking Slip Image */}
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <img
                  src={memo.bookingSlip}
                  alt="Booking Slip"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Memo Details */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">{formatDate(memo.date)}</span>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {memo.company}
                  </span>
                </div>

                {memo.amount && (
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    {formatCurrency(memo.amount)}
                  </p>
                )}

                {memo.notes && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{memo.notes}</p>
                )}

                {/* Actions */}
                <div className="flex space-x-2">
                  <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200 transition-colors">
                    <Eye size={16} className="mr-1" />
                    View
                  </button>
                  <button className="flex-1 flex items-center justify-center px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors">
                    <Edit size={16} className="mr-1" />
                    Edit
                  </button>
                  <button className="flex-1 flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200 transition-colors">
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMemos.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No order memos found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || companyFilter !== 'all' || startDate || endDate 
                ? 'Try adjusting your filters.' 
                : 'Get started by adding your first order memo.'}
            </p>
            {!searchTerm && companyFilter === 'all' && !startDate && !endDate && (
              <div className="mt-6">
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} className="mr-2" />
                  Add Memo
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Memo Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Add Order Memo</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company *
                </label>
                <input
                  type="text"
                  placeholder="Enter company name"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Slip Image *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Optional notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? 'Adding...' : 'Add Memo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
