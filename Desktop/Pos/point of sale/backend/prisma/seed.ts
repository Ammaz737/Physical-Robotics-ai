import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@pos.com' },
    update: {},
    create: {
      email: 'admin@pos.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin'
    }
  });

  console.log('👤 Created admin user:', adminUser.email);

  // Create sample products
  const products = [
    {
      barcode: '1234567890123',
      name: 'Coca Cola 330ml',
      weight: 0.33,
      purchasePrice: 15.0,
      salePrice: 25.0,
      stock: 100
    },
    {
      barcode: '2345678901234',
      name: 'Pepsi 330ml',
      weight: 0.33,
      purchasePrice: 14.0,
      salePrice: 24.0,
      stock: 150
    },
    {
      barcode: '3456789012345',
      name: 'Kit Kat Chocolate',
      weight: 0.045,
      purchasePrice: 30.0,
      salePrice: 50.0,
      stock: 75
    },
    {
      barcode: '4567890123456',
      name: 'Lay\'s Chips 50g',
      weight: 0.05,
      purchasePrice: 40.0,
      salePrice: 60.0,
      stock: 200
    },
    {
      barcode: '5678901234567',
      name: 'Milk Pack 1L',
      weight: 1.0,
      purchasePrice: 80.0,
      salePrice: 120.0,
      stock: 50
    },
    {
      barcode: '6789012345678',
      name: 'Bread Loaf',
      weight: 0.4,
      purchasePrice: 45.0,
      salePrice: 70.0,
      stock: 30
    },
    {
      barcode: '7890123456789',
      name: 'Energy Drink 250ml',
      weight: 0.25,
      purchasePrice: 100.0,
      salePrice: 150.0,
      stock: 80
    },
    {
      barcode: '8901234567890',
      name: 'Mineral Water 1.5L',
      weight: 1.5,
      purchasePrice: 25.0,
      salePrice: 40.0,
      stock: 120
    },
    {
      barcode: '9012345678901',
      name: 'Biscuits Pack',
      weight: 0.2,
      purchasePrice: 35.0,
      salePrice: 55.0,
      stock: 90
    },
    {
      barcode: '0123456789012',
      name: 'Ice Cream Cup',
      weight: 0.125,
      purchasePrice: 60.0,
      salePrice: 100.0,
      stock: 40
    }
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { barcode: productData.barcode },
      update: {},
      create: productData
    });
  }

  console.log('📦 Created sample products');

  // Create sample customers
  const customers = [
    {
      name: 'John Doe',
      contact: '03001234567',
      email: 'john@example.com'
    },
    {
      name: 'Jane Smith',
      contact: '03111234567',
      email: 'jane@example.com'
    },
    {
      name: 'Ahmad Ali',
      contact: '03211234567',
      email: 'ahmad@example.com'
    }
  ];

  for (const customerData of customers) {
    await prisma.customer.upsert({
      where: { contact: customerData.contact },
      update: {},
      create: customerData
    });
  }

  console.log('👥 Created sample customers');

  // Create sample finance records
  const financeRecords = [
    {
      checkImage: '/uploads/finance/sample-check-1.jpg',
      date: new Date('2024-01-15'),
      status: 'Clear',
      amount: 50000,
      notes: 'Payment from ABC Company'
    },
    {
      checkImage: '/uploads/finance/sample-check-2.jpg',
      date: new Date('2024-01-20'),
      status: 'Pending',
      amount: 75000,
      notes: 'Payment from XYZ Corp'
    },
    {
      checkImage: '/uploads/finance/sample-check-3.jpg',
      date: new Date('2024-01-10'),
      status: 'Bounce',
      amount: 25000,
      notes: 'Insufficient funds - DEF Ltd'
    }
  ];

  for (const recordData of financeRecords) {
    await prisma.financeRecord.create({
      data: recordData
    });
  }

  console.log('💰 Created sample finance records');

  // Create sample order memos
  const orderMemos = [
    {
      company: 'ABC Trading Co.',
      bookingSlip: '/uploads/order-memos/booking-slip-1.jpg',
      date: new Date('2024-01-18'),
      amount: 150000,
      notes: 'Bulk order for electronics'
    },
    {
      company: 'XYZ Retailers',
      bookingSlip: '/uploads/order-memos/booking-slip-2.jpg',
      date: new Date('2024-01-22'),
      amount: 200000,
      notes: 'Monthly supply order'
    },
    {
      company: 'DEF Wholesale',
      bookingSlip: '/uploads/order-memos/booking-slip-3.jpg',
      date: new Date('2024-01-25'),
      amount: 85000,
      notes: 'Special discount order'
    }
  ];

  for (const memoData of orderMemos) {
    await prisma.orderMemo.create({
      data: memoData
    });
  }

  console.log('📝 Created sample order memos');

  console.log('✅ Database seeded successfully!');
  console.log('\n📋 Default Login Credentials:');
  console.log('Email: admin@pos.com');
  console.log('Password: admin123');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
