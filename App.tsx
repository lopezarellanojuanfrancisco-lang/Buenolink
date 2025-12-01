import React, { useState } from 'react';
import { CURRENT_USER_ADMIN, CURRENT_USER_BUSINESS, MOCK_BUSINESSES } from './constants';
import { Role, User, PlanType } from './types';
import Layout from './components/Layout';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import BusinessDashboard from './pages/BusinessApp';
import { ShieldCheck, Store, ChevronRight, Fingerprint } from 'lucide-react';

// Simple Auth State for Demo
type AuthState = 'LOGIN' | 'APP';

const App: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>('LOGIN');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('dashboard');

  const handleLogin = (role: Role) => {
    if (role === Role.SUPERADMIN) {
      setCurrentUser(CURRENT_USER_ADMIN);
    } else {
      setCurrentUser(CURRENT_USER_BUSINESS);
    }
    setAuthState('APP');
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthState('LOGIN');
  };

  if (authState === 'LOGIN') {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-brand-500 to-brand-600 rounded-b-[3rem] shadow-lg z-0"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl z-0"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl z-0"></div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-md mx-auto">
          
          {/* Brand Header */}
          <div className="text-center mb-10 mt-10">
            <div className="bg-white w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-800/20 rotate-3">
               <span className="text-brand-600 text-5xl font-black">C</span>
            </div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">CuponeraPro</h1>
            <p className="text-brand-100 font-medium">SaaS Operativo para Negocios</p>
          </div>
          
          {/* Login Cards Container */}
          <div className="w-full space-y-4 animate-in slide-in-from-bottom-10 fade-in duration-700">
            <p className="text-center text-slate-500 text-sm font-bold uppercase tracking-widest mb-4">Selecciona tu perfil</p>
            
            {/* Business Owner Card */}
            <button 
              onClick={() => handleLogin(Role.BUSINESS_OWNER)}
              className="w-full bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between group active:scale-[0.98] transition-all hover:shadow-md hover:border-brand-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors">
                  <Store size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-800 text-lg">Dueño de Negocio</h3>
                  <p className="text-xs text-slate-500">Demo Premium (Restaurante)</p>
                </div>
              </div>
              <div className="text-slate-300 group-hover:text-brand-500 transition-colors">
                <ChevronRight size={24} />
              </div>
            </button>

            {/* Super Admin Card */}
            <button 
              onClick={() => handleLogin(Role.SUPERADMIN)}
              className="w-full bg-slate-900 p-5 rounded-2xl shadow-xl shadow-slate-200 flex items-center justify-between group active:scale-[0.98] transition-all border border-slate-800 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-slate-800/50 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300"></div>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center border border-slate-700">
                  <ShieldCheck size={24} />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-white text-lg">Francisco</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Fingerprint size={12} /> Acceso Superadmin
                  </p>
                </div>
              </div>
              <div className="text-slate-600 group-hover:text-white transition-colors relative z-10">
                <ChevronRight size={24} />
              </div>
            </button>
          </div>

          <div className="mt-auto pt-10 pb-4">
            <p className="text-center text-[10px] text-slate-400 font-medium">
              MVP Demo v1.0 • Mobile First Architecture
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Determine Plan for current user (if business)
  let currentPlan = PlanType.BASIC;
  if (currentUser?.role === Role.BUSINESS_OWNER && currentUser.businessId) {
    const business = MOCK_BUSINESSES.find(b => b.id === currentUser.businessId);
    if (business) currentPlan = business.plan;
  }

  return (
    <Layout 
      user={currentUser!} 
      onLogout={handleLogout} 
      currentView={currentView}
      onNavigate={setCurrentView}
      plan={currentUser?.role !== Role.SUPERADMIN ? currentPlan : undefined}
    >
      {currentUser?.role === Role.SUPERADMIN ? (
        <SuperAdminDashboard currentView={currentView} />
      ) : (
        <BusinessDashboard 
          currentView={currentView} 
          user={currentUser!} 
          plan={currentPlan} 
          onNavigate={setCurrentView}
        />
      )}
    </Layout>
  );
};

export default App;