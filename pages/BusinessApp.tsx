import React, { useState } from 'react';
import { PlanType, User, FeatureKey, PLAN_FEATURES } from '../types';
import BusinessDashboard from './business/Dashboard';
import Orders from './business/Orders';
import CRM from './business/CRM';
import MarketingAI from './business/MarketingAI';
import Coupons from './business/Coupons';
import MassMessages from './business/MassMessages';
import Menu from './business/Menu';
import { Lock } from 'lucide-react';

interface Props {
  currentView: string;
  user: User;
  plan: PlanType;
  onNavigate: (view: string, params?: any) => void;
}

const AccessDenied: React.FC<{ featureName: string; requiredPlan: string }> = ({ featureName, requiredPlan }) => (
  <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
    <div className="bg-slate-100 p-4 rounded-full">
        <Lock size={48} className="text-slate-400" />
    </div>
    <h2 className="text-2xl font-bold text-slate-900">Función Bloqueada</h2>
    <p className="text-slate-500 max-w-sm">
      El módulo de <b>{featureName}</b> está disponible exclusivamente en el plan <span className="text-brand-600 font-bold">{requiredPlan}</span>.
    </p>
    <button className="bg-gradient-to-r from-brand-500 to-brand-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-brand-200 hover:shadow-brand-300 transition-all">
      Mejorar mi Plan
    </button>
  </div>
);

const BusinessApp: React.FC<Props> = ({ currentView, user, plan, onNavigate }) => {
  // State to hold parameters passed between views (e.g., coupon data to mass messages)
  const [navParams, setNavParams] = useState<any>(null);

  const handleNavigate = (view: string, params?: any) => {
    setNavParams(params || null);
    onNavigate(view);
  };
  
  const hasAccess = (feature: FeatureKey) => {
    return PLAN_FEATURES[feature].includes(plan);
  };

  switch (currentView) {
    case 'dashboard':
      return <BusinessDashboard plan={plan} onNavigate={handleNavigate} />;
      
    case 'orders':
      if (!hasAccess('sales_tracking')) return <AccessDenied featureName="Control de Pedidos" requiredPlan="PREMIUM" />;
      return <Orders />;

    case 'menu':
      if (!hasAccess('menu')) return <AccessDenied featureName="Menú Digital" requiredPlan="PREMIUM" />;
      return <Menu onNavigate={handleNavigate} />;

    case 'crm':
      if (!hasAccess('crm')) return <AccessDenied featureName="CRM & Kanban" requiredPlan="PREMIUM" />;
      return <CRM />;

    case 'ai':
      if (!hasAccess('ai')) return <AccessDenied featureName="Inteligencia Artificial" requiredPlan="INTERMEDIO" />;
      return <MarketingAI onNavigate={handleNavigate} />;
      
    case 'coupons':
      return <Coupons onNavigate={handleNavigate} />;

    case 'mass_messages':
      return <MassMessages onNavigate={handleNavigate} plan={plan} initialParams={navParams} />;

    default:
      return <BusinessDashboard plan={plan} onNavigate={handleNavigate} />;
  }
};

export default BusinessApp;