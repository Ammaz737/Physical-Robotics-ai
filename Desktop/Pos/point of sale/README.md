# POS System - Point of Sale with Offline Capabilities

A modern, full-stack Point of Sale system built with Next.js, Node.js, Express, and MySQL. Features offline-first architecture with PWA capabilities for seamless operation in both online and offline environments.

## 🚀 Features

### Core POS Features
- **Product Management**: Add, edit, and manage inventory with barcode support
- **Sales Processing**: Billing cart with real-time calculations and FBR tax support
- **Invoice Generation**: Professional invoices with unique invoice numbers
- **Customer Management**: Track customer information and purchase history
- **Sales History**: Comprehensive sales records with date filtering and analytics
- **Finance Records**: Upload and track check images with status management
- **Order Memos**: Company-wise booking slips with image uploads

### Offline Capabilities
- **PWA Support**: Install as a native app on mobile and desktop
- **Offline Storage**: Local data persistence using IndexedDB
- **Background Sync**: Automatic data synchronization when connection is restored
- **Service Worker**: Caches essential resources for offline use
- **Real-time Status**: Connection status indicators and sync notifications

### Technical Features
- **JWT Authentication**: Secure login with 16-hour token expiry
- **Responsive Design**: Modern UI that works on all device sizes
- **Image Upload**: Support for product images, check images, and booking slips
- **Data Export**: CSV export functionality for reports
- **Search & Filter**: Advanced search capabilities across all modules

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable icons
- **PWA**: Progressive Web App capabilities

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **Prisma ORM**: Database toolkit and ORM
- **MySQL**: Relational database
- **JWT**: JSON Web Token authentication
- **Multer**: File upload handling

### Offline Infrastructure
- **Service Worker**: Background scripts for offline functionality
- **IndexedDB**: Client-side database for offline storage
- **Cache API**: HTTP request caching
- **Background Sync**: Offline data synchronization

## 📁 Project Structure

```
point of sale/
├── backend/                 # Backend server
│   ├── src/
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Authentication & upload
│   │   ├── routes/         # API endpoints
│   │   └── server.ts       # Main server file
│   ├── prisma/             # Database schema & migrations
│   └── uploads/            # File storage
├── frontend/               # Frontend application
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets & PWA files
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "point of sale"
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Copy environment file
   cp env.example .env
   
   # Update .env with your database credentials
   DATABASE_URL="mysql://username:password@localhost:3306/pos_system"
   JWT_SECRET="your-secret-key"
   PORT=5000
   FRONTEND_URL="http://localhost:3000"
   
   # Generate Prisma client
   npx prisma generate
   
   # Run database migrations
   npx prisma db push
   
   # Seed database (optional)
   npx prisma db seed
   
   # Start backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Start development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📱 PWA Installation

The POS system can be installed as a Progressive Web App:

1. **Chrome/Edge**: Click the install icon in the address bar
2. **Mobile**: Add to home screen from browser menu
3. **Desktop**: Install prompt will appear automatically

## 🔐 Authentication

- **Default Admin**: Use the seeded admin account or create a new one
- **JWT Tokens**: 16-hour expiry with automatic refresh
- **Protected Routes**: All POS features require authentication

## 📊 Database Schema

The system includes the following main entities:
- **Users**: Authentication and user management
- **Products**: Inventory with barcode, pricing, and stock
- **Customers**: Customer information and contact details
- **Invoices**: Sales transactions with line items
- **Finance Records**: Check images and financial documents
- **Order Memos**: Company booking slips and memos

## 🔄 Offline Functionality

### How It Works
1. **Online Mode**: Normal operation with real-time server communication
2. **Offline Mode**: Data stored locally in IndexedDB
3. **Sync Process**: Automatic synchronization when connection is restored
4. **Conflict Resolution**: Server data takes precedence over offline changes

### Offline Features
- ✅ Product browsing and search
- ✅ Sales processing and invoice generation
- ✅ Data entry and form submissions
- ✅ Image uploads (queued for sync)
- ❌ Real-time stock updates
- ❌ Multi-user collaboration

## 🎨 UI Components

### Layout
- **Left Sidebar**: Navigation with all major sections
- **Top Bar**: Connection status and sync indicators
- **Main Content**: Responsive grid layouts for data display
- **Modals**: Forms for data entry and editing

### Design System
- **Color Scheme**: Blue primary with gray accents
- **Typography**: Inter font family for readability
- **Spacing**: Consistent 4px grid system
- **Components**: Reusable cards, buttons, and form elements

## 📱 Responsive Design

The system is fully responsive and optimized for:
- **Desktop**: Full-featured interface with sidebar navigation
- **Tablet**: Touch-friendly controls with adapted layouts
- **Mobile**: Mobile-first design with bottom navigation

## 🔧 Development

### Available Scripts

**Backend:**
```bash
npm run dev          # Development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run prisma:generate  # Generate Prisma client
npm run prisma:push      # Push schema changes to database
npm run prisma:seed      # Seed database with sample data
```

**Frontend:**
```bash
npm run dev          # Development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Code Quality
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Prisma**: Type-safe database operations

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Build the application: `npm run build`
3. Start the server: `npm run start`
4. Use PM2 or similar for process management

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `out` directory to your hosting service
3. Ensure service worker and manifest files are accessible

### PWA Requirements
- HTTPS enabled (required for service worker)
- Valid manifest.json
- Service worker registration
- Offline fallback pages

## 📝 API Documentation

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Invoices
- `GET /api/invoices` - List all invoices
- `POST /api/invoices` - Create new invoice
- `GET /api/invoices/:id` - Get invoice details

### Finance Records
- `GET /api/finance` - List finance records
- `POST /api/finance` - Upload check image
- `PUT /api/finance/:id` - Update record status

### Order Memos
- `GET /api/order-memo` - List all memos
- `POST /api/order-memo` - Create new memo
- `PUT /api/order-memo/:id` - Update memo
- `DELETE /api/order-memo/:id` - Delete memo

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**Developed by Muhammad Ammaz**  
**Contact: 03104518257**

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the developer directly
- Check the documentation and code comments

---

**Note**: This POS system is designed for production use with proper security measures. Always test thoroughly in a staging environment before deploying to production.
