
import React, { useState } from 'react';
import { 
  Gift, 
  QrCode, 
  ArrowLeft, 
  CheckCircle, 
  Search, 
  User, 
  Star, 
  Plus, 
  Tag, 
  MessageSquare, 
  ArrowRight, 
  LayoutGrid, 
  Smartphone,
  Delete,
  X,
  Settings,
  ChevronRight,
  Wallet,
  Minus,
  Trophy,
  Ticket,
  Radar,
  AlertTriangle,
  Zap,
  Clock,
  Ghost,
  Send,
  PlayCircle,
  History,
  Megaphone,
  UserPlus,
  BarChart3,
  Filter,
  CheckSquare,
  Square,
  Eye,
  Share2,
  Lightbulb,
  Ban
} from 'lucide-react';

interface Props {
  onNavigate?: (view: string, params?: any) => void;
}

interface Campaign {
  id: string;
  type: 'loyalty' | 'coupon';
  title: string;
  subtitle: string;
  stats: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  target?: number; // Solo para loyalty
  reward?: string;
  conditions?: string;
}

interface ClientWalletItem {
    id: string; // Unique instance ID
    campaignId: string;
    stamps: number;
    status: 'active' | 'redeemed';
    redeemedAt?: string;
}

// Mock Data for Radar Details
interface RadarUser {
    id: string;
    name: string;
    info: string;
    detail: string; // e.g., "4/5" or "45 days"
    progress?: number;
    max?: number;
}

// Mock Data for Campaign Detail View
interface CampaignParticipant {
    id: string;
    name: string;
    phone: string;
    progress: number;
    lastVisit: string; // ISO Date
    status: 'active' | 'winner' | 'redeemed';
    lastReminderSent?: string; // ISO Date of last message sent
}

const MOCK_PARTICIPANTS: CampaignParticipant[] = [
    { id: '1', name: 'Ana García', phone: '5512345678', progress: 8, lastVisit: '2023-10-24', status: 'active', lastReminderSent: '2023-10-26T10:00:00' }, // Sent recently
    { id: '2', name: 'Carlos Méndez', phone: '5587654321', progress: 3, lastVisit: '2023-09-15', status: 'active' }, // Inactive
    { id: '3', name: 'Sofía Torres', phone: '5511223344', progress: 10, lastVisit: '2023-10-20', status: 'winner' }, // Needs to redeem
    { id: '4', name: 'Luis Rodríguez', phone: '5544332211', progress: 10, lastVisit: '2023-10-01', status: 'redeemed' },
    { id: '5', name: 'María López', phone: '5599887766', progress: 9, lastVisit: '2023-10-25', status: 'active' },
];

// --- COMPONENT: CLIENT CARD SIMULATOR ---
const ClientCardSimulator: React.FC<{ campaign: Campaign, onClose: () => void }> = ({ campaign, onClose }) => {
    // Simulate a random progress to show how it looks filled
    const simProgress = campaign.target ? Math.floor(campaign.target * 0.4) : 0;
    
    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            {/* Desktop backdrop click to close */}
            <div className="absolute inset-0" onClick={onClose}></div>

            <div className="relative w-full max-w-[360px] bg-slate-100 h-[750px] max-h-[90vh] rounded-[3rem] border-8 border-slate-800 shadow-2xl overflow-hidden flex flex-col z-10 pointer-events-auto">
                {/* Phone Notch/Header */}
                <div className="bg-slate-900 h-8 w-full absolute top-0 left-0 z-20 flex justify-center">
                    <div className="bg-black h-5 w-32 rounded-b-xl"></div>
                </div>
                
                {/* Screen Content */}
                <div className="flex-1 overflow-y-auto bg-slate-50 relative pt-10 pb-20">
                    {/* App Bar with CLOSE BUTTON */}
                    <div className="px-4 py-3 flex justify-between items-center bg-white shadow-sm sticky top-0 z-30">
                        <span className="font-bold text-lg text-slate-800">Mi Billetera</span>
                        <button 
                            onClick={onClose} 
                            className="bg-slate-100 hover:bg-slate-200 text-slate-600 p-2 rounded-full transition-colors"
                            title="Cerrar vista previa"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-4 space-y-6">
                        <div className="text-center mb-2">
                            <p className="text-xs text-slate-400 font-bold uppercase">Vista del Cliente</p>
                            <h3 className="text-xl font-bold text-slate-800">Tacos El Primo</h3>
                        </div>

                        {/* THE DIGITAL CARD */}
                        <div className={`rounded-3xl p-6 text-white shadow-xl relative overflow-hidden ${
                            campaign.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-700' :
                            campaign.color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-purple-700' :
                            campaign.color === 'orange' ? 'bg-gradient-to-br from-orange-500 to-orange-700' :
                            'bg-gradient-to-br from-green-500 to-green-700'
                        }`}>
                            {/* Card Background Pattern */}
                            <div className="absolute top-0 right-0 p-8 opacity-10 transform rotate-12">
                                <Gift size={140} />
                            </div>

                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="font-black text-2xl leading-none mb-1">{campaign.title}</h2>
                                        <p className="opacity-90 text-sm font-medium">{campaign.reward}</p>
                                    </div>
                                    <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                        <Trophy size={24} className="text-white" />
                                    </div>
                                </div>

                                {campaign.type === 'loyalty' && campaign.target ? (
                                    <>
                                        <div className="bg-white/10 rounded-2xl p-4 mb-4 backdrop-blur-md">
                                            <div className="flex flex-wrap gap-3 justify-center">
                                                {Array.from({ length: campaign.target }).map((_, i) => (
                                                    <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                                                        i < simProgress 
                                                        ? 'bg-white border-white text-brand-600 scale-110 shadow-lg' 
                                                        : 'border-white/30 text-white/30'
                                                    }`}>
                                                        {i < simProgress ? <Star size={20} fill="currentColor" /> : <span className="text-xs font-bold">{i + 1}</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-center text-sm font-medium opacity-90">
                                            ¡Te faltan {campaign.target - simProgress} visitas para tu premio!
                                        </p>
                                    </>
                                ) : (
                                    <div className="bg-white text-slate-900 p-4 rounded-xl text-center shadow-lg transform rotate-1 border-2 border-dashed border-slate-300">
                                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Código de Cupón</p>
                                        <p className="text-2xl font-black tracking-widest font-mono">PROMO-2024</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* QR Code Section */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                            <p className="text-sm text-slate-500 mb-4 font-medium">Muestra este código en caja para registrar tu visita</p>
                            <div className="bg-slate-900 p-4 rounded-2xl shadow-xl shadow-slate-200 mb-4">
                                <QrCode size={140} className="text-white" />
                            </div>
                            <p className="text-xs text-slate-400">ID: ANA-G-123</p>
                        </div>

                        {/* Conditions */}
                        {campaign.conditions && (
                            <div className="px-4 text-center">
                                <p className="text-[10px] text-slate-400">
                                    Términos y condiciones: {campaign.conditions}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Phone Home Bar */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-slate-300 rounded-full"></div>
            </div>
        </div>
    );
};

const Coupons: React.FC<Props> = ({ onNavigate }) => {
  // --- STATE MANAGEMENT ---
  
  // Global View Mode: 'admin' (Dueño) vs 'terminal' (Cajero)
  const [activeTab, setActiveTab] = useState<'admin' | 'terminal'>('admin');

  // Terminal State
  const [terminalStep, setTerminalStep] = useState<'input' | 'wallet' | 'success'>('input');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [scannedClient, setScannedClient] = useState<{name: string, type: string} | null>(null);
  
  // Admin Creation State
  const [isCreating, setIsCreating] = useState(false);
  const [creationStep, setCreationStep] = useState<'select_type' | 'form' | 'success'>('select_type');
  const [createType, setCreateType] = useState<'loyalty' | 'coupon'>('loyalty');

  // Admin Detail View State (The Control Center)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [detailFilter, setDetailFilter] = useState<'active' | 'winner' | 'redeemed'>('active');
  
  // Preview Simulator State
  const [previewCampaign, setPreviewCampaign] = useState<Campaign | null>(null);

  // Bulk Selection State
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);

  // Radar State
  const [showRadar, setShowRadar] = useState(false);
  const [selectedRadar, setSelectedRadar] = useState<'stuck' | 'forgotten' | 'loyal' | 'cold' | null>(null);
  
  // Data State (Mock Database)
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'c1',
      type: 'loyalty',
      title: 'Club del Café',
      subtitle: 'Meta: 10 visitas',
      reward: 'Café Gratis',
      target: 10,
      stats: '120 activos',
      color: 'blue'
    },
    {
      id: 'c2',
      type: 'coupon',
      title: '2x1 Tacos Pastor',
      subtitle: 'Stock: 100',
      reward: '2x1',
      stats: '45 usados',
      color: 'green'
    }
  ]);

  // Mock Client Wallet (Progress for the specific scanned client)
  const [clientWallet, setClientWallet] = useState<ClientWalletItem[]>([
      { id: 'w1', campaignId: 'c1', stamps: 8, status: 'active' } // Client has 8/10 stamps
  ]);

  // Form Data
  const [formData, setFormData] = useState({
      title: '',
      reward: '',
      target: 5,
      limit: 100,
      conditions: ''
  });

  // --- LOGIC HELPERS ---
  const getDaysSince = (dateStr: string) => {
      const diff = Date.now() - new Date(dateStr).getTime();
      return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const getHoursSince = (dateStr?: string) => {
      if (!dateStr) return 999;
      const diff = Date.now() - new Date(dateStr).getTime();
      return Math.floor(diff / (1000 * 60 * 60));
  };

  const canReceiveMessage = (participant: CampaignParticipant) => {
      // Spam protection: Only allow sending if last message was > 24 hours ago
      return getHoursSince(participant.lastReminderSent) >= 24;
  };

  // --- HANDLERS: TERMINAL ---

  const handleKeypad = (val: string) => {
      if (phoneNumber.length < 10) setPhoneNumber(prev => prev + val);
  };
  
  const handleKeypadDelete = () => {
      setPhoneNumber(prev => prev.slice(0, -1));
  };

  const handleSearchClient = () => {
      if (phoneNumber.length < 10) return;
      // Mock finding client
      setScannedClient({ name: 'Ana García', type: 'Frecuente' });
      setTerminalStep('wallet');
  };

  const handleActivateCampaign = (campaignId: string) => {
      // Create a NEW instance of the card
      const newCard: ClientWalletItem = {
          id: `w-${Date.now()}`,
          campaignId: campaignId,
          stamps: 1, // Start with 1 stamp immediately
          status: 'active'
      };
      setClientWallet(prev => [...prev, newCard]);
      
      setTerminalStep('success'); 
      setTimeout(() => setTerminalStep('wallet'), 1500); 
  };

  const handleAddStamp = (walletId: string, campaignId: string) => {
      setClientWallet(prev => prev.map(item => {
          if (item.id === walletId) {
             const campaign = campaigns.find(c => c.id === campaignId);
             if (campaign?.target && item.stamps < campaign.target) {
                 return { ...item, stamps: item.stamps + 1 };
             }
          }
          return item;
      }));
  };

  const handleRedeem = (walletId: string) => {
      // Logic to redeem: Mark as finished/redeemed. Do NOT reset stamps.
      setClientWallet(prev => prev.map(item => {
        if (item.id === walletId) {
            return { 
                ...item, 
                status: 'redeemed', 
                redeemedAt: new Date().toLocaleDateString() 
            };
        }
        return item;
      }));
      setTerminalStep('success'); // Show success animation
      setTimeout(() => setTerminalStep('wallet'), 2000); // Go back to wallet
  };

  const handleTerminalReset = () => {
      setPhoneNumber('');
      setTerminalStep('input');
      setScannedClient(null);
  }

  // --- HANDLERS: ADMIN ---

  const startCreation = () => {
      setFormData({
        title: '',
        reward: '',
        target: 5,
        limit: 100,
        conditions: ''
      });
      setCreationStep('select_type');
      setIsCreating(true);
  };

  const handleSelectType = (type: 'loyalty' | 'coupon') => {
      setCreateType(type);
      setCreationStep('form');
      // Set defaults
      if (type === 'loyalty') {
          setFormData(prev => ({ ...prev, title: 'Tarjeta de Visitas', reward: 'Producto Gratis', target: 5 }));
      } else {
          setFormData(prev => ({ ...prev, title: 'Oferta Especial', reward: 'Descuento', limit: 50 }));
      }
  };

  const handleSaveCampaign = () => {
      const newCampaign: Campaign = {
          id: Date.now().toString(),
          type: createType,
          title: formData.title,
          subtitle: createType === 'loyalty' ? `Meta: ${formData.target} visitas` : `Stock: ${formData.limit}`,
          reward: formData.reward,
          target: createType === 'loyalty' ? formData.target : undefined,
          stats: '0 activos',
          color: createType === 'loyalty' ? 'purple' : 'orange',
          conditions: formData.conditions
      };
      
      setCampaigns([...campaigns, newCampaign]);
      setCreationStep('success');
  };

  const goToMarketing = () => {
      if (onNavigate) {
          const link = createType === 'loyalty' 
            ? `https://cuponera.pro/wallet` 
            : `https://cuponera.pro/promo/${Date.now()}`;

          const message = createType === 'loyalty' 
            ? `🎉 *NUEVA TARJETA DE LEALTAD* 🎉\n\nHola {nombre}, ahora en {negocio} premiamos tus visitas.\n\nCompleta ${formData.target} visitas y gana: *${formData.reward}*.\n\n¡Te esperamos!\n\n📲 Mira tu progreso aquí: ${link}`
            : `🔥 *CUPÓN: ${formData.title}* 🔥\n\nHola {nombre}, aprovecha esta promo exclusiva: *${formData.reward}*.\n\nSolo muestra este mensaje. ⚠️ ${formData.conditions}\n\n📲 Actívalo aquí: ${link}`;
          
          onNavigate('mass_messages', { prefilledMessage: message, sourceCampaign: formData.title });
      }
  };

  const goToTerminal = () => {
      setIsCreating(false);
      setActiveTab('terminal');
  };

  // --- ACTION HANDLERS FOR EXISTING CAMPAIGNS ---
  
  const handleMassSend = (campaign: Campaign, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (!onNavigate) return;

      const link = `https://cuponera.pro/wallet`;
      const target = campaign.target || 10;
      let message = '';
      let targetIds: string[] = [];

      // CONTEXT AWARE SENDING LOGIC
      
      // 1. Specific Selection (Checkboxes)
      if (selectedParticipantIds.length > 0) {
          targetIds = selectedParticipantIds;
          
          if (detailFilter === 'active') {
              // Sending to pending/active users (Strictly Progress)
              message = `👋 Hola {nombre}, llevas {progreso} de ${target} visitas en nuestra tarjeta "${campaign.title}". \n\n¡Solo te faltan {faltantes} para tu ${campaign.reward}! ☕\n\n¡Te esperamos pronto!\n\n📲 Tu tarjeta digital: ${link}`;
          } else if (detailFilter === 'winner') {
              // Sending to winners who haven't redeemed (Strictly Reward)
              message = `🏆 ¡Felicidades {nombre}! Ya completaste tu tarjeta. Tu premio: *${campaign.reward}* está listo para canjear. ¡Ven hoy! 🎉\n\n📲 Muestra este código: ${link}`;
          } else {
              // Sending to past users (Redeemed)
              message = `Hola {nombre}, gracias por ser parte de ${campaign.title}.\n\n📲 Accede a tu cuenta: ${link}`;
          }
      } 
      // 2. Tab Context Broadcast (Send to ALL visible in current tab)
      else if (selectedCampaign) { // Only if inside detail view
          // Filter ONLY those who can receive messages (not contacted recently)
          const visibleParticipants = MOCK_PARTICIPANTS.filter(p => p.status === detailFilter && canReceiveMessage(p));
          targetIds = visibleParticipants.map(p => p.id);

          if (targetIds.length === 0) {
              alert('No hay usuarios elegibles para enviar mensaje (todos fueron contactados hoy o no hay usuarios en esta lista).');
              return;
          }

          if (detailFilter === 'active') {
              message = `👋 Hola {nombre}, te recordamos que tienes activa la promo "${campaign.title}". ¡Ven a usarla antes de que expire!\n\n📲 Ver aquí: ${link}`;
          } else if (detailFilter === 'winner') {
              message = `🎁 ¡Tienes premios sin reclamar! Ganaste: *${campaign.reward}* en ${campaign.title}. Ven por él.`;
          } else {
              // Redeemed: Reactivation
              message = `👋 Hola {nombre}, esperamos que hayas disfrutado tu ${campaign.reward}. ¡Tenemos nuevas promos esperándote!`;
          }
      }
      // 3. General Broadcast (From Dashboard Card)
      else {
          message = campaign.type === 'loyalty' 
            ? `🎉 *NUEVA TARJETA DE LEALTAD* 🎉\n\nHola {nombre}, únete al *${campaign.title}* en {negocio}.\n\nCompleta ${campaign.target} visitas y gana: *${campaign.reward}*.\n\n¡Te esperamos!\n\n📲 Regístrate gratis aquí: ${link}`
            : `🔥 *CUPÓN: ${campaign.title}* 🔥\n\nHola {nombre}, aprovecha esta promo: *${campaign.reward}*.\n\nStock limitado. ¡Corre! 🏃‍♂️\n\n📲 Reclámalo aquí: ${link}`;
      }

      onNavigate('mass_messages', { 
          prefilledMessage: message, 
          sourceCampaign: selectedParticipantIds.length > 0 ? `Recordatorio: ${campaign.title}` : `Campaña: ${campaign.title}`,
          targetIds: targetIds.length > 0 ? targetIds : undefined
      });
  };

  const handleIndividualAssign = (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      setActiveTab('terminal');
  };

  // --- BULK SELECTION HANDLERS ---

  const toggleParticipant = (id: string) => {
      setSelectedParticipantIds(prev => 
          prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
      );
  };

  const toggleAllParticipants = (participants: CampaignParticipant[]) => {
      // Only toggle those who CAN receive messages
      const eligible = participants.filter(p => canReceiveMessage(p));
      const eligibleIds = eligible.map(p => p.id);

      const allEligibleSelected = eligibleIds.every(id => selectedParticipantIds.includes(id));

      if (allEligibleSelected) {
          // Deselect eligible ones
          setSelectedParticipantIds(prev => prev.filter(id => !eligibleIds.includes(id)));
      } else {
          // Select all eligible
          setSelectedParticipantIds(prev => [...new Set([...prev, ...eligibleIds])]);
      }
  };

  // --- RADAR LOGIC ---
  const handleOpenRadar = (type: 'stuck' | 'forgotten' | 'loyal' | 'cold') => {
      setSelectedRadar(type);
  }

  const handleRadarAction = () => {
      if (!onNavigate || !selectedRadar) return;
      
      let message = '';
      let source = '';
      const link = `https://cuponera.pro/wallet`;
      
      switch(selectedRadar) {
          case 'stuck':
              source = 'Radar: Clientes Estancados';
              message = `👋 Hola {nombre}, notamos que te faltan muy pocas visitas para ganar tu premio. ¡Te extrañamos! Ven esta semana y te regalamos un sello extra.\n\n📲 Tu tarjeta: ${link}`;
              break;
          case 'forgotten':
              source = 'Radar: Premios Olvidados';
              message = `🎁 {nombre}, ¡tienes un premio esperando! Completaste tu tarjeta pero no lo has canjeado. Ven hoy por él.\n\n📲 Ver premio: ${link}`;
              break;
          case 'loyal':
              source = 'Radar: Recurrentes';
              message = `🌟 Hola {nombre}, gracias por ser cliente frecuente. Como agradecimiento, aquí tienes un cupón secreto de 15% OFF para tu próxima visita.\n\n📲 Guárdalo aquí: ${link}`;
              break;
          case 'cold':
              source = 'Radar: Clientes Nuevos sin Visitas';
              message = `👋 Hola {nombre}, gracias por registrarte. Aún no has venido a visitarnos. ¡Muéstranos este mensaje y recibe un postre gratis en tu primera compra!\n\n📲 Tu cupón: ${link}`;
              break;
      }
      
      // Get IDs from current radar view
      const targetIds = getRadarData(selectedRadar).map(u => u.id);

      onNavigate('mass_messages', { 
          prefilledMessage: message, 
          sourceCampaign: source,
          targetIds: targetIds 
      });
  };

  const getRadarData = (type: string): RadarUser[] => {
      switch(type) {
          case 'stuck': return [
              { id: '1', name: 'Ana García', info: 'Última visita: Hace 20 días', detail: '4/5', progress: 4, max: 5 },
              { id: '2', name: 'Carlos Ruiz', info: 'Última visita: Hace 32 días', detail: '8/10', progress: 8, max: 10 },
              { id: '3', name: 'Luis Miguel', info: 'Última visita: Hace 18 días', detail: '2/3', progress: 2, max: 3 },
          ];
          case 'forgotten': return [
              { id: '4', name: 'Maria Jose', info: 'Ganó: Café Gratis', detail: 'Hace 5 días', progress: 10, max: 10 },
              { id: '5', name: 'Pedro Pascal', info: 'Ganó: 2x1 Tacos', detail: 'Hace 10 días', progress: 5, max: 5 },
          ];
          case 'loyal': return [
              { id: '6', name: 'Sofia Vergara', info: 'Canjes totales: 15', detail: 'VIP', progress: 100, max: 100 },
              { id: '7', name: 'Bad Bunny', info: 'Canjes totales: 8', detail: 'Frecuente', progress: 80, max: 100 },
          ];
          default: return []; // cold
      }
  }

  // --- RENDER: TERMINAL VIEW (The Cashier Experience) ---
  if (activeTab === 'terminal') {
      
      // 1. ACTIVE CARDS: Wallet items that are 'active'
      const activeWalletItems = clientWallet.filter(w => w.status === 'active');
      
      // 2. AVAILABLE CAMPAIGNS: Campaigns that are NOT currently active in the user's wallet
      const availableCampaigns = campaigns.filter(c => 
          c.type === 'loyalty' && 
          !activeWalletItems.some(w => w.campaignId === c.id)
      );

      // 3. HISTORY: Redeemed items
      const historyItems = clientWallet.filter(w => w.status === 'redeemed');

      const coupons = campaigns.filter(c => c.type === 'coupon');

      return (
          <div className="h-full flex flex-col bg-slate-100">
              {/* Terminal Header */}
              <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md z-10">
                  <div className="flex items-center gap-2">
                      <div className="bg-white/10 p-2 rounded-lg">
                        <QrCode size={20} />
                      </div>
                      <div>
                          <h2 className="font-bold leading-none">Terminal Caja</h2>
                          <p className="text-[10px] text-slate-400">Modo Operación</p>
                      </div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('admin')} 
                    className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
                  >
                      Volver
                  </button>
              </div>

              {/* STEP 1: NUMPAD INPUT */}
              {terminalStep === 'input' && (
                  <div className="flex-1 flex flex-col max-w-md mx-auto w-full p-4">
                      <div className="flex-1 flex items-center justify-center">
                         <div className="text-center w-full">
                             <p className="text-slate-500 mb-2 font-medium">Ingresa Teléfono del Cliente</p>
                             <div className="text-4xl font-bold text-slate-800 h-16 flex items-center justify-center tracking-widest bg-white rounded-2xl shadow-inner border border-slate-200 mb-8">
                                 {phoneNumber ? phoneNumber.replace(/(\d{2})(\d{4})(\d{4})/, '$1 $2 $3') : <span className="text-slate-300">__ ____ ____</span>}
                             </div>
                         </div>
                      </div>

                      {/* Keypad */}
                      <div className="grid grid-cols-3 gap-3 mb-6">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                              <button 
                                key={num} 
                                onClick={() => handleKeypad(num.toString())}
                                className="h-16 bg-white rounded-xl shadow-sm border border-slate-200 text-2xl font-bold text-slate-700 active:bg-slate-50 active:scale-95 transition-all"
                              >
                                  {num}
                              </button>
                          ))}
                          <button onClick={() => setPhoneNumber('')} className="h-16 flex items-center justify-center text-slate-400 hover:text-red-500 font-bold tracking-wider">BORRAR</button>
                          <button onClick={() => handleKeypad('0')} className="h-16 bg-white rounded-xl shadow-sm border border-slate-200 text-2xl font-bold text-slate-700 active:bg-slate-50 active:scale-95 transition-all">0</button>
                          <button onClick={handleKeypadDelete} className="h-16 flex items-center justify-center text-slate-500 active:scale-95">
                              <Delete size={28} />
                          </button>
                      </div>

                      <button 
                        onClick={handleSearchClient}
                        disabled={phoneNumber.length < 10}
                        className="w-full bg-brand-600 text-white h-16 rounded-xl font-bold text-lg shadow-lg shadow-brand-200 disabled:opacity-50 disabled:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                          <Search size={24} /> BUSCAR CLIENTE
                      </button>
                  </div>
              )}

              {/* STEP 2: CLIENT WALLET (ACTION) */}
              {terminalStep === 'wallet' && scannedClient && (
                  <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full overflow-y-auto">
                      <div className="flex items-center gap-3 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                          <button onClick={handleTerminalReset} className="p-2 hover:bg-slate-100 rounded-full">
                              <ArrowLeft size={24} className="text-slate-500" />
                          </button>
                          <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-xl">
                              {scannedClient.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                              <h3 className="font-bold text-lg text-slate-900 leading-none">{scannedClient.name}</h3>
                              <p className="text-slate-500 text-sm mt-1">{phoneNumber}</p>
                          </div>
                      </div>

                      {/* --- SECTION: ACTIVE LOYALTY CARDS --- */}
                      {activeWalletItems.length > 0 && (
                          <div className="mb-6">
                              <h4 className="text-sm font-bold text-slate-500 uppercase mb-3 ml-1 flex items-center gap-2">
                                  <Wallet size={16}/> En Curso
                              </h4>
                              <div className="space-y-4">
                                {activeWalletItems.map(walletItem => {
                                    const card = campaigns.find(c => c.id === walletItem.campaignId);
                                    if (!card) return null;

                                    const stamps = walletItem.stamps;
                                    const target = card.target || 10;
                                    const isComplete = stamps >= target;

                                    return (
                                        <div key={walletItem.id} className={`bg-white rounded-2xl border-2 ${isComplete ? 'border-green-500 shadow-green-100' : 'border-slate-100'} shadow-sm overflow-hidden relative`}>
                                            {isComplete && (
                                                <div className="bg-green-500 text-white text-center py-1 text-xs font-bold uppercase tracking-wider">
                                                    ¡Premio Disponible!
                                                </div>
                                            )}
                                            <div className="p-5">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h3 className="font-bold text-xl text-slate-900">{card.title}</h3>
                                                        <p className="text-slate-500 text-sm">{card.reward}</p>
                                                    </div>
                                                    <div className="bg-slate-100 px-3 py-1 rounded-lg font-mono font-bold text-slate-600">
                                                        {stamps}/{target}
                                                    </div>
                                                </div>

                                                {/* Stamp Grid */}
                                                <div className="flex flex-wrap gap-2 mb-6">
                                                    {Array.from({ length: target }).map((_, i) => (
                                                        <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border ${
                                                            i < stamps 
                                                                ? 'bg-brand-500 border-brand-500 text-white' 
                                                                : 'bg-slate-50 border-slate-200 text-slate-300'
                                                        }`}>
                                                            {i < stamps && <Star size={14} fill="currentColor" />}
                                                        </div>
                                                    ))}
                                                </div>

                                                {isComplete ? (
                                                    <button 
                                                        onClick={() => handleRedeem(walletItem.id)}
                                                        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Gift size={20} /> ENTREGAR & FINALIZAR
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleAddStamp(walletItem.id, card.id)}
                                                        className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Plus size={20} /> SUMAR VISITA
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                              </div>
                          </div>
                      )}

                      {/* --- SECTION: AVAILABLE TO JOIN (Walk-in Activation) --- */}
                      {availableCampaigns.length > 0 && (
                          <div className="mb-6">
                              <h4 className="text-sm font-bold text-slate-500 uppercase mb-3 ml-1 flex items-center gap-2">
                                  <PlayCircle size={16}/> Promociones Disponibles
                              </h4>
                              <div className="space-y-3">
                                  {availableCampaigns.map(card => (
                                      <div key={card.id} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between group hover:bg-white hover:border-brand-200 hover:shadow-sm transition-all">
                                          <div>
                                              <h3 className="font-bold text-slate-800">{card.title}</h3>
                                              <p className="text-xs text-slate-500">Premio: {card.reward}</p>
                                          </div>
                                          <button 
                                            onClick={() => handleActivateCampaign(card.id)}
                                            className="bg-white border border-slate-200 text-brand-600 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-brand-600 hover:text-white transition-all active:scale-95"
                                          >
                                              Activar Tarjeta
                                          </button>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}

                      {/* --- SECTION: HISTORY / REDEEMED --- */}
                      {historyItems.length > 0 && (
                          <div className="mb-6">
                              <h4 className="text-sm font-bold text-slate-500 uppercase mb-3 ml-1 flex items-center gap-2">
                                  <History size={16}/> Historial Reciente
                              </h4>
                              <div className="space-y-2 opacity-70">
                                  {historyItems.map(item => {
                                      const card = campaigns.find(c => c.id === item.campaignId);
                                      return (
                                          <div key={item.id} className="bg-white border border-slate-100 p-3 rounded-xl flex items-center justify-between">
                                              <div>
                                                  <p className="font-bold text-slate-700 text-sm">{card?.title}</p>
                                                  <p className="text-xs text-slate-400">Canjeado el {item.redeemedAt}</p>
                                              </div>
                                              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-lg font-bold uppercase">Completado</span>
                                          </div>
                                      )
                                  })}
                              </div>
                          </div>
                      )}

                      {coupons.length > 0 && (
                          <>
                            <h4 className="text-sm font-bold text-slate-500 uppercase mt-2 mb-3 ml-1">Cupones de Descuento</h4>
                            {coupons.map(coupon => (
                                <div key={coupon.id} className="bg-white p-4 rounded-2xl border border-dashed border-slate-300 flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                                            <Tag size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800">{coupon.title}</h3>
                                            <p className="text-xs text-slate-500">{coupon.reward}</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            setTerminalStep('success'); 
                                            setTimeout(() => setTerminalStep('wallet'), 2000);
                                        }}
                                        className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 active:scale-95"
                                    >
                                        Validar
                                    </button>
                                </div>
                            ))}
                          </>
                      )}
                  </div>
              )}

                {/* STEP 3: SUCCESS FEEDBACK */}
                {terminalStep === 'success' && (
                    <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center text-white backdrop-blur-sm animate-in fade-in">
                        <div className="bg-green-500 p-6 rounded-full mb-4 shadow-xl shadow-green-900/50 scale-110">
                            <CheckCircle size={64} />
                        </div>
                        <h2 className="text-3xl font-bold">¡Listo!</h2>
                        <p className="text-white/80">Acción registrada correctamente</p>
                    </div>
                )}
          </div>
      );
  }

  // --- RENDER: ADMIN VIEW (Clean & Simple) ---
  return (
    <div className="p-4 md:p-8 space-y-6 h-full flex flex-col relative">
      
      {/* 1. Header Clean */}
      <div className="flex justify-between items-center mb-6">
         <div>
            <h2 className="text-2xl font-bold text-slate-800">Cuponera Digital</h2>
            <p className="text-sm text-slate-500">Programas de fidelización activos</p>
         </div>
         
         <div className="flex gap-2">
             {/* Radar Toggle (Hidden Complexity) */}
             <button 
                onClick={() => setShowRadar(!showRadar)}
                className={`px-4 py-2 rounded-xl shadow-sm text-sm font-bold flex items-center gap-2 transition-all ${
                    showRadar ? 'bg-indigo-50 border border-indigo-200 text-indigo-700' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
             >
                 {showRadar ? <X size={16}/> : <Lightbulb size={16} className="text-indigo-600"/>}
                 {showRadar ? 'Ocultar' : 'Oportunidades'}
             </button>

             {/* Terminal Button */}
             <button 
                onClick={() => setActiveTab('terminal')}
                className="bg-slate-900 text-white px-4 py-2 rounded-xl shadow-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-800 active:scale-95 transition-all"
             >
                 <Smartphone size={16} />
                 Terminal Caja
             </button>
         </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        
        {/* --- RADAR DE RETENCIÓN (CONDITIONAL) --- */}
        {showRadar && (
            <div className="mb-8 animate-in slide-in-from-top-4 fade-in">
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl">
                    <div className="flex items-center gap-2 mb-4">
                        <Radar size={18} className="text-indigo-600" />
                        <h3 className="font-bold text-indigo-900">Radar de Clientes</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div onClick={() => handleOpenRadar('stuck')} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-orange-300 transition-all">
                            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">3 Clientes</span>
                            <h4 className="font-bold text-slate-800 mt-2">A un paso del premio</h4>
                        </div>
                        <div onClick={() => handleOpenRadar('forgotten')} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-green-300 transition-all">
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">2 Clientes</span>
                            <h4 className="font-bold text-slate-800 mt-2">Premio Olvidado</h4>
                        </div>
                        <div onClick={() => handleOpenRadar('loyal')} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:border-blue-300 transition-all">
                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">2 Clientes</span>
                            <h4 className="font-bold text-slate-800 mt-2">Frecuentes</h4>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* 2. Campaign Grid (Clean) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
            {/* Existing Campaigns */}
            {campaigns.map(campaign => (
                <div 
                    key={campaign.id} 
                    onClick={() => { setSelectedCampaign(campaign); setSelectedParticipantIds([]); }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative group transition-all hover:shadow-md cursor-pointer hover:border-indigo-300 flex items-center gap-4"
                >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                        campaign.type === 'loyalty' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                    }`}>
                        {campaign.type === 'loyalty' ? <Trophy size={28} /> : <Ticket size={28} />}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg text-slate-900 truncate">{campaign.title}</h3>
                            <ChevronRight size={18} className="text-slate-300" />
                        </div>
                        <p className="text-sm text-slate-500 truncate">{campaign.reward}</p>
                        <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                            <User size={10} /> {campaign.stats}
                        </p>
                    </div>
                </div>
            ))}

            {/* Create New (Simple) */}
            <button 
                onClick={startCreation}
                className="min-h-[100px] border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 bg-slate-50/50 hover:border-brand-300 hover:text-brand-500 hover:bg-white transition-all gap-2"
            >
                <Plus size={24} />
                <span className="font-bold">Nueva Campaña</span>
            </button>
        </div>
      </div>

      {/* --- PREVIEW SIMULATOR --- */}
      {previewCampaign && (
          <ClientCardSimulator 
            campaign={previewCampaign} 
            onClose={() => setPreviewCampaign(null)} 
          />
      )}

      {/* --- CAMPAIGN DETAIL MODAL (Control Center) --- */}
      {selectedCampaign && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-4xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col">
                  {/* Header */}
                  <div className="p-6 border-b border-slate-100 bg-slate-50 shrink-0">
                      <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-4">
                              <button onClick={() => setSelectedCampaign(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
                                  <ArrowLeft size={24} />
                              </button>
                              <div>
                                  <div className="flex items-center gap-2">
                                      <h3 className="font-bold text-2xl text-slate-900">{selectedCampaign.title}</h3>
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${selectedCampaign.type === 'loyalty' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                          {selectedCampaign.type === 'loyalty' ? 'Tarjeta' : 'Cupón'}
                                      </span>
                                  </div>
                                  <p className="text-slate-500 text-sm">{selectedCampaign.subtitle} • Premio: {selectedCampaign.reward}</p>
                              </div>
                          </div>
                          
                          {/* Top Actions */}
                          <div className="flex gap-2">
                              <button 
                                onClick={() => setPreviewCampaign(selectedCampaign)}
                                className="p-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50"
                                title="Vista Previa"
                              >
                                  <Eye size={20} />
                              </button>
                              
                              {/* CONTEXT AWARE BUTTON */}
                              {detailFilter !== 'redeemed' && (
                                  <button 
                                    onClick={(e) => handleMassSend(selectedCampaign, e)}
                                    className={`bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all ${selectedParticipantIds.length > 0 ? 'bg-brand-50 border-brand-200 text-brand-700' : ''}`}
                                  >
                                      <Megaphone size={16} /> 
                                      {selectedParticipantIds.length > 0 
                                        ? `Enviar a ${selectedParticipantIds.length} seleccionados` 
                                        : detailFilter === 'active' 
                                            ? `Recordar a los pendientes` 
                                            : `Avisar a ganadores`
                                      }
                                  </button>
                              )}
                          </div>
                      </div>

                      {/* Detail Tabs */}
                      <div className="flex gap-1 bg-slate-200/50 p-1 rounded-xl w-fit">
                          <button 
                            onClick={() => { setDetailFilter('active'); setSelectedParticipantIds([]); }}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${detailFilter === 'active' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                              {selectedCampaign.type === 'loyalty' ? 'En Progreso (Solo Visitas)' : 'Activos'}
                          </button>
                          
                          {/* Only show 'Winners' for Loyalty Cards (Complete but not redeemed) */}
                          {selectedCampaign.type === 'loyalty' && (
                              <button 
                                onClick={() => { setDetailFilter('winner'); setSelectedParticipantIds([]); }}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${detailFilter === 'winner' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                              >
                                  <Trophy size={14} /> Ganadores
                              </button>
                          )}

                          <button 
                            onClick={() => { setDetailFilter('redeemed'); setSelectedParticipantIds([]); }}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${detailFilter === 'redeemed' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                          >
                              {selectedCampaign.type === 'loyalty' ? 'Historial Canje' : 'Ya Usados'}
                          </button>
                      </div>
                  </div>

                  {/* Body with Participant List */}
                  <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 relative">
                      
                      {/* Bulk Action Controls */}
                      {detailFilter !== 'redeemed' && (
                          <div className="flex items-center gap-2 mb-4 bg-white p-2 rounded-xl border border-slate-200 w-fit">
                              <button 
                                onClick={() => toggleAllParticipants(MOCK_PARTICIPANTS.filter(p => p.status === detailFilter))}
                                className="flex items-center gap-2 text-sm text-slate-600 font-bold px-3 py-1 hover:bg-slate-50 rounded-lg transition-colors"
                              >
                                  {selectedParticipantIds.length > 0 && selectedParticipantIds.length === MOCK_PARTICIPANTS.filter(p => p.status === detailFilter && canReceiveMessage(p)).length 
                                    ? <CheckSquare size={18} className="text-brand-600" /> 
                                    : <Square size={18} />
                                  }
                                  Seleccionar Disponibles
                              </button>
                          </div>
                      )}

                      {MOCK_PARTICIPANTS.filter(p => p.status === detailFilter).length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-slate-400">
                              <BarChart3 size={48} className="mb-2 opacity-50" />
                              <p className="font-medium">No hay clientes en esta categoría aún.</p>
                          </div>
                      ) : (
                          <div className="space-y-3 pb-20">
                              {MOCK_PARTICIPANTS.filter(p => p.status === detailFilter).map(participant => {
                                  const daysInactive = getDaysSince(participant.lastVisit);
                                  const isRisk = detailFilter === 'active' && daysInactive > 30;
                                  const isSelected = selectedParticipantIds.includes(participant.id);
                                  const isContactable = canReceiveMessage(participant);
                                  
                                  return (
                                      <div 
                                        key={participant.id} 
                                        className={`bg-white p-4 rounded-2xl border shadow-sm flex items-center justify-between transition-all ${
                                            isSelected ? 'border-brand-500 ring-1 ring-brand-200 bg-brand-50/30' : 'border-slate-200'
                                        } ${!isContactable && detailFilter !== 'redeemed' ? 'opacity-60 bg-slate-50' : ''}`}
                                      >
                                          <div className="flex items-center gap-4">
                                              {/* Checkbox */}
                                              {detailFilter !== 'redeemed' && (
                                                  <button 
                                                    onClick={() => isContactable && toggleParticipant(participant.id)} 
                                                    className={`text-slate-400 ${isContactable ? 'hover:text-brand-600' : 'cursor-not-allowed text-slate-300'}`}
                                                    title={!isContactable ? 'Mensaje enviado recientemente' : 'Seleccionar'}
                                                  >
                                                      {isSelected ? <CheckSquare size={20} className="text-brand-600" /> : isContactable ? <Square size={20} /> : <Ban size={20}/>}
                                                  </button>
                                              )}

                                              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                                                  {participant.name.charAt(0)}
                                              </div>
                                              <div>
                                                  <p className="font-bold text-slate-900 flex items-center gap-2">
                                                      {participant.name}
                                                      {!isContactable && detailFilter !== 'redeemed' && (
                                                          <span className="text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                                                              <Clock size={10} /> Contactado hoy
                                                          </span>
                                                      )}
                                                  </p>
                                                  <div className="flex items-center gap-2 text-xs text-slate-500">
                                                      <span>{participant.phone}</span>
                                                      <span>•</span>
                                                      <span className={isRisk ? 'text-red-500 font-bold' : ''}>
                                                          Última visita: {daysInactive === 0 ? 'Hoy' : `Hace ${daysInactive} días`}
                                                      </span>
                                                  </div>
                                              </div>
                                          </div>

                                          {/* Center: Progress */}
                                          <div className="flex-1 px-8">
                                              {detailFilter === 'active' && selectedCampaign.type === 'loyalty' && (
                                                  <div>
                                                      <div className="flex justify-between text-xs font-bold mb-1">
                                                          <span className="text-slate-500">{participant.progress} / {selectedCampaign.target} sellos</span>
                                                          <span className="text-indigo-600">{Math.round((participant.progress / (selectedCampaign.target || 1)) * 100)}%</span>
                                                      </div>
                                                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                          <div 
                                                            className={`h-full rounded-full ${isRisk ? 'bg-orange-400' : 'bg-indigo-500'}`} 
                                                            style={{width: `${(participant.progress / (selectedCampaign.target || 1)) * 100}%`}}
                                                          ></div>
                                                      </div>
                                                  </div>
                                              )}
                                              {/* Coupons: Show if received */}
                                              {detailFilter === 'active' && selectedCampaign.type === 'coupon' && (
                                                  <div className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg text-xs font-bold text-center border border-orange-200">
                                                      🎟️ Cupón Enviado
                                                  </div>
                                              )}

                                              {detailFilter === 'winner' && (
                                                  <div className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold text-center border border-green-200">
                                                      🎉 ¡Premio Disponible!
                                                  </div>
                                              )}
                                              {detailFilter === 'redeemed' && (
                                                  <div className="text-center text-xs text-slate-400 font-medium">
                                                      Canjeado el {new Date().toLocaleDateString()}
                                                  </div>
                                              )}
                                          </div>
                                      </div>
                                  );
                              })}
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* --- CREATION MODAL --- */}
      {isCreating && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
              <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 flex flex-col max-h-[90vh]">
                  {/* Modal Header */}
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                      <h3 className="font-bold text-slate-800 text-lg">
                          {creationStep === 'select_type' ? '¿Qué deseas crear?' : 
                           creationStep === 'form' ? 'Configurar Campaña' : '¡Campaña Creada!'}
                      </h3>
                      <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                          <X size={20} />
                      </button>
                  </div>

                  {/* Modal Content */}
                  <div className="p-6 overflow-y-auto">
                      
                      {/* Step 1: Select Type (Redesigned) */}
                      {creationStep === 'select_type' && (
                          <div className="space-y-4">
                              <p className="text-sm text-slate-500 mb-2">Selecciona el tipo de promoción que mejor se adapte a tu objetivo actual.</p>
                              
                              <button 
                                onClick={() => handleSelectType('loyalty')}
                                className="w-full flex items-start gap-4 p-5 rounded-2xl border-2 border-indigo-100 bg-indigo-50/50 hover:bg-indigo-50 hover:border-indigo-500 hover:shadow-md transition-all text-left group relative overflow-hidden"
                              >
                                  <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                                      <Trophy size={28} />
                                  </div>
                                  <div className="relative z-10">
                                      <h4 className="font-bold text-lg text-slate-900 mb-1">Tarjeta de Sellos</h4>
                                      <p className="text-sm text-slate-600 leading-snug">
                                          Ideal para <strong>retención</strong>. Tus clientes acumulan visitas para desbloquear un premio.
                                      </p>
                                      <span className="inline-block mt-3 text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-md">Ej. 10 visitas = 1 café gratis</span>
                                  </div>
                              </button>

                              <button 
                                onClick={() => handleSelectType('coupon')}
                                className="w-full flex items-start gap-4 p-5 rounded-2xl border-2 border-orange-100 bg-orange-50/50 hover:bg-orange-50 hover:border-orange-500 hover:shadow-md transition-all text-left group relative overflow-hidden"
                              >
                                  <div className="bg-orange-100 text-orange-600 p-3 rounded-xl shrink-0 group-hover:scale-110 transition-transform">
                                      <Ticket size={28} />
                                  </div>
                                  <div className="relative z-10">
                                      <h4 className="font-bold text-lg text-slate-900 mb-1">Cupón Promocional</h4>
                                      <p className="text-sm text-slate-600 leading-snug">
                                          Ideal para <strong>atracción inmediata</strong>. Oferta de un solo uso para llenar el local hoy.
                                      </p>
                                      <span className="inline-block mt-3 text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-md">Ej. 2x1 solo este Jueves</span>
                                  </div>
                              </button>
                          </div>
                      )}

                      {/* Step 2: Form */}
                      {creationStep === 'form' && (
                          <div className="space-y-5">
                              {/* Header Preview */}
                              <div className={`flex items-center gap-3 p-4 rounded-xl mb-2 ${createType === 'loyalty' ? 'bg-indigo-50 text-indigo-900' : 'bg-orange-50 text-orange-900'}`}>
                                  {createType === 'loyalty' ? <Trophy size={24} className="text-indigo-600"/> : <Ticket size={24} className="text-orange-600"/>}
                                  <div>
                                      <h4 className="font-bold text-sm uppercase opacity-70">{createType === 'loyalty' ? 'Tarjeta de Fidelidad' : 'Cupón de Descuento'}</h4>
                                      <p className="text-xs opacity-60">Configura los detalles que verán tus clientes.</p>
                                  </div>
                              </div>

                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nombre de la Campaña</label>
                                  <input 
                                    type="text" 
                                    className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                                    placeholder={createType === 'loyalty' ? 'Ej. Club del Café' : 'Ej. 2x1 Jueves'}
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                  />
                              </div>

                              <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">
                                      {createType === 'loyalty' ? 'Premio al completar' : 'Beneficio / Descuento'}
                                  </label>
                                  <input 
                                    type="text" 
                                    className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                                    placeholder={createType === 'loyalty' ? 'Ej. Café Gratis' : 'Ej. 50% de Descuento'}
                                    value={formData.reward}
                                    onChange={e => setFormData({...formData, reward: e.target.value})}
                                  />
                              </div>

                              {createType === 'loyalty' ? (
                                  <div>
                                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Visitas Necesarias</label>
                                      <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl border border-slate-200">
                                          <button onClick={() => setFormData(prev => ({...prev, target: Math.max(1, prev.target - 1)}))} className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"><Minus size={20}/></button>
                                          <span className="flex-1 text-2xl font-bold text-center text-slate-800">{formData.target}</span>
                                          <button onClick={() => setFormData(prev => ({...prev, target: prev.target + 1}))} className="w-12 h-12 rounded-lg bg-white shadow-sm flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 active:scale-95 transition-all"><Plus size={20}/></button>
                                      </div>
                                  </div>
                              ) : (
                                  <div>
                                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Stock / Límite de usos</label>
                                      <input 
                                        type="number" 
                                        className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-medium"
                                        value={formData.limit}
                                        onChange={e => setFormData({...formData, limit: parseInt(e.target.value)})}
                                      />
                                  </div>
                              )}
                              
                               <div>
                                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Condiciones (Opcional)</label>
                                  <input 
                                    type="text" 
                                    className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                                    placeholder="Ej. Válido solo de Lunes a Viernes"
                                    value={formData.conditions}
                                    onChange={e => setFormData({...formData, conditions: e.target.value})}
                                  />
                              </div>

                              <button 
                                onClick={handleSaveCampaign}
                                disabled={!formData.title || !formData.reward}
                                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl mt-4 hover:bg-brand-600 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                              >
                                  <CheckCircle size={20} /> Guardar y Activar
                              </button>
                          </div>
                      )}

                      {/* Step 3: Success */}
                      {creationStep === 'success' && (
                          <div className="text-center py-4">
                              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                  <CheckCircle size={40} />
                              </div>
                              <h3 className="text-2xl font-bold text-slate-900 mb-2">¡Campaña Lista!</h3>
                              <p className="text-slate-500 text-sm mb-8 leading-relaxed max-w-xs mx-auto">
                                  La campaña <strong>"{formData.title}"</strong> ya está disponible en la terminal de caja.
                              </p>

                              <div className="grid grid-cols-1 gap-3 w-full mb-4">
                                  <button 
                                    onClick={goToMarketing}
                                    className="w-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold py-4 rounded-xl hover:bg-indigo-100 transition-all flex items-center justify-center gap-2"
                                  >
                                      <Megaphone size={20} /> Difusión Masiva
                                  </button>

                                  <button 
                                    onClick={goToTerminal}
                                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                                  >
                                      <User size={20} /> Asignar a una Persona
                                  </button>
                              </div>

                              <button 
                                onClick={() => setIsCreating(false)}
                                className="text-slate-500 text-sm hover:text-slate-800 font-medium py-2"
                              >
                                  Cerrar y volver al panel
                              </button>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Coupons;
