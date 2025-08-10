'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Plus, 
  Package, 
  History, 
  ShoppingCart, 
  FileText, 
  DollarSign, 
  ClipboardList,
  LogOut
} from 'lucide-react';

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/add-product', icon: Plus, label: 'Add Product' },
    { href: '/products', icon: Package, label: 'All Products' },
    { href: '/sales-history', icon: History, label: 'Sales History' },
    { href: '/billing-cart', icon: ShoppingCart, label: 'Billing Cart' },
    { href: '/invoices', icon: FileText, label: 'View Invoices' },
    { href: '/finance', icon: DollarSign, label: 'Finance Record' },
    { href: '/order-memo', icon: ClipboardList, label: 'Order Memo' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="w-64 bg-gray-900 min-h-screen fixed left-0 top-0 z-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-8">POS System</h1>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors w-full"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
