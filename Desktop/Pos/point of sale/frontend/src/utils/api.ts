const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiService {
  private isOnline = navigator.onLine;
  private pendingRequests: Array<{
    id: string;
    method: string;
    url: string;
    data?: any;
    timestamp: number;
  }> = [];

  constructor() {
    this.setupOnlineOfflineListeners();
    this.loadPendingRequests();
  }

  private setupOnlineOfflineListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingRequests();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private loadPendingRequests() {
    const stored = localStorage.getItem('pendingRequests');
    if (stored) {
      try {
        this.pendingRequests = JSON.parse(stored);
      } catch (error) {
        console.error('Error loading pending requests:', error);
        this.pendingRequests = [];
      }
    }
  }

  private savePendingRequests() {
    localStorage.setItem('pendingRequests', JSON.stringify(this.pendingRequests));
  }

  private addPendingRequest(method: string, url: string, data?: any) {
    const request = {
      id: Date.now().toString(),
      method,
      url,
      data,
      timestamp: Date.now(),
    };
    this.pendingRequests.push(request);
    this.savePendingRequests();
  }

  private async syncPendingRequests() {
    if (!this.isOnline || this.pendingRequests.length === 0) return;

    const requestsToProcess = [...this.pendingRequests];
    this.pendingRequests = [];
    this.savePendingRequests();

    for (const request of requestsToProcess) {
      try {
        await this.makeRequest(request.method, request.url, request.data);
      } catch (error) {
        console.error('Error syncing request:', error);
        // Re-add failed requests
        this.pendingRequests.push(request);
        this.savePendingRequests();
      }
    }
  }

  private async makeRequest<T>(
    method: string,
    url: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_BASE_URL}${url}`, config);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Request failed');
      }

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async get<T>(url: string): Promise<ApiResponse<T>> {
    if (!this.isOnline) {
      // Try to get from local storage
      const cached = this.getFromCache(url);
      if (cached) {
        return { success: true, data: cached };
      }
      return { success: false, error: 'Offline - no cached data available' };
    }

    return this.makeRequest<T>('GET', url);
  }

  async post<T>(url: string, data: any): Promise<ApiResponse<T>> {
    if (!this.isOnline) {
      this.addPendingRequest('POST', url, data);
      // Store in local storage for immediate use
      this.storeInCache(url, data);
      return { success: true, data: data as T };
    }

    return this.makeRequest<T>('POST', url, data);
  }

  async put<T>(url: string, data: any): Promise<ApiResponse<T>> {
    if (!this.isOnline) {
      this.addPendingRequest('PUT', url, data);
      this.storeInCache(url, data);
      return { success: true, data: data as T };
    }

    return this.makeRequest<T>('PUT', url, data);
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    if (!this.isOnline) {
      this.addPendingRequest('DELETE', url);
      return { success: true, data: {} as T };
    }

    return this.makeRequest<T>('DELETE', url);
  }

  private getFromCache(key: string): any {
    const cached = localStorage.getItem(`cache_${key}`);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        // Check if cache is still valid (24 hours)
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          return data;
        }
      } catch (error) {
        console.error('Error parsing cached data:', error);
      }
    }
    return null;
  }

  private storeInCache(key: string, data: any) {
    const cacheData = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
  }

  // Specific API methods
  async login(email: string, password: string) {
    return this.post('/auth/login', { email, password });
  }

  async getProducts() {
    return this.get('/products');
  }

  async getProductById(id: string) {
    return this.get(`/products/${id}`);
  }

  async createProduct(productData: any) {
    return this.post('/products', productData);
  }

  async updateProduct(id: string, productData: any) {
    return this.put(`/products/${id}`, productData);
  }

  async updateStock(id: string, stockChange: number) {
    return this.patch(`/products/${id}/stock`, { stockChange });
  }

  async deleteProduct(id: string) {
    return this.delete(`/products/${id}`);
  }

  async getInvoices() {
    return this.get('/invoices');
  }

  async getInvoiceById(id: string) {
    return this.get(`/invoices/${id}`);
  }

  async createInvoice(invoiceData: any) {
    return this.post('/invoices', invoiceData);
  }

  async searchInvoices(query: string, type: 'invoiceNumber' | 'customerContact') {
    const params = type === 'invoiceNumber' 
      ? `?invoiceNumber=${encodeURIComponent(query)}`
      : `?customerContact=${encodeURIComponent(query)}`;
    return this.get(`/invoices/search${params}`);
  }

  async getDashboardStats() {
    return this.get('/dashboard/stats');
  }

  async getSalesHistory(params?: { startDate?: string; endDate?: string; page?: number; limit?: number }) {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    return this.get(`/sales-history?${queryParams.toString()}`);
  }

  async createFinanceRecord(financeData: any) {
    return this.post('/finance', financeData);
  }

  async createOrderMemo(orderMemoData: any) {
    return this.post('/order-memo', orderMemoData);
  }

  async getFinanceRecords() {
    return this.get('/finance');
  }

  async getFinanceRecordById(id: string) {
    return this.get(`/finance/${id}`);
  }

  async updateFinanceRecord(id: string, financeData: any) {
    return this.put(`/finance/${id}`, financeData);
  }

  async deleteFinanceRecord(id: string) {
    return this.delete(`/finance/${id}`);
  }

  async getOrderMemos() {
    return this.get('/order-memo');
  }

  async getOrderMemoById(id: string) {
    return this.get(`/order-memo/${id}`);
  }

  async updateOrderMemo(id: string, orderMemoData: any) {
    return this.put(`/order-memo/${id}`, orderMemoData);
  }

  async deleteOrderMemo(id: string) {
    return this.delete(`/order-memo/${id}`);
  }

  async searchOrderMemos(query: string) {
    return this.get(`/order-memo/search?company=${encodeURIComponent(query)}`);
  }

  // Billing Cart methods
  async processSale(saleData: any) {
    return this.post('/billing-cart/process-sale', saleData);
  }

  async generateInvoice(invoiceNumber: string) {
    return this.post('/billing-cart/generate-invoice', { invoiceNumber });
  }

  // File upload method
  async uploadFile(file: File, type: 'finance' | 'orderMemo' | 'product') {
    if (!this.isOnline) {
      // Store file locally when offline
      const fileData = {
        name: file.name,
        size: file.size,
        type: file.type,
        data: await this.fileToBase64(file),
        uploadType: type,
        timestamp: Date.now()
      };
      
      const pendingUploads = JSON.parse(localStorage.getItem('pendingUploads') || '[]');
      pendingUploads.push(fileData);
      localStorage.setItem('pendingUploads', JSON.stringify(pendingUploads));
      
      return { success: true, data: { localPath: `local://${file.name}` } };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const token = localStorage.getItem('token');
    const headers: HeadersInit = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/upload/${type}`, {
        method: 'POST',
        headers,
        body: formData
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }

      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Upload failed' };
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }
}

export const apiService = new ApiService();
export default apiService;
