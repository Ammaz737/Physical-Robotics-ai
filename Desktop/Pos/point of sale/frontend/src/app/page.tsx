'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, BarChart3, Calendar, Filter, Download, Eye } from 'lucide-react';
import { apiService } from '@/utils/api';

interface DashboardStats {
  monthlyPurchaseAmount: number;
  monthlySaleAmount: number;
  monthlyProfitAmount: number;
  totalProducts: number;
  totalInvoices: number;
  recentSales: any[];
  period: {
    start: string;
    end: string;
  };
}

interface SalesRecord {
  id: number;
  saleDate: string;
  totalAmount: number;
  profitAmount: number;
  invoice: {
    id: number;
    invoiceNumber: string;
    customerName: string;
    customerContact: string;
  };
}

interface PurchaseRecord {
  id: number;
  name: string;
  purchasePrice: number;
  createdAt: string;
}

export default function HomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBox, setSelectedBox] = useState<'purchase' | 'sales' | 'profit' | null>(null);
  const [detailedRecords, setDetailedRecords] = useState<any[]>([]);
  const [dateFilter, setDateFilter] = useState({
    startMonth: new Date().getMonth() + 1,
    startYear: new Date().getFullYear(),
    endMonth: new Date().getMonth() + 1,
    endYear: new Date().getFullYear()
  });
  const [graphData, setGraphData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardStats();
  }, [dateFilter]);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getDashboardStats();
      if (response.success) {
        setStats(response.data);
        await fetchSalesGraph();
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSalesGraph = async () => {
    try {
      const response = await fetch(`/api/dashboard/graph?startMonth=${dateFilter.startMonth}&startYear=${dateFilter.startYear}&endMonth=${dateFilter.endMonth}&endYear=${dateFilter.endYear}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setGraphData(data);
      }
    } catch (error) {
      console.error('Error fetching sales graph:', error);
    }
  };

  const fetchDetailedRecords = async (type: 'purchase' | 'sales' | 'profit') => {
    try {
      const response = await fetch(`/api/dashboard/records?type=${type}&startMonth=${dateFilter.startMonth}&startYear=${dateFilter.startYear}&endMonth=${dateFilter.endMonth}&endYear=${dateFilter.endYear}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDetailedRecords(data);
        setSelectedBox(type);
      }
    } catch (error) {
      console.error('Error fetching detailed records:', error);
    }
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

  const exportToCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getMonthName = (month: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar size={20} className="text-gray-500" />
              <span className="text-sm text-gray-600">
                {getMonthName(dateFilter.startMonth)} {dateFilter.startYear} - {getMonthName(dateFilter.endMonth)} {dateFilter.endYear}
              </span>
            </div>
            <button
              onClick={() => setSelectedBox(null)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Filter size={16} className="mr-2 inline" />
              Reset View
            </button>
          </div>
        </div>

        {!selectedBox ? (
          <>
            {/* Dashboard Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Monthly Purchase Amount */}
              <div 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-blue-500"
                onClick={() => fetchDetailedRecords('purchase')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Purchase</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(stats?.monthlyPurchaseAmount || 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-600">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span>Click to view details</span>
                </div>
              </div>

              {/* Monthly Sales Amount */}
              <div 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-green-500"
                onClick={() => fetchDetailedRecords('sales')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Sales</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(stats?.monthlySaleAmount || 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Click to view details</span>
                </div>
              </div>

              {/* Monthly Profit */}
              <div 
                className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-purple-500"
                onClick={() => fetchDetailedRecords('profit')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Monthly Profit</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(stats?.monthlyProfitAmount || 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span>Click to view details</span>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Products:</span>
                    <span className="font-semibold">{stats?.totalProducts || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Invoices:</span>
                    <span className="font-semibold">{stats?.totalInvoices || 0}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h3>
                <div className="space-y-3">
                  {stats?.recentSales?.slice(0, 3).map((sale: any) => (
                    <div key={sale.id} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {sale.invoice?.customerName || 'Unknown Customer'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(sale.saleDate)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        {formatCurrency(sale.totalAmount)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sales Graph */}
            {graphData.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend</h3>
                <div className="h-64 flex items-end justify-between space-x-2">
                  {graphData.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-full bg-gray-200 rounded-t">
                        <div 
                          className="bg-blue-500 rounded-t transition-all duration-500"
                          style={{ 
                            height: `${Math.max((data.totalSales / Math.max(...graphData.map(d => d.totalSales))) * 200, 10)}px` 
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2 text-center">
                        {data.month}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* Detailed Records View */
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedBox === 'purchase' && 'Purchase Records'}
                    {selectedBox === 'sales' && 'Sales Records'}
                    {selectedBox === 'profit' && 'Profit Analysis'}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {getMonthName(dateFilter.startMonth)} {dateFilter.startYear} - {getMonthName(dateFilter.endMonth)} {dateFilter.endYear}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => exportToCSV(detailedRecords, `${selectedBox}-records`)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Download size={16} className="mr-2" />
                    Export CSV
                  </button>
                  <button
                    onClick={() => setSelectedBox(null)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {selectedBox === 'purchase' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </>
                    )}
                    {selectedBox === 'sales' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </>
                    )}
                    {selectedBox === 'profit' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {detailedRecords.map((record, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {selectedBox === 'purchase' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {record.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(record.purchasePrice)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(record.createdAt)}
                          </td>
                        </>
                      )}
                      {selectedBox === 'sales' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {record.invoice?.invoiceNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.invoice?.customerName || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.invoice?.customerContact || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(record.totalAmount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(record.saleDate)}
                          </td>
                        </>
                      )}
                      {selectedBox === 'profit' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {record.invoice?.invoiceNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.invoice?.customerName || 'Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(record.totalAmount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                            {formatCurrency(record.profitAmount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(record.saleDate)}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {detailedRecords.length === 0 && (
              <div className="text-center py-12">
                <BarChart3 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No records found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No {selectedBox} records found for the selected period.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
