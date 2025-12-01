
import { Business, Client, Order, PlanType, Role, User } from './types';

export const MOCK_BUSINESSES: Business[] = [
  {
    id: 'b1',
    name: 'Tacos El Primo',
    ownerName: 'Juan Pérez',
    phone: '5512345678',
    plan: PlanType.PREMIUM,
    status: 'ACTIVE',
    joinedAt: '2023-01-15',
    subscriptionEndsAt: '2024-01-15', // 1 Year term
    term: '12_MONTHS',
    lastPaymentDate: '2023-01-15',
    registeredClients: 154,
    totalSales: 45200,
    currentOnboardingStep: 99 // Completed
  },
  {
    id: 'b2',
    name: 'Café Aroma',
    ownerName: 'Maria Lopez',
    phone: '5587654321',
    plan: PlanType.PREMIUM, // Trial usually gives access to everything
    status: 'TRIAL',
    joinedAt: '2023-10-20',
    trialEndsAt: new Date(Date.now() + 86400000 * 2).toISOString(), // Expires in 2 days
    registeredClients: 42,
    totalSales: 8500,
    currentOnboardingStep: 3 // On step 3
  },
  {
    id: 'b3',
    name: 'Barbería Styles',
    ownerName: 'Pedro Gil',
    phone: '5511223344',
    plan: PlanType.INTERMEDIATE,
    status: 'ACTIVE',
    joinedAt: '2023-06-01',
    subscriptionEndsAt: '2023-12-01',
    term: '6_MONTHS',
    lastPaymentDate: '2023-06-01',
    registeredClients: 89,
    totalSales: 12400,
    currentOnboardingStep: 99 // Completed
  },
  {
    id: 'b4',
    name: 'Sushi Roll Express',
    ownerName: 'Ana Paula',
    phone: '5599887766',
    plan: PlanType.BASIC,
    status: 'EXPIRED',
    joinedAt: '2023-09-01',
    trialEndsAt: '2023-09-15',
    registeredClients: 5,
    totalSales: 0,
    currentOnboardingStep: 2 // Stuck on step 2
  },
  {
    id: 'b5',
    name: 'Burger Kingo',
    ownerName: 'Luis Miguel',
    phone: '5566778899',
    plan: PlanType.PREMIUM,
    status: 'TRIAL',
    joinedAt: new Date().toISOString(), // Just joined
    trialEndsAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    registeredClients: 0,
    totalSales: 0,
    currentOnboardingStep: 1 // On step 1
  }
];

export const MOCK_ORDERS: Order[] = [
  { id: '101', clientName: 'Ana G.', total: 250, status: 'NEW', items: ['2x Tacos Pastor', '1x Coca'], createdAt: '10:30 AM', source: 'WHATSAPP' },
  { id: '102', clientName: 'Carlos M.', total: 120, status: 'PREPARING', items: ['1x Torta Cubana'], createdAt: '10:45 AM', source: 'WHATSAPP' },
  { id: '103', clientName: 'Luis R.', total: 500, status: 'READY', items: ['Family Pack'], createdAt: '11:00 AM', source: 'LOCAL' },
  { id: '104', clientName: 'Sofia T.', total: 180, status: 'DELIVERED', items: ['3x Gringas'], createdAt: '09:15 AM', source: 'WHATSAPP' },
];

export const MOCK_CLIENTS: Client[] = [
  { id: 'c1', name: 'Ana Garcia', phone: '555-0001', visits: 5, lastVisit: '2023-10-20', points: 50 },
  { id: 'c2', name: 'Carlos Mendez', phone: '555-0002', visits: 12, lastVisit: '2023-10-22', points: 120 },
  { id: 'c3', name: 'Sofia Torres', phone: '555-0003', visits: 1, lastVisit: '2023-09-01', points: 10 },
];

export const CURRENT_USER_ADMIN: User = {
  id: 'u1',
  name: 'Francisco (Superadmin)',
  role: Role.SUPERADMIN
};

export const CURRENT_USER_BUSINESS: User = {
  id: 'u2',
  name: 'Juan Pérez',
  role: Role.BUSINESS_OWNER,
  businessId: 'b1'
};