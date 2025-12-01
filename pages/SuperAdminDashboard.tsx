
import React, { useState } from 'react';
import { MOCK_BUSINESSES } from '../constants';
import { PlanType, Business, SubscriptionTerm } from '../types';
import { PlanBadge } from '../components/PlanBadge';
import { 
  Users, 
  DollarSign, 
  Activity, 
  Plus, 
  Calendar, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  ShieldCheck, 
  X,
  UserCheck,
  Ban,
  ArrowRight,
  Globe,
  Loader2,
  Receipt,
  Sparkles,
  Zap,
  MessageCircle,
  MoreVertical,
  Paperclip,
  Smile,
  Send,
  Bot,
  PlayCircle,
  Image as ImageIcon,
  Mic,
  FileText,
  ToggleLeft,
  ToggleRight,
  Edit3,
  CalendarDays,
  AlertTriangle,
  Hourglass,
  Wallet,
  Trash2,
  Settings,
  Archive,
  UserX,
  LayoutGrid,
  Timer,
  Sun,
  Moon,
  BarChart3,
  ListFilter,
  ChevronRight,
  Filter,
  Briefcase,
  Megaphone,
  Video,
  ArrowLeft
} from 'lucide-react';

interface Props {
  currentView: string;
}

// Updated Onboarding Interface for better timing control
interface OnboardingStep {
    id: number;
    title: string;
    type: 'text' | 'image' | 'video' | 'audio' | 'pdf';
    content: string;
    status: 'sent' | 'pending';
    
    // New Timing Logic
    trigger: 'registration' | 'scheduled'; 
    delayMinutes?: number; // Only for 'registration' (0 = immediate, 5 = 5 mins later)
    dayOffset?: number; // Only for 'scheduled' (1 = tomorrow, 2 = day after)
    timeOfDay?: string; // Only for 'scheduled' (e.g. "10:00")
}

// Mock Onboarding Sequence Data
const INITIAL_SEQUENCE: OnboardingStep[] = [
    {
        id: 1,
        title: "Bienvenida + Tutorial Inicial",
        type: "video",
        content: "Hola! Bienvenido a CuponeraPro. Mira este video de 1 min para configurar tu primera campaña.",
        status: "sent",
        trigger: 'registration',
        delayMinutes: 0 // Immediate
    },
    {
        id: 2,
        title: "Tips: Cómo captar clientes",
        type: "audio",
        content: "Nota de voz: Tip de experto para que tus clientes escaneen el QR.",
        status: "pending",
        trigger: 'registration',
        delayMinutes: 60 // 1 hour later
    },
    {
        id: 3,
        title: "Recursos Gráficos",
        type: "image",
        content: "Te regalo esta imagen para que la subas a tus historias de Instagram avisando de tu nueva cuponera.",
        status: "pending",
        trigger: 'scheduled',
        dayOffset: 1, // Tomorrow
        timeOfDay: "10:00"
    },
    {
        id: 4,
        title: "Check-in de Progreso",
        type: "text",
        content: "¿Cómo vas? Vi que ya tienes 10 clientes registrados. ¿Necesitas ayuda con algo?",
        status: "pending",
        trigger: 'scheduled',
        dayOffset: 3,
        timeOfDay: "09:00"
    },
    {
        id: 5,
        title: "Cierre de Venta (Urgencia)",
        type: "text",
        content: "⚠️ Tu periodo de prueba vence mañana. Aprovecha el 20% de descuento si contratas el Plan Anual hoy.",
        status: "pending",
        trigger: 'scheduled',
        dayOffset: 14,
        timeOfDay: "12:00"
    }
];

const MetricCard: React.FC<{
    icon: any, 
    color: string, 
    label: string, 
    value: number, 
    sub: string
}> = ({ icon: Icon, color, label, value, sub }) => {
    // Color variants map for Tailwind
    const colors: Record<string, string> = {
        green: 'bg-green-100 text-green-700 border-green-200',
        blue: 'bg-blue-100 text-blue-700 border-blue-200',
        orange: 'bg-orange-100 text-orange-700 border-orange-200',
        red: 'bg-red-100 text-red-700 border-red-200',
        indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
        rose: 'bg-rose-100 text-rose-700 border-rose-200',
        slate: 'bg-slate-100 text-slate-700 border-slate-200',
        violet: 'bg-violet-100 text-violet-700 border-violet-200',
    };

    const style = colors[color] || colors.slate;

    return (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${style} bg-opacity-50`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                <h3 className="text-2xl font-black text-slate-800 leading-none my-0.5">{value}</h3>
                <p className="text-[10px] font-medium opacity-60 text-slate-600">{sub}</p>
            </div>
        </div>
    );
};

// Unified Tab Type
type TabType = 'trial' | 'active' | 'expired' | string; // string for "step_1", "step_2", etc.
type MainSection = 'funnel' | 'clients';

// Broadcast Types
type BroadcastStep = 'select' | 'compose' | 'sending' | 'success';
type BroadcastFilter = 'all' | 'trial' | 'active' | 'expired';
type AttachmentType = 'none' | 'image' | 'video' | 'audio' | 'pdf';

const SuperAdminDashboard: React.FC<Props> = ({ currentView }) => {
  const [businesses, setBusinesses] = useState<Business[]>(MOCK_BUSINESSES);
  
  // MAIN NAVIGATION STATE
  const [mainSection, setMainSection] = useState<MainSection>('funnel');

  // SUB-TAB STATE (Depends on main section)
  const [activeTab, setActiveTab] = useState<string>('all_trials');
  
  // --- STATE FOR MODALS ---
  const [showNewDemoModal, setShowNewDemoModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showOnboardingConfig, setShowOnboardingConfig] = useState(false);
  
  // Broadcast State
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastStep, setBroadcastStep] = useState<BroadcastStep>('select');
  const [broadcastFilter, setBroadcastFilter] = useState<BroadcastFilter>('all');
  const [selectedBusinessIds, setSelectedBusinessIds] = useState<string[]>([]);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastAttachment, setBroadcastAttachment] = useState<AttachmentType>('none');
  const [broadcastScheduleMode, setBroadcastScheduleMode] = useState<'now' | 'later'>('now');
  const [broadcastDate, setBroadcastDate] = useState('');
  const [broadcastProgress, setBroadcastProgress] = useState(0);

  // 360 View Modal State
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [detailRightTab, setDetailRightTab] = useState<'chat' | 'onboarding'>('chat');
  
  // Onboarding State
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>(INITIAL_SEQUENCE);
  const [editingStep, setEditingStep] = useState<Partial<OnboardingStep> | null>(null);

  // Forms
  const [demoForm, setDemoForm] = useState({ name: '', owner: '', phone: '', plan: PlanType.PREMIUM }); 
  
  // Advanced Subscription Form
  const [subForm, setSubForm] = useState<{
      plan: PlanType, 
      customPrice: number, 
      durationMonths: number, 
      method: string
  }>({ 
      plan: PlanType.INTERMEDIATE, 
      customPrice: 599,
      durationMonths: 1,
      method: 'CASH'
  });

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // --- CALCULATE STATS ---
  const stats = {
      active: businesses.filter(b => b.status === 'ACTIVE').length,
      trial: businesses.filter(b => b.status === 'TRIAL').length,
      expired: businesses.filter(b => b.status === 'EXPIRED').length,
      suspended: businesses.filter(b => b.status === 'SUSPENDED').length,
      waiting: 5, 
      processing: 2,
      overdue: 4,
      inactive: 12
  };

  const totalClients = businesses.length + stats.waiting + stats.inactive + stats.overdue;

  // --- LOGIC HELPERS ---
  const getDaysLeft = (dateStr?: string) => {
      if (!dateStr) return 0;
      const diff = new Date(dateStr).getTime() - Date.now();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days > 0 ? days : 0;
  };

  const getProgressColor = (daysLeft: number, totalDays: number) => {
      const percentage = (daysLeft / totalDays) * 100;
      if (percentage > 50) return 'bg-green-500';
      if (percentage > 20) return 'bg-yellow-500';
      return 'bg-red-500';
  };

  const getStepDisplayTime = (step: OnboardingStep) => {
      if (step.trigger === 'registration') {
          if (step.delayMinutes === 0) return 'Inmediatamente al registrarse';
          return `${step.delayMinutes} min después del registro`;
      } else {
          return `Día ${step.dayOffset} a las ${step.timeOfDay}`;
      }
  };

  const getDayLabel = (day: number) => {
      if (day === 1) return "Mañana (Día siguiente al registro)";
      if (day === 2) return "Pasado mañana";
      return `${day} días después del registro`;
  };

  const getScheduledDate = (baseDateStr: string, step: OnboardingStep) => {
      const baseDate = new Date(baseDateStr);
      let targetDate = new Date(baseDate);
      
      if (step.trigger === 'registration') {
         targetDate.setMinutes(targetDate.getMinutes() + (step.delayMinutes || 0));
      } else {
         targetDate.setDate(baseDate.getDate() + (step.dayOffset || 1));
         const [hours, minutes] = (step.timeOfDay || '09:00').split(':').map(Number);
         targetDate.setHours(hours, minutes, 0, 0);
      }
      
      const today = new Date();
      const isToday = targetDate.getDate() === today.getDate() && targetDate.getMonth() === today.getMonth();
      const isPast = targetDate < today;
      
      return {
          dateString: targetDate.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' }),
          timeString: targetDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute:'2-digit' }),
          isToday,
          isPast
      };
  };

  const BASE_PRICES = {
      [PlanType.BASIC]: 299,
      [PlanType.INTERMEDIATE]: 599,
      [PlanType.PREMIUM]: 999
  };

  // --- ACTIONS ---

  const handleCreateDemo = () => {
      const newBusiness: Business = {
          id: `b-${Date.now()}`,
          name: demoForm.name,
          ownerName: demoForm.owner,
          phone: demoForm.phone,
          plan: demoForm.plan,
          status: 'TRIAL',
          joinedAt: new Date().toISOString(),
          trialEndsAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          registeredClients: 0,
          totalSales: 0,
          currentOnboardingStep: 1
      };
      setBusinesses([newBusiness, ...businesses]);
      setShowNewDemoModal(false);
      setDemoForm({ name: '', owner: '', phone: '', plan: PlanType.PREMIUM });
      // Force switch to funnel/trials
      setMainSection('funnel');
      setActiveTab('all_trials'); 
  };

  const handleExtendTrial = (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      if(confirm('¿Darle 15 días más de prueba gratis a este cliente?')) {
          setBusinesses(businesses.map(b => {
              if (b.id !== id) return b;
              const currentEnd = b.trialEndsAt ? new Date(b.trialEndsAt).getTime() : Date.now();
              const baseTime = Math.max(currentEnd, Date.now());
              return {
                  ...b,
                  status: 'TRIAL',
                  trialEndsAt: new Date(baseTime + 15 * 24 * 60 * 60 * 1000).toISOString()
              };
          }));
      }
  };

  const openSubscriptionModal = (business: Business, e?: React.MouseEvent) => {
      if(e) e.stopPropagation();
      setSelectedBusiness(business);
      setSubForm({ 
          plan: business.plan, 
          customPrice: BASE_PRICES[business.plan], 
          durationMonths: 1, 
          method: 'CASH' 
      });
      setShowSubscriptionModal(true);
      setShowDetailModal(false);
  };

  const openDetailModal = (business: Business) => {
      setSelectedBusiness(business);
      // Logic for modal tabs: If active, show chat. If trial, show onboarding.
      setDetailRightTab(business.status === 'TRIAL' ? 'onboarding' : 'chat'); 
      setShowDetailModal(true);
  };

  const handlePlanChange = (plan: PlanType) => {
      setSubForm(prev => ({
          ...prev,
          plan: plan,
          customPrice: BASE_PRICES[plan]
      }));
  };

  const simulateDigitalPayment = (method: string) => {
      if (isProcessingPayment) return;
      setSubForm(prev => ({ ...prev, method }));
      
      setIsProcessingPayment(true);
      setTimeout(() => {
          setIsProcessingPayment(false);
          handleRegisterSubscription(method); 
      }, 2000);
  };

  const handleRegisterSubscription = (forcedMethod?: string) => {
      if (!selectedBusiness) return;

      const nextDate = new Date();
      nextDate.setMonth(nextDate.getMonth() + subForm.durationMonths);

      setBusinesses(businesses.map(b => {
          if (b.id !== selectedBusiness.id) return b;
          return {
              ...b,
              status: 'ACTIVE',
              plan: subForm.plan,
              term: subForm.durationMonths === 12 ? '12_MONTHS' : '1_MONTH',
              lastPaymentDate: new Date().toISOString(),
              subscriptionEndsAt: nextDate.toISOString(),
              trialEndsAt: undefined,
              currentOnboardingStep: 99 // Mark onboarding as completed/irrelevant
          };
      }));

      setShowSubscriptionModal(false);
      setSelectedBusiness(null);
      
      // Auto switch to clients tab to show result
      setMainSection('clients');
      setActiveTab('active');
  };

  // --- BROADCAST ACTIONS ---
  
  const getFilteredBusinessesForBroadcast = () => {
    return businesses.filter(b => {
      if (broadcastFilter === 'all') return true;
      if (broadcastFilter === 'trial') return b.status === 'TRIAL';
      if (broadcastFilter === 'active') return b.status === 'ACTIVE';
      if (broadcastFilter === 'expired') return b.status === 'EXPIRED' || b.status === 'SUSPENDED';
      return true;
    });
  };

  const toggleBusinessSelection = (id: string) => {
    if (selectedBusinessIds.includes(id)) {
      setSelectedBusinessIds(selectedBusinessIds.filter(bid => bid !== id));
    } else {
      setSelectedBusinessIds([...selectedBusinessIds, id]);
    }
  };

  const toggleSelectAllBroadcast = () => {
    const filtered = getFilteredBusinessesForBroadcast();
    const allSelected = filtered.every(b => selectedBusinessIds.includes(b.id));
    if (allSelected) {
      // Unselect only the visible ones
      const visibleIds = filtered.map(b => b.id);
      setSelectedBusinessIds(selectedBusinessIds.filter(id => !visibleIds.includes(id)));
    } else {
      // Select all visible
      const visibleIds = filtered.map(b => b.id);
      const newSelection = new Set([...selectedBusinessIds, ...visibleIds]);
      setSelectedBusinessIds(Array.from(newSelection));
    }
  };

  const handleBroadcastStart = () => {
    setBroadcastStep('sending');
    setBroadcastProgress(0);
    const interval = setInterval(() => {
        setBroadcastProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                setBroadcastStep('success');
                return 100;
            }
            return prev + 5;
        });
    }, 100);
  };

  const closeBroadcastModal = () => {
    setShowBroadcastModal(false);
    // Reset state after closing
    setTimeout(() => {
        setBroadcastStep('select');
        setBroadcastMessage('');
        setSelectedBusinessIds([]);
        setBroadcastAttachment('none');
        setBroadcastScheduleMode('now');
    }, 500);
  };

  // --- ONBOARDING CRUD ACTIONS ---
  const handleAddNewStep = () => {
      const newStep: Partial<OnboardingStep> = {
          id: Date.now(),
          title: "Nuevo Mensaje",
          type: "text",
          content: "",
          trigger: 'scheduled',
          dayOffset: 1,
          timeOfDay: '09:00',
          status: "pending"
      };
      setEditingStep(newStep);
  };

  const handleDeleteStep = (id: number) => {
      if (confirm('¿Estás seguro de eliminar este mensaje de la secuencia?')) {
          setOnboardingSteps(prev => prev.filter(s => s.id !== id));
      }
  };

  const handleSaveStep = () => {
      if (!editingStep) return;
      
      const finalStep = editingStep as OnboardingStep;
      if (finalStep.trigger === 'scheduled' && (!finalStep.dayOffset || finalStep.dayOffset < 1)) {
          finalStep.dayOffset = 1;
      }

      setOnboardingSteps(prev => {
          const exists = prev.find(s => s.id === finalStep.id);
          let newSteps;
          if (exists) {
              newSteps = prev.map(s => s.id === finalStep.id ? finalStep : s);
          } else {
              newSteps = [...prev, finalStep];
          }
          
          return newSteps.sort((a, b) => {
              if (a.trigger === 'registration' && b.trigger === 'scheduled') return -1;
              if (a.trigger === 'scheduled' && b.trigger === 'registration') return 1;
              
              if (a.trigger === 'registration' && b.trigger === 'registration') {
                  return (a.delayMinutes || 0) - (b.delayMinutes || 0);
              }
              if (a.trigger === 'scheduled' && b.trigger === 'scheduled') {
                  if ((a.dayOffset || 0) !== (b.dayOffset || 0)) {
                      return (a.dayOffset || 0) - (b.dayOffset || 0);
                  }
                  return (a.timeOfDay || '').localeCompare(b.timeOfDay || '');
              }
              return 0;
          });
      });
      setEditingStep(null);
  };

  // --- DERIVED DATA ---
  const trials = businesses.filter(b => b.status === 'TRIAL');
  const actives = businesses.filter(b => b.status === 'ACTIVE');
  const expired = businesses.filter(b => b.status === 'EXPIRED' || b.status === 'SUSPENDED');

  // --- RENDER ---
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen flex flex-col">
      
      {/* --- MASTER NAVIGATION (Funnel vs Clients) --- */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4">
        
        {/* Toggle Sections */}
        <div className="bg-white p-1 rounded-2xl shadow-sm border border-slate-200 flex w-full lg:w-auto overflow-x-auto no-scrollbar">
             <button 
                onClick={() => { setMainSection('funnel'); setActiveTab('all_trials'); }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm whitespace-nowrap ${
                    mainSection === 'funnel' 
                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-200' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
             >
                 <Filter size={18} />
                 EMBUDO (Prospectos)
             </button>
             <button 
                onClick={() => { setMainSection('clients'); setActiveTab('active'); }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all text-sm whitespace-nowrap ${
                    mainSection === 'clients' 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-300' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
             >
                 <Briefcase size={18} />
                 CLIENTES (Cartera)
             </button>
        </div>

        {/* Conditional Actions */}
        <div className="flex gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar">
            <button 
                onClick={() => setShowBroadcastModal(true)}
                className="whitespace-nowrap bg-indigo-50 border border-indigo-100 text-indigo-700 px-5 py-3 rounded-xl font-bold hover:bg-indigo-100 transition-all flex items-center justify-center gap-2 shadow-sm text-sm"
            >
                <Megaphone size={18} /> Envío Masivo
            </button>

            {mainSection === 'funnel' && (
                <>
                    <button 
                        onClick={() => setShowOnboardingConfig(true)}
                        className="whitespace-nowrap bg-white border border-slate-200 text-slate-700 px-5 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2 shadow-sm text-sm"
                    >
                        <Bot size={18} className="text-violet-600" /> Config Onboarding
                    </button>
                    <button 
                        onClick={() => setShowNewDemoModal(true)}
                        className="whitespace-nowrap bg-violet-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-violet-200 hover:bg-violet-700 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
                    >
                        <Plus size={18} /> Nuevo Negocio
                    </button>
                </>
            )}
        </div>
      </div>

      {/* --- DASHBOARD METRICS SUMMARY (Contextual) --- */}
      {mainSection === 'funnel' ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-in slide-in-from-left-4 fade-in">
             <MetricCard icon={Clock} color="blue" label="En Prueba" value={stats.trial} sub="Leads Calientes" />
             <MetricCard icon={Hourglass} color="orange" label="En Espera" value={stats.waiting} sub="Setup Incompleto" />
             <MetricCard icon={LayoutGrid} color="violet" label="Total Pipeline" value={stats.trial + stats.waiting + stats.processing} sub="Prospectos Totales" />
             <div className="bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl p-4 text-white shadow-lg flex flex-col justify-between">
                 <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Conversión</p>
                    <h3 className="text-2xl font-black">24%</h3>
                 </div>
                 <p className="text-[10px] opacity-80 mt-1">De Demo a Pago</p>
             </div>
          </div>
      ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-in slide-in-from-right-4 fade-in">
             <MetricCard icon={CheckCircle} color="green" label="Clientes Activos" value={stats.active} sub="Ingresos Recurrentes" />
             <MetricCard icon={Ban} color="red" label="Expirados" value={stats.expired + stats.suspended} sub="Sin Renovación" />
             <MetricCard icon={AlertTriangle} color="rose" label="Pagos Vencidos" value={stats.overdue} sub="Cobranza" />
             <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-lg flex flex-col justify-between">
                 <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Revenue Mensual</p>
                    <h3 className="text-2xl font-black">$45,200</h3>
                 </div>
                 <p className="text-[10px] text-green-400 mt-1 font-bold">+12% vs mes pasado</p>
             </div>
          </div>
      )}

      {/* --- UNIFIED SUB-NAVIGATION BAR --- */}
      <div className="mb-6 overflow-x-auto pb-4 no-scrollbar">
          <div className="flex items-center gap-3">
              {/* FUNNEL TABS */}
              {mainSection === 'funnel' && (
                  <>
                    <button 
                        onClick={() => setActiveTab('all_trials')}
                        className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                            activeTab === 'all_trials' 
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200 ring-2 ring-blue-100' 
                            : 'bg-white text-slate-500 border border-slate-200 hover:border-blue-300 hover:text-blue-600'
                        }`}
                    >
                        <Clock size={16} /> Todos los Demos ({trials.length})
                    </button>
                    
                    {/* Visual Divider */}
                    <div className="h-8 w-[1px] bg-slate-300 mx-2"></div>

                    {onboardingSteps.map((step, index) => {
                        const stepId = `step_${index + 1}`;
                        const count = businesses.filter(b => b.currentOnboardingStep === index + 1 && b.status === 'TRIAL').length;
                        const isActive = activeTab === stepId;
                        
                        return (
                            <button 
                                key={step.id}
                                onClick={() => setActiveTab(stepId)}
                                className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                                    isActive 
                                    ? 'bg-violet-600 text-white shadow-md shadow-violet-200 ring-2 ring-violet-100' 
                                    : 'bg-white text-slate-500 border border-slate-200 hover:border-violet-300 hover:text-violet-600'
                                }`}
                            >
                                <span className="opacity-70 text-xs uppercase">Paso {index + 1}</span>
                                <span className={`px-1.5 py-0.5 rounded text-xs ${isActive ? 'bg-white/20' : 'bg-slate-100 text-slate-600'}`}>{count}</span>
                            </button>
                        );
                    })}
                  </>
              )}

              {/* CLIENTS TABS */}
              {mainSection === 'clients' && (
                  <>
                    <button 
                        onClick={() => setActiveTab('active')}
                        className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                            activeTab === 'active' 
                            ? 'bg-green-600 text-white shadow-md shadow-green-200 ring-2 ring-green-100' 
                            : 'bg-white text-slate-500 border border-slate-200 hover:border-green-300 hover:text-green-600'
                        }`}
                    >
                        <CheckCircle size={16} /> Activos ({actives.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('expired')}
                        className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                            activeTab === 'expired' 
                            ? 'bg-red-600 text-white shadow-md shadow-red-200 ring-2 ring-red-100' 
                            : 'bg-white text-slate-500 border border-slate-200 hover:border-red-300 hover:text-red-600'
                        }`}
                    >
                        <Ban size={16} /> Expirados / Cancelados ({expired.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('inactive')}
                        className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                            activeTab === 'inactive' 
                            ? 'bg-slate-600 text-white shadow-md' 
                            : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300'
                        }`}
                    >
                        <Archive size={16} /> Inactivos ({stats.inactive})
                    </button>
                  </>
              )}
          </div>
      </div>

      {/* --- CONTENT AREA (Based on Main Section + Active Tab) --- */}
      <div className="space-y-4 animate-in slide-in-from-bottom-4 flex-1">
        
        {/* --- FUNNEL VIEWS --- */}
        {mainSection === 'funnel' && (
            <>
                {(activeTab === 'all_trials' || activeTab.startsWith('step_')) && (
                    <>
                        {/* Header for Step View */}
                        {activeTab.startsWith('step_') && (
                            <div className="bg-violet-50 p-4 rounded-xl border border-violet-100 mb-4 flex gap-3">
                                <div className="bg-white p-2 rounded-lg text-violet-600 shadow-sm h-fit"><Bot size={20}/></div>
                                <div>
                                    <h4 className="font-bold text-violet-900">
                                        {`Viendo: ${onboardingSteps[parseInt(activeTab.split('_')[1]) - 1]?.title || 'Paso Desconocido'}`}
                                    </h4>
                                    <p className="text-xs text-violet-700">
                                        Mostrando prospectos en esta etapa del pipeline.
                                    </p>
                                </div>
                            </div>
                        )}

                        {(() => {
                            // Filter logic
                            let filteredTrials = trials;
                            if (activeTab.startsWith('step_')) {
                                const stepNum = parseInt(activeTab.split('_')[1]);
                                filteredTrials = trials.filter(b => b.currentOnboardingStep === stepNum);
                            }

                            if (filteredTrials.length === 0) {
                                return (
                                    <div className="text-center py-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                                        <Bot size={48} className="mx-auto mb-3 opacity-30" />
                                        <p>No hay prospectos en esta sección.</p>
                                    </div>
                                );
                            }

                            return filteredTrials.map(biz => {
                                const daysLeft = getDaysLeft(biz.trialEndsAt);
                                const totalDays = 15; 
                                return (
                                    <div 
                                        key={biz.id} 
                                        onClick={() => openDetailModal(biz)}
                                        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-6 items-center hover:border-violet-300 transition-all cursor-pointer hover:shadow-md"
                                    >
                                        <div className="flex-1 w-full">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-xl text-slate-900">{biz.name}</h3>
                                                <PlanBadge plan={biz.plan} />
                                            </div>
                                            <p className="text-slate-500 text-sm mb-4">{biz.ownerName} • {biz.phone}</p>
                                            
                                            <div>
                                                <div className="flex justify-between text-xs font-bold mb-1">
                                                    <span className={daysLeft <= 3 ? 'text-red-500' : 'text-slate-500'}>
                                                        {daysLeft} días restantes
                                                    </span>
                                                    <span className="text-slate-400">Meta: Venta</span>
                                                </div>
                                                <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full ${getProgressColor(daysLeft, totalDays)}`} 
                                                        style={{ width: `${(daysLeft / totalDays) * 100}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full lg:w-auto">
                                            <button 
                                                onClick={(e) => handleExtendTrial(biz.id, e)}
                                                className="flex-1 lg:flex-none px-4 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-50 z-10"
                                            >
                                                + Extender
                                            </button>
                                            <button 
                                                onClick={(e) => openSubscriptionModal(biz, e)}
                                                className="flex-1 lg:flex-none px-6 py-3 bg-violet-600 text-white font-bold rounded-xl text-sm hover:bg-violet-700 shadow-lg shadow-violet-200 flex items-center justify-center gap-2 z-10"
                                            >
                                                <Zap size={18} /> CERRAR VENTA
                                            </button>
                                        </div>
                                    </div>
                                );
                            });
                        })()}
                    </>
                )}
            </>
        )}

        {/* --- CLIENTS VIEWS --- */}
        {mainSection === 'clients' && (
            <>
                {activeTab === 'active' && (
                     <>
                        {actives.length === 0 && (
                            <div className="text-center py-12 text-slate-400">No hay suscripciones activas.</div>
                        )}
                        {actives.map(biz => {
                            const daysLeft = getDaysLeft(biz.subscriptionEndsAt);
                            return (
                                <div 
                                    key={biz.id} 
                                    onClick={() => openDetailModal(biz)}
                                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row gap-6 items-center cursor-pointer hover:shadow-md transition-all"
                                >
                                    <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-lg">
                                        {biz.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 w-full">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-bold text-xl text-slate-900">{biz.name}</h3>
                                            {daysLeft < 7 && <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">VENCE PRONTO</span>}
                                        </div>
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                                            <span className="flex items-center gap-1"><UserCheck size={14}/> {biz.ownerName}</span>
                                            <span className="flex items-center gap-1"><ShieldCheck size={14}/> Plan {biz.plan}</span>
                                            <span className="flex items-center gap-1"><Calendar size={14}/> Vence: {new Date(biz.subscriptionEndsAt!).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="text-right w-full lg:w-auto">
                                        <div className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg inline-block text-xs">
                                            {biz.term === '12_MONTHS' ? 'Anual' : biz.term === '6_MONTHS' ? 'Semestral' : 'Mensual'}
                                        </div>
                                        <button 
                                            onClick={(e) => openSubscriptionModal(biz, e)}
                                            className="block w-full text-brand-600 text-sm font-bold mt-2 hover:underline z-10"
                                        >
                                            Renovar
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                     </>
                )}

                {(activeTab === 'expired' || activeTab === 'inactive') && (
                     <>
                        {expired.map(biz => (
                            <div key={biz.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex justify-between items-center opacity-75 hover:opacity-100 transition-opacity">
                                <div>
                                    <h3 className="font-bold text-lg text-slate-700">{biz.name}</h3>
                                    <p className="text-sm text-slate-500 flex items-center gap-2">
                                        <Ban size={14} /> 
                                        Expiró el: {new Date(biz.trialEndsAt || biz.subscriptionEndsAt || '').toLocaleDateString()}
                                    </p>
                                </div>
                                <button 
                                    onClick={() => openSubscriptionModal(biz)}
                                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl text-sm hover:border-brand-500 hover:text-brand-600"
                                >
                                    Reactivar
                                </button>
                            </div>
                        ))}
                     </>
                )}
            </>
        )}

      </div>

      {/* --- MODAL: BROADCAST / MASS SENDING --- */}
      {showBroadcastModal && (
          <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col">
                  {/* Header */}
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                      <div className="flex items-center gap-3">
                          <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                              <Megaphone size={24} />
                          </div>
                          <div>
                              <h3 className="font-bold text-xl text-slate-900">Envío Masivo a Clientes</h3>
                              <p className="text-xs text-slate-500">Comunícate con tus negocios (Leads o Clientes)</p>
                          </div>
                      </div>
                      <button onClick={closeBroadcastModal} className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><X size={24}/></button>
                  </div>

                  {/* STEP 1: SELECT AUDIENCE */}
                  {broadcastStep === 'select' && (
                      <div className="flex-1 flex flex-col overflow-hidden">
                          <div className="p-6">
                              <p className="text-sm font-bold text-slate-500 uppercase mb-3">1. Selecciona a quién enviar</p>
                              {/* Filter Tabs */}
                              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
                                  {[
                                      {id: 'all', label: 'Todos'},
                                      {id: 'trial', label: 'En Prueba (Leads)'},
                                      {id: 'active', label: 'Clientes Activos'},
                                      {id: 'expired', label: 'Expirados'}
                                  ].map(f => (
                                      <button 
                                        key={f.id}
                                        onClick={() => { setBroadcastFilter(f.id as any); setSelectedBusinessIds([]); }}
                                        className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors whitespace-nowrap ${
                                            broadcastFilter === f.id
                                            ? 'bg-slate-800 text-white border-slate-800'
                                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                                        }`}
                                      >
                                          {f.label}
                                      </button>
                                  ))}
                              </div>

                              <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-slate-600 font-medium">
                                      {getFilteredBusinessesForBroadcast().length} negocios encontrados
                                  </span>
                                  <button onClick={toggleSelectAllBroadcast} className="text-indigo-600 font-bold text-sm hover:underline">
                                      {selectedBusinessIds.length === getFilteredBusinessesForBroadcast().length ? 'Deseleccionar' : 'Seleccionar Todos'}
                                  </button>
                              </div>
                          </div>

                          <div className="flex-1 overflow-y-auto px-6 pb-6">
                              <div className="space-y-2">
                                  {getFilteredBusinessesForBroadcast().map(biz => (
                                      <div 
                                        key={biz.id} 
                                        onClick={() => toggleBusinessSelection(biz.id)}
                                        className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                                            selectedBusinessIds.includes(biz.id)
                                            ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                                            : 'bg-white border-slate-200 hover:bg-slate-50'
                                        }`}
                                      >
                                          <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                                              selectedBusinessIds.includes(biz.id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'
                                          }`}>
                                              {selectedBusinessIds.includes(biz.id) && <CheckCircle size={14} className="text-white"/>}
                                          </div>
                                          <div>
                                              <p className="font-bold text-slate-800 text-sm">{biz.name}</p>
                                              <p className="text-xs text-slate-500">{biz.ownerName} • <span className="uppercase">{biz.status}</span></p>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>

                          <div className="p-4 border-t border-slate-200 bg-white">
                              <button 
                                onClick={() => setBroadcastStep('compose')}
                                disabled={selectedBusinessIds.length === 0}
                                className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200 transition-all"
                              >
                                  Redactar Mensaje ({selectedBusinessIds.length})
                              </button>
                          </div>
                      </div>
                  )}

                  {/* STEP 2: COMPOSE */}
                  {broadcastStep === 'compose' && (
                      <div className="flex-1 flex flex-col overflow-hidden">
                          <div className="p-6 flex-1 overflow-y-auto">
                              <button onClick={() => setBroadcastStep('select')} className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm font-bold mb-4">
                                  <ArrowLeft size={16} /> Volver a selección
                              </button>

                              <p className="text-sm font-bold text-slate-500 uppercase mb-3">2. Contenido del Mensaje</p>
                              
                              <textarea 
                                className="w-full h-40 bg-slate-50 border border-slate-200 rounded-xl p-4 text-base focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none mb-4"
                                placeholder="Escribe tu comunicado aquí..."
                                value={broadcastMessage}
                                onChange={(e) => setBroadcastMessage(e.target.value)}
                              ></textarea>

                              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Adjuntar Multimedia</p>
                              <div className="flex gap-2 mb-6">
                                  {[
                                      {id: 'image', icon: ImageIcon, label: 'Imagen'},
                                      {id: 'video', icon: Video, label: 'Video'},
                                      {id: 'audio', icon: Mic, label: 'Audio'},
                                      {id: 'pdf', icon: FileText, label: 'PDF'},
                                  ].map(type => (
                                      <button 
                                        key={type.id}
                                        onClick={() => setBroadcastAttachment(type.id === broadcastAttachment ? 'none' : type.id as any)}
                                        className={`flex-1 py-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                                            broadcastAttachment === type.id
                                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                                            : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                        }`}
                                      >
                                          <type.icon size={20} />
                                          <span className="text-xs font-bold">{type.label}</span>
                                      </button>
                                  ))}
                              </div>

                              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                  <div className="flex gap-2 mb-4">
                                      <button 
                                        onClick={() => setBroadcastScheduleMode('now')}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${
                                            broadcastScheduleMode === 'now' 
                                            ? 'bg-white border-slate-300 text-slate-900 shadow-sm' 
                                            : 'border-transparent text-slate-400 hover:bg-slate-100'
                                        }`}
                                      >
                                          Enviar Ahora
                                      </button>
                                      <button 
                                        onClick={() => setBroadcastScheduleMode('later')}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${
                                            broadcastScheduleMode === 'later' 
                                            ? 'bg-white border-slate-300 text-slate-900 shadow-sm' 
                                            : 'border-transparent text-slate-400 hover:bg-slate-100'
                                        }`}
                                      >
                                          Programar
                                      </button>
                                  </div>
                                  
                                  {broadcastScheduleMode === 'later' && (
                                      <div className="animate-in fade-in slide-in-from-top-2">
                                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Fecha y Hora de Envío</label>
                                          <input 
                                            type="datetime-local" 
                                            className="w-full p-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800"
                                            value={broadcastDate}
                                            onChange={(e) => setBroadcastDate(e.target.value)}
                                          />
                                      </div>
                                  )}
                              </div>
                          </div>

                          <div className="p-4 border-t border-slate-200 bg-white">
                              <button 
                                onClick={handleBroadcastStart}
                                disabled={!broadcastMessage || (broadcastScheduleMode === 'later' && !broadcastDate)}
                                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transition-all flex items-center justify-center gap-2"
                              >
                                  {broadcastScheduleMode === 'now' ? <Send size={18} /> : <Calendar size={18} />}
                                  {broadcastScheduleMode === 'now' ? 'Enviar Campaña Ahora' : 'Programar Campaña'}
                              </button>
                          </div>
                      </div>
                  )}

                  {/* STEP 3: SENDING PROGRESS */}
                  {broadcastStep === 'sending' && (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                          <div className="w-full max-w-md bg-slate-100 rounded-full h-4 mb-8 overflow-hidden">
                              <div className="h-full bg-indigo-600 transition-all duration-300 ease-out" style={{width: `${broadcastProgress}%`}}></div>
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900 mb-2">
                              {broadcastScheduleMode === 'now' ? 'Enviando mensajes...' : 'Programando envío...'}
                          </h3>
                          <p className="text-slate-500">
                              Procesando {selectedBusinessIds.length} destinatarios. Por favor espera.
                          </p>
                      </div>
                  )}

                  {/* STEP 4: SUCCESS */}
                  {broadcastStep === 'success' && (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in zoom-in">
                          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
                              <CheckCircle size={40} />
                          </div>
                          <h3 className="text-3xl font-bold text-slate-900 mb-2">¡Listo!</h3>
                          <p className="text-slate-500 mb-8 max-w-sm">
                              Tu comunicado ha sido {broadcastScheduleMode === 'now' ? 'enviado' : 'programado'} exitosamente para {selectedBusinessIds.length} negocios.
                          </p>
                          <button onClick={closeBroadcastModal} className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800">
                              Volver al Dashboard
                          </button>
                      </div>
                  )}

              </div>
          </div>
      )}

      {/* --- GLOBAL ONBOARDING CONFIGURATION MODAL (KEPT SAME) --- */}
      {showOnboardingConfig && (
          <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
               <div className="bg-white w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col">
                   <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                       <div className="flex items-center gap-3">
                           <div className="bg-violet-100 p-2 rounded-lg text-violet-600">
                               <Bot size={24} />
                           </div>
                           <div>
                               <h3 className="font-bold text-xl text-slate-900">Configurar Onboarding Automático</h3>
                               <p className="text-xs text-slate-500">Define la secuencia de mensajes para nuevos registros.</p>
                           </div>
                       </div>
                       <button onClick={() => setShowOnboardingConfig(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500"><X size={24}/></button>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                        <div className="max-w-2xl mx-auto relative pb-20">
                             {/* Timeline Line */}
                            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>

                            <div className="space-y-6">
                                {onboardingSteps.map((step, index) => (
                                    <div key={step.id} className="relative pl-16">
                                        <div className="absolute left-0 w-12 h-12 rounded-full bg-violet-100 text-violet-600 border-4 border-white shadow-sm flex items-center justify-center z-10 font-bold text-lg">
                                            {index + 1}
                                        </div>
                                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h4 className="font-bold text-lg text-slate-800">{step.title}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {step.trigger === 'registration' ? (
                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-blue-100 text-blue-700 flex items-center gap-1">
                                                                <Zap size={10} /> Día 0 (Registro)
                                                            </span>
                                                        ) : (
                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-orange-100 text-orange-700 flex items-center gap-1">
                                                                <CalendarDays size={10} /> Día {step.dayOffset}
                                                            </span>
                                                        )}
                                                        <span className="text-xs font-bold text-violet-600">
                                                             • {getStepDisplayTime(step)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setEditingStep(step)} className="p-2 bg-slate-100 hover:bg-violet-100 text-slate-500 hover:text-violet-600 rounded-lg"><Edit3 size={18}/></button>
                                                    <button onClick={() => handleDeleteStep(step.id)} className="p-2 bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600 rounded-lg"><Trash2 size={18}/></button>
                                                </div>
                                            </div>
                                            
                                            <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <div className="shrink-0">
                                                    {step.type === 'video' && <PlayCircle className="text-red-500" size={24} />}
                                                    {step.type === 'audio' && <Mic className="text-teal-500" size={24} />}
                                                    {step.type === 'image' && <ImageIcon className="text-blue-500" size={24} />}
                                                    {step.type === 'pdf' && <FileText className="text-red-700" size={24} />}
                                                    {step.type === 'text' && <MessageCircle className="text-slate-400" size={24} />}
                                                </div>
                                                <p className="text-sm text-slate-600 italic line-clamp-2 w-full">"{step.content}"</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* ADD NEW STEP */}
                                <div className="relative pl-16 pt-4">
                                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>
                                    <button 
                                        onClick={handleAddNewStep}
                                        className="w-full py-5 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:bg-white hover:border-violet-400 hover:text-violet-600 transition-all flex items-center justify-center gap-2 group bg-slate-50"
                                    >
                                        <Plus size={24} className="group-hover:scale-110 transition-transform"/>
                                        Agregar Nuevo Mensaje a la Secuencia
                                    </button>
                                </div>
                            </div>
                        </div>
                   </div>
               </div>
          </div>
      )}

      {/* --- MODAL: 360 CLIENT VIEW (READ ONLY ONBOARDING STATUS) --- */}
      {showDetailModal && selectedBusiness && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-6xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col md:flex-row">
                  
                  {/* --- LEFT PANEL: PROFILE & HISTORY --- */}
                  <div className="w-full md:w-1/3 bg-slate-50 border-r border-slate-200 flex flex-col">
                      {/* Header */}
                      <div className="p-6 border-b border-slate-200">
                          <button onClick={() => setShowDetailModal(false)} className="md:hidden absolute top-4 right-4"><X /></button>
                          <div className="flex items-center gap-4 mb-4">
                              <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-2xl font-black text-slate-800">
                                  {selectedBusiness.name.charAt(0)}
                              </div>
                              <div>
                                  <h3 className="font-bold text-xl text-slate-900 leading-none mb-1">{selectedBusiness.name}</h3>
                                  <p className="text-sm text-slate-500 mb-2">{selectedBusiness.phone}</p>
                                  <PlanBadge plan={selectedBusiness.plan} />
                              </div>
                          </div>
                          
                          {/* Status Bar */}
                          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                               <div className="flex justify-between text-xs font-bold mb-2">
                                  <span className="text-slate-500">Estado de Cuenta</span>
                                  <span className={selectedBusiness.status === 'ACTIVE' ? 'text-green-600' : 'text-blue-600'}>
                                      {selectedBusiness.status === 'ACTIVE' ? 'Suscripción Activa' : 'Periodo de Prueba'}
                                  </span>
                               </div>
                               <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                   <div className={`h-full rounded-full ${selectedBusiness.status === 'ACTIVE' ? 'bg-green-500' : 'bg-blue-500'}`} style={{width: '70%'}}></div>
                               </div>
                               <p className="text-xs text-slate-400 mt-2 text-right">
                                   Vence: {new Date(selectedBusiness.trialEndsAt || selectedBusiness.subscriptionEndsAt || '').toLocaleDateString()}
                                </p>
                          </div>
                      </div>

                      {/* Info & Stats */}
                      <div className="p-6 flex-1 overflow-y-auto space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white p-3 rounded-xl border border-slate-200">
                                  <p className="text-xs text-slate-400 font-bold uppercase">Clientes</p>
                                  <p className="text-xl font-bold text-slate-800">{selectedBusiness.registeredClients}</p>
                              </div>
                              <div className="bg-white p-3 rounded-xl border border-slate-200">
                                  <p className="text-xs text-slate-400 font-bold uppercase">Ventas</p>
                                  <p className="text-xl font-bold text-slate-800">${selectedBusiness.totalSales}</p>
                              </div>
                          </div>

                          <div>
                              <h4 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                  <Receipt size={16} /> Historial de Pagos
                              </h4>
                              <div className="space-y-2">
                                  {/* Mock History */}
                                  {selectedBusiness.status === 'ACTIVE' ? (
                                      <div className="flex justify-between items-center p-3 bg-white border border-slate-200 rounded-xl text-sm">
                                          <div>
                                              <p className="font-bold text-slate-700">Suscripción Anual</p>
                                              <p className="text-xs text-slate-400">{new Date(selectedBusiness.lastPaymentDate || '').toLocaleDateString()}</p>
                                          </div>
                                          <span className="font-bold text-green-600">$5,988</span>
                                      </div>
                                  ) : (
                                      <div className="text-center py-4 text-slate-400 text-sm italic">
                                          Sin pagos registrados (Cuenta Demo)
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="p-6 border-t border-slate-200 bg-white">
                           {selectedBusiness.status === 'TRIAL' ? (
                               <button 
                                onClick={() => openSubscriptionModal(selectedBusiness)}
                                className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-brand-200 hover:bg-brand-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                               >
                                   <Zap size={20} /> Cerrar Venta Ahora
                               </button>
                           ) : (
                               <button className="w-full bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all">
                                   Gestionar Suscripción
                               </button>
                           )}
                      </div>
                  </div>

                  {/* --- RIGHT PANEL: COMMUNICATION & AUTOMATION --- */}
                  <div className="w-full md:w-2/3 bg-white flex flex-col relative">
                      
                      {/* Top Tabs */}
                      <div className="flex border-b border-slate-200 shrink-0">
                          <button 
                            onClick={() => setDetailRightTab('chat')}
                            className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                                detailRightTab === 'chat' ? 'text-brand-600 border-b-2 border-brand-600 bg-brand-50/50' : 'text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                              <MessageCircle size={18} /> Chat Directo
                          </button>
                          
                          {/* ONLY SHOW ONBOARDING TAB FOR TRIAL USERS */}
                          {selectedBusiness.status === 'TRIAL' && (
                              <button 
                                onClick={() => setDetailRightTab('onboarding')}
                                className={`flex-1 py-4 font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
                                    detailRightTab === 'onboarding' ? 'text-violet-600 border-b-2 border-violet-600 bg-violet-50/50' : 'text-slate-500 hover:bg-slate-50'
                                }`}
                              >
                                <Bot size={18} /> Estado del Onboarding
                              </button>
                          )}

                          <button onClick={() => setShowDetailModal(false)} className="px-6 border-l border-slate-100 hover:bg-slate-100 text-slate-400">
                              <X size={24} />
                          </button>
                      </div>

                      {/* --- CONTENT A: CHAT --- */}
                      {detailRightTab === 'chat' && (
                          <div className="flex-1 flex flex-col bg-[#e5ded8]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                              {/* Messages Area */}
                              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                                  <div className="flex justify-center">
                                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded shadow-sm">
                                          🔒 Los mensajes están cifrados de extremo a extremo
                                      </span>
                                  </div>
                                  {/* Mock Messages */}
                                  <div className="flex justify-start">
                                      <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[70%] text-sm">
                                          <p>Hola Francisco, tengo una duda con el menú.</p>
                                          <span className="text-[10px] text-slate-400 block text-right mt-1">10:45 AM</span>
                                      </div>
                                  </div>
                                  <div className="flex justify-end">
                                      <div className="bg-[#dcf8c6] p-3 rounded-lg rounded-tr-none shadow-sm max-w-[70%] text-sm">
                                          <p>¡Hola! Claro, dime en qué te puedo ayudar.</p>
                                          <span className="text-[10px] text-green-800/60 block text-right mt-1">10:46 AM</span>
                                      </div>
                                  </div>
                              </div>
                              
                              {/* Input Area */}
                              <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                                  <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><Smile size={24}/></button>
                                  <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><Paperclip size={24}/></button>
                                  <input type="text" placeholder="Escribe un mensaje..." className="flex-1 bg-slate-100 rounded-full px-4 py-2 focus:outline-none" />
                                  <button className="p-3 bg-brand-600 text-white rounded-full shadow-md hover:bg-brand-700"><Send size={20}/></button>
                              </div>
                          </div>
                      )}

                      {/* --- CONTENT B: AUTOMATED ONBOARDING (VIEW ONLY FOR CLIENT) --- */}
                      {detailRightTab === 'onboarding' && (
                          <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
                              <div className="p-4 bg-violet-50 border-b border-violet-100 flex items-start gap-3">
                                  <div className="bg-white p-2 rounded-full text-violet-600 shadow-sm"><Bot size={20} /></div>
                                  <div>
                                      <h4 className="font-bold text-violet-900">Progreso del Cliente</h4>
                                      <p className="text-xs text-violet-700">Aquí puedes ver qué mensajes automáticos ya se enviaron a {selectedBusiness.name}.</p>
                                  </div>
                              </div>

                              <div className="flex-1 overflow-y-auto p-6">
                                  <div className="relative pb-16">
                                      {/* Timeline Line */}
                                      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-200"></div>

                                      <div className="space-y-6">
                                          {onboardingSteps.map((step, index) => {
                                              const { dateString, timeString, isToday, isPast } = getScheduledDate(selectedBusiness.joinedAt, step);
                                              
                                              return (
                                              <div key={step.id} className={`relative pl-16 transition-opacity ${isPast ? 'opacity-100' : 'opacity-80'}`}>
                                                  <div className={`absolute left-0 w-12 h-12 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 font-bold text-sm ${
                                                      isPast ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'
                                                  }`}>
                                                      {isPast ? <CheckCircle size={20} /> : <span className="text-lg">{index + 1}</span>}
                                                  </div>

                                                  <div className={`bg-white p-4 rounded-xl border shadow-sm ${isToday ? 'border-violet-300 ring-2 ring-violet-100' : 'border-slate-200'}`}>
                                                      <div className="flex justify-between items-start mb-2">
                                                          <div>
                                                              <h4 className="font-bold text-slate-800">{step.title}</h4>
                                                              <p className={`text-xs font-bold mt-0.5 flex items-center gap-1 ${isToday ? 'text-violet-600' : 'text-slate-400'}`}>
                                                                  <CalendarDays size={12} />
                                                                  {dateString}
                                                                  {isToday && <span className="bg-violet-600 text-white px-1.5 rounded ml-1 text-[10px] uppercase">HOY</span>}
                                                              </p>
                                                          </div>
                                                          <div className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                                              <Clock size={12} /> {timeString}
                                                          </div>
                                                      </div>
                                                      
                                                      <div className="flex gap-3 mb-2">
                                                          <div className="shrink-0 mt-1">
                                                              {step.type === 'video' && <PlayCircle className="text-red-500" size={20} />}
                                                              {step.type === 'audio' && <Mic className="text-teal-500" size={20} />}
                                                              {step.type === 'image' && <ImageIcon className="text-blue-500" size={20} />}
                                                              {step.type === 'pdf' && <FileText className="text-red-700" size={20} />}
                                                              {step.type === 'text' && <MessageCircle className="text-slate-400" size={20} />}
                                                          </div>
                                                          <p className="text-sm text-slate-600 italic bg-slate-50 p-2 rounded-lg w-full border border-slate-100">
                                                              "{step.content}"
                                                          </p>
                                                      </div>
                                                  </div>
                                              </div>
                                          )})}
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}

                  </div>
              </div>
          </div>
      )}

      {/* --- MODAL: EDIT ONBOARDING STEP (GLOBAL) --- */}
      {editingStep && (
          <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
                  <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                      <h3 className="font-bold text-slate-800">{editingStep.id ? 'Editar Paso' : 'Nuevo Paso'}</h3>
                      <button onClick={() => setEditingStep(null)} className="p-1 hover:bg-slate-200 rounded-full"><X size={20} className="text-slate-400"/></button>
                  </div>
                  <div className="p-6 space-y-4 overflow-y-auto">
                      
                      {/* Title */}
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Título del Mensaje</label>
                          <input 
                            type="text" 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                            value={editingStep.title || ''}
                            onChange={(e) => setEditingStep({...editingStep, title: e.target.value})}
                            placeholder="Ej. Bienvenida"
                          />
                      </div>

                      {/* --- NEW TIMING CONFIGURATOR (SIMPLIFIED LOGIC) --- */}
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">¿Cuándo se envía?</label>
                          
                          {/* Trigger Switch Cards */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                             <button 
                                onClick={() => setEditingStep({...editingStep, trigger: 'registration', delayMinutes: 5})}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${
                                    editingStep.trigger === 'registration' 
                                    ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' 
                                    : 'bg-white border-slate-200 text-slate-400 hover:border-blue-300'
                                }`}
                             >
                                 <Zap size={20} className={editingStep.trigger === 'registration' ? 'text-blue-600 mb-2' : 'mb-2'} />
                                 <p className={`text-sm font-bold ${editingStep.trigger === 'registration' ? 'text-blue-800' : 'text-slate-600'}`}>El día del registro</p>
                                 <p className="text-[10px] opacity-70">Para bienvenida inmediata</p>
                             </button>

                             <button 
                                onClick={() => setEditingStep({...editingStep, trigger: 'scheduled', dayOffset: 1, timeOfDay: '09:00'})}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${
                                    editingStep.trigger === 'scheduled' 
                                    ? 'bg-orange-50 border-orange-500 ring-1 ring-orange-500' 
                                    : 'bg-white border-slate-200 text-slate-400 hover:border-orange-300'
                                }`}
                             >
                                 <CalendarDays size={20} className={editingStep.trigger === 'scheduled' ? 'text-orange-600 mb-2' : 'mb-2'} />
                                 <p className={`text-sm font-bold ${editingStep.trigger === 'scheduled' ? 'text-orange-800' : 'text-slate-600'}`}>Días Posteriores</p>
                                 <p className="text-[10px] opacity-70">Para seguimiento y cierre</p>
                             </button>
                          </div>

                          {/* Specific Timing Controls based on selection */}
                          {editingStep.trigger === 'registration' ? (
                              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 animate-in fade-in">
                                  <div className="flex justify-between items-center mb-2">
                                      <p className="text-xs text-blue-800 font-bold">Esperar antes de enviar:</p>
                                      <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-blue-200 text-blue-600">
                                          {editingStep.delayMinutes === 0 ? 'Sin espera' : `${editingStep.delayMinutes} min`}
                                      </span>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                      {[0, 5, 10, 30, 60].map(mins => (
                                          <button
                                            key={mins}
                                            onClick={() => setEditingStep({...editingStep, delayMinutes: mins})}
                                            className={`flex-1 py-2 rounded-lg text-xs font-bold border ${
                                                editingStep.delayMinutes === mins
                                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                                : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300'
                                            }`}
                                          >
                                              {mins === 0 ? 'Ya' : `${mins}m`}
                                          </button>
                                      ))}
                                  </div>
                              </div>
                          ) : (
                              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 animate-in fade-in space-y-4">
                                  {/* Day Input */}
                                  <div>
                                      <label className="text-xs font-bold text-orange-800 mb-1 block">¿En qué día del viaje?</label>
                                      <div className="flex gap-2 items-center">
                                          <div className="relative flex-1">
                                              <input 
                                                type="number" 
                                                min="1" max="365"
                                                value={editingStep.dayOffset ?? ''}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setEditingStep({
                                                        ...editingStep, 
                                                        dayOffset: val === '' ? undefined : parseInt(val)
                                                    });
                                                }}
                                                className="w-full p-3 pl-12 bg-white font-bold border border-orange-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                              />
                                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400 font-bold">Día</span>
                                          </div>
                                          <div className="bg-white px-3 py-2 rounded-xl border border-orange-100 text-xs font-medium text-orange-600 shadow-sm flex-1 flex items-center justify-center">
                                              {getDayLabel(editingStep.dayOffset || 1)}
                                          </div>
                                      </div>
                                  </div>

                                  {/* Time Input */}
                                  <div>
                                      <label className="text-xs font-bold text-orange-800 mb-1 block">¿A qué hora? (Horario Laboral)</label>
                                      <div className="relative">
                                          <input 
                                            type="time" 
                                            value={editingStep.timeOfDay || '09:00'}
                                            onChange={(e) => setEditingStep({...editingStep, timeOfDay: e.target.value})}
                                            className="w-full p-3 pl-10 bg-white border border-orange-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                                          />
                                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" size={18} />
                                      </div>
                                  </div>
                              </div>
                          )}
                      </div>

                      {/* Content Type */}
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Tipo de Contenido</label>
                          <div className="flex gap-2">
                              {['text', 'image', 'video', 'audio', 'pdf'].map(type => (
                                  <button
                                    key={type}
                                    onClick={() => setEditingStep({...editingStep, type: type as any})}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold border uppercase ${
                                        editingStep.type === type
                                        ? 'bg-violet-600 text-white border-violet-600'
                                        : 'bg-white text-slate-400 border-slate-200 hover:border-violet-300'
                                    }`}
                                  >
                                      {type}
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Content Body */}
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Contenido / Mensaje</label>
                          <textarea 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 h-32 resize-none"
                            value={editingStep.content || ''}
                            onChange={(e) => setEditingStep({...editingStep, content: e.target.value})}
                            placeholder="Escribe el mensaje o pega la URL del recurso..."
                          />
                      </div>

                  </div>
                  <div className="p-4 border-t border-slate-100 bg-slate-50">
                      <button 
                        onClick={handleSaveStep}
                        className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg"
                      >
                          Guardar Paso
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* --- MODAL: SUBSCRIPTION / PAYMENT --- */}
      {showSubscriptionModal && selectedBusiness && (
          <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95">
                  <div className="p-4 border-b border-slate-100 bg-slate-50">
                      <h3 className="font-bold text-slate-800">Gestionar Suscripción</h3>
                      <p className="text-xs text-slate-500">Para: {selectedBusiness.name}</p>
                  </div>
                  <div className="p-6 space-y-4">
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Plan</label>
                          <div className="grid grid-cols-3 gap-2">
                              {[PlanType.BASIC, PlanType.INTERMEDIATE, PlanType.PREMIUM].map(p => (
                                  <button 
                                    key={p}
                                    onClick={() => handlePlanChange(p)}
                                    className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                                        subForm.plan === p 
                                        ? 'bg-slate-800 text-white border-slate-800' 
                                        : 'bg-white text-slate-500 border-slate-200'
                                    }`}
                                  >
                                      {p}
                                  </button>
                              ))}
                          </div>
                      </div>
                      
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Periodo</label>
                          <select 
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold"
                            value={subForm.durationMonths}
                            onChange={(e) => setSubForm({...subForm, durationMonths: parseInt(e.target.value)})}
                          >
                              <option value={1}>Mensual</option>
                              <option value={3}>Trimestral</option>
                              <option value={6}>Semestral</option>
                              <option value={12}>Anual</option>
                          </select>
                      </div>

                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Monto a Cobrar</label>
                          <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                              <input 
                                type="number" 
                                className="w-full p-2 pl-6 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900"
                                value={subForm.customPrice}
                                onChange={(e) => setSubForm({...subForm, customPrice: parseFloat(e.target.value)})}
                              />
                          </div>
                      </div>

                      <div className="pt-2">
                          <p className="text-xs font-bold text-slate-500 uppercase mb-2">Método de Pago</p>
                          <div className="grid grid-cols-2 gap-2">
                              <button 
                                onClick={() => handleRegisterSubscription('CASH')}
                                className="py-3 bg-green-50 text-green-700 border border-green-200 rounded-xl font-bold hover:bg-green-100 flex items-center justify-center gap-2"
                              >
                                  <Wallet size={16} /> Efectivo
                              </button>
                              <button 
                                onClick={() => simulateDigitalPayment('CARD')}
                                disabled={isProcessingPayment}
                                className="py-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl font-bold hover:bg-blue-100 flex items-center justify-center gap-2"
                              >
                                  {isProcessingPayment ? <Loader2 className="animate-spin" size={16} /> : <CreditCard size={16} />}
                                  {isProcessingPayment ? 'Procesando...' : 'Tarjeta'}
                              </button>
                          </div>
                      </div>
                  </div>
                  <div className="p-3 bg-slate-50 text-center">
                      <button onClick={() => setShowSubscriptionModal(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">Cancelar</button>
                  </div>
              </div>
          </div>
      )}

      {/* --- MODAL: NEW DEMO --- */}
      {showNewDemoModal && (
          <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95">
                  <div className="p-4 border-b border-slate-100 bg-slate-50">
                      <h3 className="font-bold text-slate-800">Crear Nuevo Negocio</h3>
                  </div>
                  <div className="p-6 space-y-4">
                      <input 
                        type="text" 
                        placeholder="Nombre del Negocio" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                        value={demoForm.name}
                        onChange={e => setDemoForm({...demoForm, name: e.target.value})}
                      />
                      <input 
                        type="text" 
                        placeholder="Nombre del Dueño" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                        value={demoForm.owner}
                        onChange={e => setDemoForm({...demoForm, owner: e.target.value})}
                      />
                      <input 
                        type="text" 
                        placeholder="Teléfono" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                        value={demoForm.phone}
                        onChange={e => setDemoForm({...demoForm, phone: e.target.value})}
                      />
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Plan Inicial</label>
                          <select 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl"
                            value={demoForm.plan}
                            onChange={e => setDemoForm({...demoForm, plan: e.target.value as PlanType})}
                          >
                              <option value={PlanType.BASIC}>Básico</option>
                              <option value={PlanType.INTERMEDIATE}>Intermedio</option>
                              <option value={PlanType.PREMIUM}>Premium</option>
                          </select>
                      </div>
                      <button 
                        onClick={handleCreateDemo}
                        disabled={!demoForm.name || !demoForm.owner}
                        className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl disabled:opacity-50"
                      >
                          Crear Demo
                      </button>
                  </div>
                  <div className="p-3 bg-slate-50 text-center">
                      <button onClick={() => setShowNewDemoModal(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">Cancelar</button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default SuperAdminDashboard;
