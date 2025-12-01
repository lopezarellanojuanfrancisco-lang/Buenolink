
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Send, CheckCircle, Smartphone, AlertCircle, Sparkles, Image as ImageIcon, FileText, Mic, Video, X, Play, Calendar, Clock, History, RotateCcw, Plus, Filter, Info, Gift } from 'lucide-react';
import { PlanType } from '../../types';

interface Props {
  onNavigate: (view: string) => void;
  plan: PlanType;
  initialParams?: any; // To receive data from Coupons or other modules
}

// Enriched Mock Data for Filtering Logic
// UPDATED: ID is now string to support cross-module compatibility
interface MockClient {
  id: string;
  name: string;
  phone: string;
  lastVisitDays: number; // Days since last visit
  totalVisits: number;
  daysSinceRegistration: number;
}

const MOCK_AUDIENCE: MockClient[] = [
  { id: '1', name: 'Ana García', phone: '+52 55 1234 5678', lastVisitDays: 2, totalVisits: 15, daysSinceRegistration: 120 }, // Active, VIP
  { id: '2', name: 'Carlos Méndez', phone: '+52 55 8765 4321', lastVisitDays: 45, totalVisits: 3, daysSinceRegistration: 60 }, // Recovery
  { id: '3', name: 'Sofía Torres', phone: '+52 55 1122 3344', lastVisitDays: 5, totalVisits: 2, daysSinceRegistration: 4 }, // New, Active
  { id: '4', name: 'Luis Rodríguez', phone: '+52 55 5555 6666', lastVisitDays: 32, totalVisits: 8, daysSinceRegistration: 200 }, // Recovery, VIP
  { id: '5', name: 'María López', phone: '+52 55 9988 7766', lastVisitDays: 1, totalVisits: 1, daysSinceRegistration: 1 }, // New, Active
  { id: '6', name: 'Pedro Páramo', phone: '+52 55 0000 1111', lastVisitDays: 90, totalVisits: 1, daysSinceRegistration: 95 }, // Lost (Not in Recovery filter usually)
  { id: '7', name: 'Carmen Salinas', phone: '+52 55 2222 3333', lastVisitDays: 10, totalVisits: 25, daysSinceRegistration: 300 }, // VIP, Active
  { id: '8', name: 'Roberto Gomez', phone: '+52 55 4444 5555', lastVisitDays: 35, totalVisits: 4, daysSinceRegistration: 40 }, // Recovery
];

type AttachmentType = 'none' | 'image' | 'pdf' | 'audio' | 'video';
type SendMode = 'now' | 'later';
type FilterType = 'all' | 'active' | 'recover' | 'vip' | 'new';

interface Campaign {
  id: string;
  date: string;
  message: string;
  recipientsCount: number;
  status: 'sent' | 'scheduled';
  attachmentType: AttachmentType;
  scheduledFor?: string;
}

const MOCK_HISTORY: Campaign[] = [
  {
    id: 'c1',
    date: '24 Oct, 10:30 AM',
    message: '🌮 ¡Martes de 2x1 en todos los tacos! Ven y disfruta con tus amigos.',
    recipientsCount: 154,
    status: 'sent',
    attachmentType: 'image'
  },
  {
    id: 'c2',
    date: '20 Oct, 09:00 AM',
    message: '☕ Café gratis en la compra de cualquier postre. ¡Te esperamos!',
    recipientsCount: 45,
    status: 'sent',
    attachmentType: 'none'
  }
];

const MassMessages: React.FC<Props> = ({ onNavigate, plan, initialParams }) => {
  const [step, setStep] = useState<'history' | 'select' | 'compose' | 'sending' | 'result'>('history');
  const [history, setHistory] = useState<Campaign[]>(MOCK_HISTORY);
  
  // Clients are stored as string IDs now
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [progress, setProgress] = useState(0);
  
  // Filter State
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  
  // Attachment State
  const [attachmentType, setAttachmentType] = useState<AttachmentType>('none');

  // Scheduling State
  const [sendMode, setSendMode] = useState<SendMode>('now');
  const [scheduledDate, setScheduledDate] = useState('');

  // Context from other modules
  const [sourceLabel, setSourceLabel] = useState<string | null>(null);

  // Auto-fill from navigation params
  useEffect(() => {
    if (initialParams) {
        if (initialParams.prefilledMessage) {
            setMessage(initialParams.prefilledMessage);
        }
        
        // Start logic
        if (initialParams.attachment) {
            setAttachmentType(initialParams.attachment);
        }
        
        if (initialParams.sourceCampaign) {
            setSourceLabel(initialParams.sourceCampaign);
        } else {
            setSourceLabel(null);
        }

        // --- INTELLIGENT AUTO-SELECTION ---
        if (initialParams.targetIds && initialParams.targetIds.length > 0) {
            // If IDs are passed, select them and SKIP selection screen
            setSelectedClients(initialParams.targetIds);
            setStep('compose'); // Jump directly to compose
        } else {
            // Default behavior if no specific IDs (e.g. general promo)
            setStep('select');
        }

    } else {
        // If no params, start at history
        setStep('history');
        setSourceLabel(null);
    }
  }, [initialParams]);

  // Filtering Logic
  const getFilteredAudience = () => {
    return MOCK_AUDIENCE.filter(client => {
      switch (activeFilter) {
        case 'active':
          return client.lastVisitDays <= 30; // Visited in last 30 days
        case 'recover':
          return client.lastVisitDays > 30 && client.lastVisitDays <= 60; // 30-60 days inactive
        case 'vip':
          return client.totalVisits > 5; // More than 5 visits
        case 'new':
          return client.daysSinceRegistration <= 7; // Registered in last 7 days
        default:
          return true;
      }
    });
  };

  const filteredAudience = getFilteredAudience();

  // Audience Selection Logic
  const toggleClient = (id: string) => {
    if (selectedClients.includes(id)) {
      setSelectedClients(selectedClients.filter(c => c !== id));
    } else {
      setSelectedClients([...selectedClients, id]);
    }
  };

  const toggleAll = () => {
    // Only toggle ALL currently visible (filtered) clients
    const allFilteredIds = filteredAudience.map(c => c.id);
    const allSelected = allFilteredIds.every(id => selectedClients.includes(id));

    if (allSelected) {
      // Unselect only the visible ones
      setSelectedClients(selectedClients.filter(id => !allFilteredIds.includes(id)));
    } else {
      // Select all visible ones (merge unique)
      const newSelection = new Set([...selectedClients, ...allFilteredIds]);
      setSelectedClients(Array.from(newSelection));
    }
  };

  const resetForm = () => {
    setMessage('');
    setAttachmentType('none');
    setSelectedClients([]);
    setSendMode('now');
    setScheduledDate('');
    setActiveFilter('all');
    setSourceLabel(null);
  };

  const handleNewCampaign = () => {
    resetForm();
    setStep('select');
  };

  const handleReuse = (campaign: Campaign) => {
    resetForm();
    setMessage(campaign.message);
    setAttachmentType(campaign.attachmentType);
    setStep('select');
  };

  // Sending Simulation
  const startSending = () => {
    setStep('sending');
    setProgress(0);

    const totalTime = 4000; // 4 seconds simulation
    const intervalTime = 50;
    const increment = 100 / (totalTime / intervalTime);

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setStep('result'), 500);
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);
  };

  const finalizeCampaign = () => {
    const newCampaign: Campaign = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      message: message,
      recipientsCount: selectedClients.length,
      status: sendMode === 'now' ? 'sent' : 'scheduled',
      attachmentType: attachmentType,
      scheduledFor: scheduledDate
    };
    
    setHistory([newCampaign, ...history]);
    setStep('history');
  };

  // Render Attachment Preview inside the Chat Bubble
  const renderAttachmentPreview = () => {
    switch (attachmentType) {
        case 'image':
            return (
                <div className="mb-2 rounded-lg overflow-hidden border border-slate-200">
                    <div className="h-32 bg-slate-200 w-full flex items-center justify-center bg-cover bg-center" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60)'}}>
                    </div>
                </div>
            );
        case 'pdf':
            return (
                <div className="mb-2 bg-slate-100 p-3 rounded-lg flex items-center gap-3 border border-slate-200">
                    <div className="bg-red-100 p-2 rounded text-red-600">
                        <FileText size={20} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-700">menú_temporada.pdf</p>
                        <p className="text-[10px] text-slate-500">1.2 MB • PDF</p>
                    </div>
                </div>
            );
        case 'audio':
            return (
                <div className="mb-2 flex items-center gap-2 pt-1 pb-1">
                    <div className="w-8 h-8 rounded-full bg-slate-400 flex items-center justify-center text-white shrink-0">
                        <Play size={12} fill="white" />
                    </div>
                    <div className="h-8 flex-1 flex flex-col justify-center gap-1">
                         <div className="h-1 bg-slate-300 rounded-full w-full relative overflow-hidden">
                             <div className="absolute left-0 top-0 bottom-0 bg-slate-500 w-1/3"></div>
                         </div>
                         <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                             <span>0:12</span>
                             <span>0:45</span>
                         </div>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center shrink-0">
                         <Mic size={12} className="text-white" />
                    </div>
                </div>
            );
        case 'video':
            return (
                 <div className="mb-2 rounded-lg overflow-hidden border border-slate-200 relative">
                    <div className="h-32 bg-slate-800 w-full flex items-center justify-center opacity-90">
                        <div className="w-10 h-10 rounded-full bg-black/50 border-2 border-white flex items-center justify-center text-white backdrop-blur-sm">
                            <Play size={16} fill="white" className="ml-1" />
                        </div>
                    </div>
                    <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">0:30</span>
                </div>
            );
        default:
            return null;
    }
  };

  // STEP 0: HISTORY
  if (step === 'history') {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Campañas</h2>
            <p className="text-sm text-slate-500">Historial de envíos masivos</p>
          </div>
          <button 
            onClick={handleNewCampaign}
            className="bg-brand-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-brand-200 hover:bg-brand-700 active:scale-95 transition-all flex items-center gap-2"
          >
            <Plus size={20} />
            <span className="hidden md:inline">Nueva Campaña</span>
          </button>
        </div>

        <div className="space-y-4">
          {history.map((campaign) => (
            <div key={campaign.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    campaign.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {campaign.status === 'sent' ? 'Enviado' : 'Programado'}
                  </span>
                  <span className="text-xs text-slate-400">{campaign.date}</span>
                </div>
                <button 
                  onClick={() => handleReuse(campaign)}
                  className="text-brand-600 hover:bg-brand-50 p-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                  title="Reutilizar contenido"
                >
                  <RotateCcw size={14} /> Reutilizar
                </button>
              </div>
              
              <div className="flex gap-3 mb-3">
                 <div className="shrink-0 pt-1">
                   {campaign.attachmentType === 'none' ? <FileText size={18} className="text-slate-300" /> : 
                    campaign.attachmentType === 'image' ? <ImageIcon size={18} className="text-blue-500" /> :
                    campaign.attachmentType === 'pdf' ? <FileText size={18} className="text-red-500" /> :
                    campaign.attachmentType === 'audio' ? <Mic size={18} className="text-teal-500" /> :
                    <Video size={18} className="text-purple-500" />
                   }
                 </div>
                 <p className="text-sm text-slate-700 line-clamp-2 font-medium">{campaign.message}</p>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-50 pt-3">
                <span className="flex items-center gap-1">
                  <Users size={14} /> {campaign.recipientsCount} destinatarios
                </span>
                {campaign.status === 'scheduled' && (
                  <span className="flex items-center gap-1 text-orange-600">
                    <Clock size={14} /> Programado para: {new Date(campaign.scheduledFor!).toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          ))}
          
          {history.length === 0 && (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send size={24} className="text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">No has enviado campañas aún.</p>
              <button onClick={handleNewCampaign} className="text-brand-600 font-bold text-sm mt-2 hover:underline">
                Crear la primera
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // STEP 1: SELECT AUDIENCE
  if (step === 'select') {
    const isAllSelected = filteredAudience.length > 0 && filteredAudience.every(c => selectedClients.includes(c.id));

    return (
      <div className="p-4 md:p-8 max-w-2xl mx-auto h-full flex flex-col">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => setStep('history')} className="p-2 hover:bg-slate-100 rounded-full">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Nueva Campaña</h2>
            <p className="text-sm text-slate-500">Paso 1: Filtrar y seleccionar audiencia</p>
          </div>
        </div>

        {sourceLabel && (
            <div className="bg-brand-50 border border-brand-200 text-brand-700 px-4 py-3 rounded-xl mb-4 flex items-center gap-3 text-sm animate-in slide-in-from-top-2">
                <div className="bg-brand-200 p-1.5 rounded-lg">
                    <Gift size={16} className="text-brand-700" />
                </div>
                <div>
                    <p className="font-bold">📢 Promocionando: {sourceLabel}</p>
                    <p className="text-xs opacity-80">Selecciona los clientes que recibirán este cupón.</p>
                </div>
            </div>
        )}

        {/* Filters Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mb-4">
            {[
              { id: 'all', label: 'Todos', icon: Users },
              { id: 'active', label: '🟢 Recientes y Activos', icon: CheckCircle },
              { id: 'recover', label: '🟡 Para Recuperar', icon: History },
              { id: 'vip', label: '⭐ VIPs', icon: Sparkles },
              { id: 'new', label: '🆕 Nuevos', icon: Plus },
            ].map((f) => (
                <button
                    key={f.id}
                    onClick={() => setActiveFilter(f.id as FilterType)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors border ${
                        activeFilter === f.id 
                        ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                    <f.icon size={14} />
                    {f.label}
                </button>
            ))}
        </div>

        {/* Smart Advice Banner */}
        {activeFilter !== 'all' && (
            <div className={`p-4 rounded-xl flex items-start gap-3 mb-4 text-sm animate-in fade-in slide-in-from-top-2 ${
                activeFilter === 'active' ? 'bg-green-50 text-green-800 border border-green-200' :
                activeFilter === 'recover' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                activeFilter === 'vip' ? 'bg-purple-50 text-purple-800 border border-purple-200' :
                'bg-blue-50 text-blue-800 border border-blue-200'
            }`}>
                <Info className="shrink-0 mt-0.5" size={18} />
                <p>
                    {activeFilter === 'active' && <strong>Clientes Activos (Últimos 30 días).</strong>}
                    {activeFilter === 'active' && " Tienen la marca fresca en la memoria. Tasa de apertura muy alta y riesgo de bloqueo nulo. Ideal para promociones del día."}
                    
                    {activeFilter === 'recover' && <strong>Para Recuperar (Inactivos 30-60 días).</strong>}
                    {activeFilter === 'recover' && " Están empezando a olvidar el negocio. Recomendamos enviar un cupón fuerte para motivar su regreso."}

                    {activeFilter === 'vip' && <strong>Clientes VIP (Más de 5 visitas).</strong>}
                    {activeFilter === 'vip' && " Tus embajadores de marca. Ideales para eventos exclusivos, pre-ventas o pedir reseñas."}

                    {activeFilter === 'new' && <strong>Nuevos Registros (Últimos 7 días).</strong>}
                    {activeFilter === 'new' && " Están en la 'luna de miel'. Incentiva la segunda visita inmediata para crear el hábito."}
                </p>
            </div>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 className="font-semibold text-slate-700 flex items-center gap-2">
              <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded text-xs">
                  {filteredAudience.length}
              </span>
              resultados
            </h3>
            <button 
              onClick={toggleAll}
              className="text-sm font-medium text-brand-600 hover:text-brand-700"
            >
              {isAllSelected ? 'Deseleccionar visualizados' : 'Seleccionar visualizados'}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {filteredAudience.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                    <Filter size={32} className="mb-2 opacity-50" />
                    <p>No hay clientes con este filtro.</p>
                </div>
            ) : (
                filteredAudience.map(client => (
                <div 
                    key={client.id}
                    onClick={() => toggleClient(client.id)}
                    className={`flex items-center p-3 mb-2 rounded-xl cursor-pointer transition-all border ${
                    selectedClients.includes(client.id) 
                        ? 'bg-brand-50 border-brand-200 shadow-sm' 
                        : 'bg-white border-transparent hover:bg-slate-50'
                    }`}
                >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 ${
                    selectedClients.includes(client.id) ? 'bg-brand-500 border-brand-500' : 'border-slate-300'
                    }`}>
                    {selectedClients.includes(client.id) && <CheckCircle size={14} className="text-white" />}
                    </div>
                    <div className="flex-1">
                    <div className="flex justify-between">
                        <p className="font-semibold text-slate-900">{client.name}</p>
                        {client.totalVisits > 5 && <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 rounded h-fit font-bold">VIP</span>}
                    </div>
                    <div className="flex gap-2 text-xs text-slate-500">
                         <span>Última visita: hace {client.lastVisitDays} días</span>
                         <span>•</span>
                         <span>Visitas: {client.totalVisits}</span>
                    </div>
                    </div>
                </div>
                ))
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <button 
              onClick={() => setStep('compose')}
              disabled={selectedClients.length === 0}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-600 transition-colors"
            >
              Continuar ({selectedClients.length} seleccionados)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STEP 2: COMPOSE MESSAGE
  if (step === 'compose') {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto h-full grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Col: Editor */}
        <div className="flex flex-col h-full">
           <div className="flex items-center gap-4 mb-6">
            <button onClick={() => setStep(initialParams?.targetIds ? 'history' : 'select')} className="p-2 hover:bg-slate-100 rounded-full">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Redactar Mensaje</h2>
              <p className="text-sm text-slate-500">Paso 2: Contenido y Programación</p>
            </div>
          </div>

          {/* Quick Info if auto-selected */}
          {initialParams?.targetIds && (
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl mb-4 flex items-center gap-2 text-sm text-blue-800">
                  <CheckCircle size={16} />
                  <span>Enviando a <strong>{selectedClients.length} clientes</strong> seleccionados previamente.</span>
              </div>
          )}

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex-1 flex flex-col overflow-y-auto">
            {plan !== PlanType.BASIC && (
              <button 
                onClick={() => setMessage("¡Hola! 🌮 Hoy tenemos 2x1 en todos los tacos al pastor. ¡Ven a cenar con nosotros! Válido solo hoy hasta las 10PM. 🏃‍♂️💨")}
                className="mb-4 bg-violet-50 text-violet-700 p-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium hover:bg-violet-100 transition-colors border border-violet-100"
              >
                <Sparkles size={16} /> Usar IA para redactar
              </button>
            )}

            <div className="relative mb-4">
                <textarea 
                className="w-full h-32 p-4 bg-slate-50 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none text-base"
                placeholder="Escribe tu mensaje aquí... Usa emojis para mejor impacto."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                ></textarea>
                
                {/* Variable chips */}
                <div className="flex gap-2 mt-2 overflow-x-auto">
                    <span className="bg-white border border-slate-200 px-2 py-1 rounded-md text-[10px] text-slate-600 font-mono cursor-pointer hover:bg-slate-100 shadow-sm whitespace-nowrap" onClick={() => setMessage(prev => prev + ' {nombre}')}>{`{nombre}`}</span>
                    <span className="bg-white border border-slate-200 px-2 py-1 rounded-md text-[10px] text-slate-600 font-mono cursor-pointer hover:bg-slate-100 shadow-sm whitespace-nowrap" onClick={() => setMessage(prev => prev + ' {negocio}')}>{`{negocio}`}</span>
                </div>
            </div>

            {/* Multimedia Toolbar */}
            <div className="mb-6">
                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase">Adjuntar Multimedia</p>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    <button 
                        onClick={() => setAttachmentType('image')}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border w-20 shrink-0 transition-all ${attachmentType === 'image' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                    >
                        <ImageIcon size={20} />
                        <span className="text-[10px] font-medium">Imagen</span>
                    </button>
                    <button 
                        onClick={() => setAttachmentType('pdf')}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border w-20 shrink-0 transition-all ${attachmentType === 'pdf' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                    >
                        <FileText size={20} />
                        <span className="text-[10px] font-medium">PDF</span>
                    </button>
                    <button 
                        onClick={() => setAttachmentType('audio')}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border w-20 shrink-0 transition-all ${attachmentType === 'audio' ? 'bg-teal-50 border-teal-500 text-teal-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Mic size={20} />
                        <span className="text-[10px] font-medium">Audio</span>
                    </button>
                    <button 
                        onClick={() => setAttachmentType('video')}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border w-20 shrink-0 transition-all ${attachmentType === 'video' ? 'bg-purple-50 border-purple-500 text-purple-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                    >
                        <Video size={20} />
                        <span className="text-[10px] font-medium">Video</span>
                    </button>
                </div>
                
                {attachmentType !== 'none' && (
                    <div className="mt-2 flex items-center gap-2 bg-slate-100 p-2 rounded-lg text-sm text-slate-600 animate-in fade-in slide-in-from-top-1">
                        <span className="font-semibold">Archivo adjunto seleccionado.</span>
                        <button onClick={() => setAttachmentType('none')} className="ml-auto text-slate-400 hover:text-red-500 p-1">
                            <X size={16} />
                        </button>
                    </div>
                )}
            </div>

            {/* Scheduling Section */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                <p className="text-xs font-semibold text-slate-500 mb-3 uppercase">Configuración de Envío</p>
                <div className="flex gap-2 mb-4">
                  <button 
                    onClick={() => setSendMode('now')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${sendMode === 'now' ? 'bg-white shadow-sm text-brand-600 ring-1 ring-brand-200' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    <Send size={16} /> Enviar Ahora
                  </button>
                  <button 
                    onClick={() => setSendMode('later')}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${sendMode === 'later' ? 'bg-white shadow-sm text-brand-600 ring-1 ring-brand-200' : 'text-slate-500 hover:bg-slate-100'}`}
                  >
                    <Calendar size={16} /> Programar
                  </button>
                </div>

                {sendMode === 'later' && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-xs text-slate-500 mb-1">Fecha y Hora</label>
                    <input 
                      type="datetime-local" 
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                )}
            </div>

            <button 
              onClick={startSending}
              disabled={(!message.trim() && attachmentType === 'none') || (sendMode === 'later' && !scheduledDate)}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-600 transition-colors flex items-center justify-center gap-2 mt-auto"
            >
              {sendMode === 'now' ? (
                <><Send size={20} /> Enviar Campaña Ahora</>
              ) : (
                <><Clock size={20} /> Programar Campaña</>
              )}
            </button>
          </div>
        </div>

        {/* Right Col: Preview */}
        <div className="hidden md:flex flex-col items-center justify-center bg-slate-100 rounded-3xl p-8 border-4 border-slate-200">
           <div className="w-[300px] bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-300">
              <div className="bg-[#075E54] h-16 flex items-center px-4 text-white gap-3">
                 <div className="w-8 h-8 rounded-full bg-white/20"></div>
                 <div className="flex-1">
                   <p className="font-bold text-sm">Tacos El Primo</p>
                   <p className="text-[10px] opacity-80">en línea</p>
                 </div>
              </div>
              <div className="bg-[#E5DDD5] h-[400px] p-4 flex flex-col overflow-y-auto bg-opacity-50" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                 <div className="bg-white p-3 rounded-tr-lg rounded-bl-lg rounded-br-lg self-start shadow-sm max-w-[85%] mb-2">
                    {/* Render Attachment Here */}
                    {renderAttachmentPreview()}

                    <p className="text-[12px] text-slate-800 leading-relaxed whitespace-pre-wrap">
                      {message || (attachmentType === 'none' && <span className="text-slate-400 italic">Tu mensaje aparecerá aquí...</span>)}
                    </p>
                    <div className="text-[10px] text-slate-400 text-right mt-1">
                      {sendMode === 'now' ? '10:30 AM' : (scheduledDate ? new Date(scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--')}
                    </div>
                 </div>
              </div>
           </div>
           <p className="mt-4 text-slate-500 text-sm font-medium flex items-center gap-2">
             <Smartphone size={16} /> Vista previa de WhatsApp
           </p>
        </div>
      </div>
    );
  }

  // STEP 3: SENDING PROGRESS
  if (step === 'sending') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 max-w-md mx-auto text-center">
        <div className="w-full bg-slate-200 rounded-full h-4 mb-6 overflow-hidden">
          <div 
            className="bg-brand-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {sendMode === 'now' ? 'Enviando mensajes...' : 'Programando campaña...'}
        </h2>
        <p className="text-slate-500 mb-8">
          {sendMode === 'now' 
            ? 'Por seguridad, enviamos en grupos pequeños con intervalos de espera. No cierres esta ventana.'
            : 'Guardando configuración en el servidor y reservando espacio en la cola de envío.'}
        </p>
        {sendMode === 'now' && (
          <div className="bg-orange-50 text-orange-700 p-4 rounded-xl flex items-start gap-3 text-left text-sm">
             <AlertCircle className="shrink-0 mt-0.5" size={18} />
             <p>WhatsApp puede bloquear tu número si envías demasiados mensajes muy rápido. Nuestro sistema inteligente gestiona el ritmo por ti.</p>
          </div>
        )}
      </div>
    );
  }

  // STEP 4: RESULTS
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-in fade-in zoom-in duration-500">
      <div className="bg-green-100 p-6 rounded-full text-green-600 mb-6">
        <CheckCircle size={64} />
      </div>
      <h2 className="text-3xl font-bold text-slate-900 mb-2">
        {sendMode === 'now' ? '¡Campaña Enviada!' : '¡Campaña Programada!'}
      </h2>
      <p className="text-slate-500 mb-8 max-w-sm">
        {sendMode === 'now' 
          ? `Tu mensaje ha sido entregado exitosamente a ${selectedClients.length} clientes.`
          : `Tu campaña se enviará automáticamente el ${new Date(scheduledDate).toLocaleDateString()} a las ${new Date(scheduledDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}.`
        }
      </p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
           <p className="text-xs text-slate-400 uppercase font-bold">Destinatarios</p>
           <p className="text-2xl font-bold text-slate-900">{selectedClients.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
           {sendMode === 'now' ? (
             <>
                <p className="text-xs text-slate-400 uppercase font-bold">Est. Apertura</p>
                <p className="text-2xl font-bold text-brand-600">~95%</p>
             </>
           ) : (
             <>
                <p className="text-xs text-slate-400 uppercase font-bold">Estado</p>
                <p className="text-xl font-bold text-orange-500">En Cola</p>
             </>
           )}
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <button 
            onClick={finalizeCampaign}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
        >
            <History size={20} /> Volver al Historial
        </button>
        <button 
            onClick={() => onNavigate('dashboard')}
            className="w-full text-slate-500 py-2 hover:text-slate-800 transition-colors text-sm"
        >
            Ir al Dashboard
        </button>
      </div>
    </div>
  );
};

export default MassMessages;
