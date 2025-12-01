
import React, { useState, useEffect, useRef } from 'react';
import { PlanType, Order, Client } from '../../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  MessageSquare, 
  Search, 
  Phone, 
  Star, 
  X, 
  User, 
  UserPlus, 
  QrCode, 
  ArrowLeft, 
  Share2, 
  AlertCircle,
  Clock,
  CheckCircle, 
  Gift,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  ChevronRight,
  Receipt
} from 'lucide-react';
import { MOCK_CLIENTS, MOCK_ORDERS } from '../../constants';

interface DashboardProps {
  plan: PlanType;
  onNavigate: (view: string) => void;
}

// Mock Data for Client Detail View
const MOCK_CLIENT_WALLET = [
    { id: 'c1', name: 'Club del Café', progress: 8, target: 10, reward: 'Café Gratis', type: 'loyalty' },
    { id: 'c2', name: '2x1 Tacos', progress: 0, target: 1, reward: '2x1', type: 'coupon' }
];

const BusinessDashboard: React.FC<DashboardProps> = ({ plan, onNavigate }) => {
  const [showClientsModal, setShowClientsModal] = useState(false);
  const [clientModalMode, setClientModalMode] = useState<'list' | 'add'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Client Detail State
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [detailTab, setDetailTab] = useState<'profile' | 'chat'>('profile'); // For mobile view
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{sender: 'me'|'client', text: string, time: string}[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const data = [
    { name: 'Lun', ventas: 4000 },
    { name: 'Mar', ventas: 3000 },
    { name: 'Mie', ventas: 2000 },
    { name: 'Jue', ventas: 2780 },
    { name: 'Vie', ventas: 1890 },
    { name: 'Sab', ventas: 2390 },
    { name: 'Dom', ventas: 3490 },
  ];

  const filteredClients = MOCK_CLIENTS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const handleCloseModal = () => {
      setShowClientsModal(false);
      setClientModalMode('list');
      setSelectedClient(null);
  };

  const handleOpenClientDetail = (client: Client) => {
      setSelectedClient(client);
      setDetailTab('profile');
      // Init Mock Chat
      setChatHistory([
          { sender: 'client', text: 'Hola, ¿a qué hora cierran hoy?', time: 'Ayer' },
          { sender: 'me', text: 'Hola! Cerramos a las 10 PM.', time: 'Ayer' },
          { sender: 'client', text: 'Perfecto, gracias.', time: 'Ayer' }
      ]);
  };

  const handleSendChat = () => {
      if (!chatMessage.trim()) return;
      setChatHistory([...chatHistory, { sender: 'me', text: chatMessage, time: 'Ahora' }]);
      setChatMessage('');
      // Simulate reply
      setTimeout(() => {
           setChatHistory(prev => [...prev, { sender: 'client', text: '👍', time: 'Ahora' }]);
      }, 2000);
  };

  useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, detailTab, selectedClient]);

  // Get Orders for selected client
  const clientOrders = selectedClient 
    ? MOCK_ORDERS.filter(o => o.clientName.includes(selectedClient.name.split(' ')[0])) 
    : [];

  return (
    <div className="p-4 md:p-8 space-y-6">
      <header className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">Hola, Juan 👋</h2>
           <p className="text-slate-500 text-sm">Aquí está el resumen de hoy en Tacos El Primo.</p>
        </div>
        <div className="hidden md:block">
            <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-lg text-sm font-semibold">
                Plan {plan}
            </span>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <ShoppingBag size={20} />
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">+12%</span>
            </div>
            <p className="text-slate-500 text-xs font-medium uppercase">Ventas Hoy</p>
            <h3 className="text-2xl font-bold text-slate-900">$4,520</h3>
        </div>

        {/* CLICKEABLE CLIENTS CARD */}
        <div 
            onClick={() => setShowClientsModal(true)}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-brand-300 hover:shadow-md transition-all group"
        >
             <div className="flex justify-between items-start mb-2">
                <div className="bg-purple-50 p-2 rounded-lg text-purple-600 group-hover:bg-purple-100 transition-colors">
                    <Users size={20} />
                </div>
                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">Ver Lista</span>
            </div>
            <p className="text-slate-500 text-xs font-medium uppercase">Base de Datos</p>
            <h3 className="text-2xl font-bold text-slate-900">154</h3>
            <p className="text-[10px] text-slate-400">Clientes registrados</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
             <div className="flex justify-between items-start mb-2">
                <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                    <TrendingUp size={20} />
                </div>
            </div>
            <p className="text-slate-500 text-xs font-medium uppercase">Ticket Promedio</p>
            <h3 className="text-2xl font-bold text-slate-900">$185</h3>
        </div>

         <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
             <div className="flex justify-between items-start mb-2">
                <div className="bg-pink-50 p-2 rounded-lg text-pink-600">
                    <MessageSquare size={20} />
                </div>
            </div>
            <p className="text-slate-500 text-xs font-medium uppercase">Msjs Enviados</p>
            <h3 className="text-2xl font-bold text-slate-900">150</h3>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-800 mb-6">Tendencia de Ventas</h3>
        <div className="h-64 w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="ventas" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorVentas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => onNavigate('mass_messages')}
            className="bg-gradient-to-r from-brand-500 to-brand-600 text-white p-4 rounded-xl shadow-lg shadow-brand-200 flex items-center justify-between group active:scale-95 transition-transform"
          >
              <span className="font-semibold">Enviar Promo Masiva</span>
              <MessageSquare className="group-hover:translate-x-1 transition-transform" />
          </button>
           <button 
             onClick={() => setShowClientsModal(true)}
             className="bg-white border border-slate-200 text-slate-700 p-4 rounded-xl shadow-sm flex items-center justify-between active:scale-95 transition-transform hover:bg-slate-50"
           >
              <span className="font-semibold">📂 Ver Directorio de Clientes</span>
              <Users size={20} className="text-slate-400" />
          </button>
      </div>

      {/* CLIENT DIRECTORY MODAL */}
      {showClientsModal && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
            <div className={`bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 flex flex-col transition-all duration-300 ${selectedClient ? 'max-w-5xl h-[90vh]' : 'h-[85vh]'}`}>
                
                {/* --- HEADER --- */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                    {selectedClient ? (
                        <div className="flex items-center gap-2">
                             <button onClick={() => setSelectedClient(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg leading-none">{selectedClient.name}</h3>
                                <p className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    En línea
                                </p>
                            </div>
                        </div>
                    ) : (
                        clientModalMode === 'list' ? (
                            <>
                                <h3 className="font-bold text-slate-800 text-lg">Directorio</h3>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setClientModalMode('add')}
                                        className="bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 shadow-lg shadow-slate-300 hover:bg-slate-800 transition-all"
                                    >
                                        <UserPlus size={16} /> Nuevo Cliente
                                    </button>
                                    <button onClick={handleCloseModal} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
                                        <X size={20} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setClientModalMode('list')} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
                                        <ArrowLeft size={20} />
                                    </button>
                                    <h3 className="font-bold text-slate-800 text-lg">Registro de Cliente</h3>
                                </div>
                                <button onClick={handleCloseModal} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
                                    <X size={20} />
                                </button>
                            </>
                        )
                    )}
                </div>
                
                {/* --- VIEW: EXPEDIENTE (CLIENT FILE) --- */}
                {selectedClient ? (
                    <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50">
                        {/* Mobile Tabs */}
                        <div className="md:hidden flex border-b border-slate-200 bg-white">
                            <button 
                                onClick={() => setDetailTab('profile')} 
                                className={`flex-1 py-3 text-sm font-bold border-b-2 ${detailTab === 'profile' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-400'}`}
                            >
                                Perfil
                            </button>
                            <button 
                                onClick={() => setDetailTab('chat')} 
                                className={`flex-1 py-3 text-sm font-bold border-b-2 ${detailTab === 'chat' ? 'border-brand-600 text-brand-700' : 'border-transparent text-slate-400'}`}
                            >
                                Chat
                            </button>
                        </div>

                        {/* LEFT: PROFILE & HISTORY */}
                        <div className={`flex-1 overflow-y-auto p-4 md:border-r border-slate-200 md:w-1/3 bg-slate-50 ${detailTab === 'chat' ? 'hidden md:block' : 'block'}`}>
                            {/* Profile Card */}
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-4 flex items-center gap-4">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-2xl font-bold text-slate-500">
                                    {selectedClient.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-slate-500 text-xs">Teléfono</p>
                                    <p className="font-bold text-slate-800 text-lg">{selectedClient.phone}</p>
                                    <div className="flex gap-2 mt-1">
                                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                            {selectedClient.visits > 5 ? 'VIP' : 'Frecuente'}
                                        </span>
                                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold">
                                            {selectedClient.visits} Visitas
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Active Wallet */}
                            <div className="mb-6">
                                <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                                    <Gift size={16} /> Billetera Activa
                                </h4>
                                <div className="space-y-3">
                                    {MOCK_CLIENT_WALLET.map(item => (
                                        <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                                            <div className="flex justify-between items-start mb-1 relative z-10">
                                                <span className="font-bold text-sm text-slate-800">{item.name}</span>
                                                <span className="text-xs font-mono bg-slate-100 px-1.5 rounded">{item.progress}/{item.target}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mb-2 relative z-10">{item.reward}</p>
                                            
                                            {/* Progress Bar */}
                                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden relative z-10">
                                                <div className="bg-brand-500 h-full rounded-full" style={{width: `${(item.progress / item.target) * 100}%`}}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Order History */}
                            <div>
                                <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                                    <Receipt size={16} /> Historial de Pedidos
                                </h4>
                                <div className="space-y-2">
                                    {clientOrders.length > 0 ? clientOrders.map(order => (
                                        <div key={order.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-xs text-slate-800">Pedido #{order.id}</p>
                                                <p className="text-[10px] text-slate-500">{order.items.join(', ')}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-sm text-slate-900">${order.total}</p>
                                                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    )) : (
                                        <p className="text-center text-slate-400 text-sm py-4 italic">No hay pedidos registrados.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: CHAT (Desktop) / TAB (Mobile) */}
                        <div className={`flex-1 flex flex-col bg-[#e5ded8] relative md:w-2/3 ${detailTab === 'profile' ? 'hidden md:flex' : 'flex'}`}>
                             {/* Chat Bg Pattern */}
                             <div className="absolute inset-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                             <div className="flex-1 overflow-y-auto p-4 space-y-3 z-10">
                                 {chatHistory.map((msg, idx) => (
                                     <div key={idx} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                         <div className={`max-w-[80%] p-3 rounded-lg shadow-sm text-sm ${
                                             msg.sender === 'me' 
                                             ? 'bg-[#dcf8c6] text-slate-900 rounded-tr-none' 
                                             : 'bg-white text-slate-900 rounded-tl-none'
                                         }`}>
                                             <p>{msg.text}</p>
                                             <span className="text-[9px] text-slate-500 block text-right mt-1 opacity-70">{msg.time}</span>
                                         </div>
                                     </div>
                                 ))}
                                 <div ref={chatEndRef} />
                             </div>

                             <div className="p-3 bg-white z-20 border-t border-slate-200 flex gap-2 items-center">
                                 <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><Smile size={24}/></button>
                                 <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><Paperclip size={24}/></button>
                                 <div className="flex-1 bg-slate-100 rounded-full px-4 py-2">
                                     <input 
                                        type="text" 
                                        placeholder="Escribe un mensaje..." 
                                        className="w-full bg-transparent focus:outline-none text-sm"
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                                     />
                                 </div>
                                 <button 
                                    onClick={handleSendChat}
                                    className={`p-3 rounded-full transition-transform ${chatMessage.trim() ? 'bg-[#075E54] text-white hover:scale-105' : 'bg-slate-200 text-slate-400'}`}
                                 >
                                     <Send size={20} />
                                 </button>
                             </div>
                        </div>
                    </div>
                ) : (
                    /* --- VIEW: DIRECTORY LIST / ADD QR (Existing Logic) --- */
                    clientModalMode === 'list' ? (
                        <>
                            <div className="p-4 border-b border-slate-100 bg-white">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Buscar por nombre o teléfono..." 
                                        className="w-full bg-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
                                {filteredClients.map(client => (
                                    <div 
                                        key={client.id} 
                                        onClick={() => handleOpenClientDetail(client)}
                                        className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-brand-300 hover:shadow-md transition-all active:scale-[0.98]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                                                {client.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">{client.name}</p>
                                                <p className="text-xs text-slate-500">{client.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-[10px] uppercase font-bold text-slate-400">Puntos</p>
                                                <p className="text-sm font-bold text-brand-600 flex items-center gap-1 justify-end">
                                                    {client.points} <Star size={10} fill="currentColor" />
                                                </p>
                                            </div>
                                            <ChevronRight className="text-slate-300" size={20} />
                                        </div>
                                    </div>
                                ))}
                                {filteredClients.length === 0 && (
                                    <div className="text-center py-10 text-slate-400">
                                        <User size={32} className="mx-auto mb-2 opacity-50"/>
                                        <p>No se encontraron clientes.</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="p-4 border-t border-slate-100 bg-white text-center text-xs text-slate-400">
                                Total: {MOCK_CLIENTS.length} clientes registrados
                            </div>
                        </>
                    ) : (
                         /* ADD QR VIEW (Keep Existing) */
                        <div className="flex-1 flex flex-col p-6 overflow-y-auto bg-slate-50">
                            <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex gap-3 text-orange-800 text-sm mb-6">
                                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                                <p>
                                    <strong>Importante:</strong> Para evitar que WhatsApp bloquee tu número por SPAM, 
                                    el cliente debe enviar el primer mensaje (Opt-in).
                                </p>
                            </div>

                            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center text-center max-w-sm mx-auto w-full">
                                <h4 className="font-black text-slate-900 text-xl mb-2">¡Escanea para Regalos! 🎁</h4>
                                <p className="text-slate-500 text-sm mb-6">
                                    Pídele a tu cliente que escanee este código con su celular.
                                </p>
                                
                                <div className="bg-slate-900 p-4 rounded-2xl mb-6 shadow-xl shadow-slate-200">
                                    <QrCode size={180} className="text-white" />
                                </div>

                                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 w-full mb-6">
                                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">O envía este link</p>
                                    <p className="text-xs font-mono text-slate-600 bg-white p-2 rounded border border-slate-200 break-all select-all">
                                        https://wa.me/5215512345678?text=Hola,%20quiero%20regalos
                                    </p>
                                </div>

                                <button className="w-full bg-[#25D366] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-100 hover:bg-green-600 transition-all">
                                    <Share2 size={20} /> Compartir por WhatsApp
                                </button>
                            </div>
                        </div>
                    )
                )}

            </div>
        </div>
      )}

    </div>
  );
};

export default BusinessDashboard;
