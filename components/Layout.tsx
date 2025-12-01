import React from 'react';
import { LayoutDashboard, Users, ShoppingBag, Gift, MessageSquare, Settings, LogOut, Coffee, Utensils } from 'lucide-react';
import { Role, User, PlanType } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
  currentView: string;
  onNavigate: (view: string) => void;
  plan?: PlanType;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout, currentView, onNavigate, plan }) => {
  const isSuperAdmin = user.role === Role.SUPERADMIN;

  const adminMenu = [
    { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
    // Removed 'businesses' as requested since management is now handled in the main dashboard
  ];

  const businessMenu = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'orders', label: 'Pedidos', icon: ShoppingBag }, // Premium check in page
    { id: 'menu', label: 'Menú', icon: Utensils }, // Premium check in page
    { id: 'crm', label: 'Mensajes', icon: MessageSquare }, // Premium check in page
    { id: 'coupons', label: 'Cupones', icon: Gift },
    { id: 'ai', label: 'Marketing IA', icon: Users }, // Intermediate+ check in page
  ];

  const menu = isSuperAdmin ? adminMenu : businessMenu;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 pb-20 md:pb-0 md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="bg-brand-500 p-2 rounded-lg text-white">
            <Coffee size={20} />
          </div>
          <span className="font-bold text-xl text-slate-800">CuponeraPro</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                currentView === item.id 
                  ? 'bg-brand-50 text-brand-600 font-medium' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
            <div className="bg-slate-50 p-3 rounded-lg mb-4">
                <p className="text-sm font-medium text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{isSuperAdmin ? 'Super Admin' : `Plan ${plan}`}</p>
            </div>
          <button onClick={onLogout} className="w-full flex items-center gap-2 text-red-500 px-4 py-2 text-sm hover:bg-red-50 rounded-lg">
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-white p-4 border-b border-slate-200 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-2">
           <div className="bg-brand-500 p-1.5 rounded-lg text-white">
            <Coffee size={18} />
          </div>
          <h1 className="font-bold text-lg">CuponeraPro</h1>
        </div>
        <button onClick={onLogout} className="text-slate-500">
            <LogOut size={20} />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-30 pb-safe">
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center p-2 rounded-lg ${
              currentView === item.id ? 'text-brand-600' : 'text-slate-400'
            }`}
          >
            <item.icon size={24} />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Layout;