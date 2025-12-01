
import React, { useState, useEffect, useRef } from 'react';
import { MOCK_ORDERS } from '../../constants';
import { Order } from '../../types';
import { 
  Clock, 
  CheckCircle, 
  ShoppingBag, 
  ArrowRight, 
  MessageCircle, 
  X, 
  Send, 
  Phone, 
  MoreVertical, 
  Paperclip, 
  Smile,
  ChevronLeft,
  Receipt,
  User,
  MapPin,
  Plus,
  Trash2,
  MessageSquare
} from 'lucide-react';

// Mock Menu for Manual Order Creation
const MANUAL_MENU_ITEMS = [
    { name: 'Tacos al Pastor', price: 25 },
    { name: 'Gringa', price: 65 },
    { name: 'Coca Cola', price: 30 },
    { name: 'Agua Fresca', price: 20 },
    { name: 'Orden de Guacamole', price: 80 },
];

// Mock chat history generator
const generateMockChat = (order: Order) => {
    if (order.source === 'DIRECT_MESSAGE') {
        return [
            { id: 1, sender: 'client', text: 'Hola, buenas tardes.', time: '12:00 PM' },
            { id: 2, sender: 'client', text: '¿Me puedes mandar 2 órdenes de tacos y una coca?', time: '12:01 PM' },
        ];
    }
    return [
        { id: 1, sender: 'client', text: 'Hola, acabo de hacer el pedido por el menú digital.', time: '10:30 AM' },
        { id: 2, sender: 'system', type: 'order_summary', items: order.items, total: order.total, time: '10:30 AM' },
        { id: 3, sender: 'business', text: `¡Hola ${order.clientName.split(' ')[0]}! Recibido. En un momento te confirmo el tiempo de espera.`, time: '10:31 AM' },
    ];
};

const CRM: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  
  // Manual Order State
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const columns = [
    { id: 'NEW', label: 'Nuevos', color: 'bg-blue-100 text-blue-700', icon: ShoppingBag },
    { id: 'PREPARING', label: 'En preparación', color: 'bg-orange-100 text-orange-700', icon: Clock },
    { id: 'READY', label: 'Listos', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  ];

  // Open Chat
  const handleOpenChat = (order: Order) => {
    setActiveOrder(order);
    setMessages(generateMockChat(order));
    setIsAddingProduct(false);
  };

  const handleCloseChat = () => {
    setActiveOrder(null);
  };

  // Move Order Status
  const moveOrder = (orderId: string, currentStatus: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); 
    
    let nextStatus: Order['status'] = 'NEW';
    if (currentStatus === 'NEW') nextStatus = 'PREPARING';
    else if (currentStatus === 'PREPARING') nextStatus = 'READY';
    else if (currentStatus === 'READY') nextStatus = 'DELIVERED';
    
    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status: nextStatus } : o);
    setOrders(updatedOrders);

    if (activeOrder && activeOrder.id === orderId) {
        setActiveOrder({ ...activeOrder, status: nextStatus });
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      sender: 'business',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  // --- MANUAL ORDER LOGIC ---
  const handleAddManualItem = (item: {name: string, price: number}) => {
      if (!activeOrder) return;

      const newItemString = `1x ${item.name}`;
      const newTotal = activeOrder.total + item.price;
      const newItems = [...activeOrder.items, newItemString];

      // Update Local State
      const updatedOrder = { ...activeOrder, items: newItems, total: newTotal, source: 'WHATSAPP' as const }; // Change source to simulate conversion
      setActiveOrder(updatedOrder);

      // Update Global List
      setOrders(prev => prev.map(o => o.id === activeOrder.id ? updatedOrder : o));
      
      // Auto-send confirmation message if it's the first item
      if (activeOrder.total === 0) {
          setMessages(prev => [...prev, {
              id: Date.now(),
              sender: 'business',
              text: `Claro que sí. Empiezo a tomar tu orden: ${item.name}.`,
              time: 'Ahora'
          }]);
      }
  };

  const handleRemoveManualItem = (index: number) => {
      if (!activeOrder) return;
      // This is a simplified remove (parsing the string would be complex in a real app without structured objects)
      // For MVP, we just remove the string and assume a fixed price reduction or keep simple
      const newItems = [...activeOrder.items];
      newItems.splice(index, 1);
      // Rough calc for demo
      const newTotal = Math.max(0, activeOrder.total - 25); 
      
      const updatedOrder = { ...activeOrder, items: newItems, total: newTotal };
      setActiveOrder(updatedOrder);
      setOrders(prev => prev.map(o => o.id === activeOrder.id ? updatedOrder : o));
  };

  const simulateIncomingMessage = () => {
      const newMsgOrder: Order = {
          id: `msg-${Date.now()}`,
          clientName: 'Cliente Nuevo',
          total: 0,
          status: 'NEW',
          items: [], // Empty items = Unstructured Message
          createdAt: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          source: 'DIRECT_MESSAGE'
      };
      setOrders([newMsgOrder, ...orders]);
      // Play sound notification logic here
      alert('🔔 ¡Nuevo mensaje recibido!');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeOrder]);

  // --- RENDER SPLIT VIEW INTERFACE ---
  if (activeOrder) {
    const isDirectMessage = activeOrder.items.length === 0 && activeOrder.total === 0;

    return (
      <div className="fixed inset-0 z-50 bg-slate-100 md:absolute md:inset-0 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Main Header */}
        <div className="bg-slate-900 text-white p-3 flex items-center justify-between shadow-sm shrink-0">
            <div className="flex items-center gap-2">
                <button onClick={handleCloseChat} className="p-1 hover:bg-slate-700 rounded-lg">
                    <ChevronLeft size={24} />
                </button>
                <span className="font-bold text-lg">
                    {isDirectMessage ? 'Conversación' : `Pedido #${activeOrder.id}`}
                </span>
            </div>
             <button onClick={handleCloseChat} className="hidden md:block hover:bg-slate-700 p-2 rounded-full">
                <X size={20} />
             </button>
        </div>

        {/* SPLIT CONTAINER */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* LEFT SIDE: TICKET / ORDER BUILDER */}
            <div className="w-full md:w-[350px] lg:w-[400px] bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col overflow-y-auto shadow-lg z-10">
                <div className="p-6 space-y-6">
                    
                    {/* Status Card */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Estado</p>
                        <div className="flex justify-between items-center mb-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 ${
                                activeOrder.status === 'NEW' ? 'bg-blue-100 text-blue-700' :
                                activeOrder.status === 'PREPARING' ? 'bg-orange-100 text-orange-700' :
                                'bg-green-100 text-green-700'
                            }`}>
                                {activeOrder.status === 'NEW' && <ShoppingBag size={16} />}
                                {activeOrder.status === 'PREPARING' && <Clock size={16} />}
                                {activeOrder.status === 'READY' && <CheckCircle size={16} />}
                                {activeOrder.status === 'NEW' ? 'Recibido' : 
                                 activeOrder.status === 'PREPARING' ? 'En Preparación' : 'Listo'}
                            </span>
                        </div>
                        
                        {/* Action Buttons */}
                        {activeOrder.status === 'NEW' && (
                            <button 
                            onClick={() => moveOrder(activeOrder.id, 'NEW')}
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                            <Clock size={20} /> Pasar a Cocina
                            </button>
                        )}
                        {activeOrder.status === 'PREPARING' && (
                            <button 
                            onClick={() => moveOrder(activeOrder.id, 'PREPARING')}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                            <CheckCircle size={20} /> Marcar Listo
                            </button>
                        )}
                        {activeOrder.status === 'READY' && (
                             <button 
                             onClick={() => moveOrder(activeOrder.id, 'READY')}
                             className="w-full bg-slate-800 hover:bg-slate-900 text-white py-3 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                             >
                             <ShoppingBag size={20} /> Entregar
                             </button>
                        )}
                    </div>

                    {/* Client Info */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                            <User size={16} className="text-slate-400" /> Cliente
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600">
                                {activeOrder.clientName.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{activeOrder.clientName}</p>
                                <p className="text-xs text-slate-500">+52 55 1234 5678</p>
                            </div>
                        </div>
                    </div>

                    {/* Order Builder / Details */}
                    <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Receipt size={16} className="text-slate-400" /> Ticket
                            </h3>
                            <button 
                                onClick={() => setIsAddingProduct(!isAddingProduct)}
                                className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded hover:bg-brand-100 transition-colors"
                            >
                                {isAddingProduct ? 'Cerrar Menú' : '+ Agregar'}
                            </button>
                        </div>

                        {isAddingProduct && (
                            <div className="mb-4 bg-slate-50 p-2 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
                                <p className="text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Selecciona producto:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {MANUAL_MENU_ITEMS.map((item, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => handleAddManualItem(item)}
                                            className="bg-white border border-slate-200 p-2 rounded-lg text-left hover:border-brand-500 hover:shadow-sm transition-all"
                                        >
                                            <p className="font-bold text-xs text-slate-800">{item.name}</p>
                                            <p className="text-xs text-brand-600 font-bold">${item.price}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex-1 flex flex-col">
                            {activeOrder.items.length === 0 ? (
                                <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center flex-1">
                                    <ShoppingBag size={32} className="mb-2 opacity-50" />
                                    <p className="text-sm">Ticket vacío</p>
                                    <p className="text-xs opacity-70">Usa "+ Agregar" para crear la orden desde el chat.</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[300px]">
                                    {activeOrder.items.map((item, idx) => (
                                        <li key={idx} className="p-3 text-sm text-slate-700 flex justify-between group">
                                            <span>{item}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-slate-400">$??</span>
                                                <button onClick={() => handleRemoveManualItem(idx)} className="text-red-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div className="bg-slate-50 p-4 flex justify-between items-center border-t border-slate-200 mt-auto">
                                <span className="font-bold text-slate-600">Total</span>
                                <span className="font-bold text-xl text-slate-900">${activeOrder.total}</span>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>

            {/* RIGHT SIDE: CHAT */}
            <div className="flex-1 flex flex-col bg-[#e5ded8] relative">
                {/* Chat Header */}
                <div className="bg-[#075E54] text-white p-2 md:p-3 flex items-center justify-between shadow-md z-10">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
                        {activeOrder.clientName.charAt(0)}
                        </div>
                        <div>
                        <h3 className="font-bold text-sm md:text-base leading-tight">{activeOrder.clientName}</h3>
                        <p className="text-[10px] md:text-xs text-green-100 opacity-90">en línea</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <button className="hover:bg-white/10 p-2 rounded-full"><MoreVertical size={20} /></button>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    {messages.map((msg) => {
                         if (msg.type === 'order_summary') return null; 
                        
                        return (
                            <div key={msg.id} className={`flex ${msg.sender === 'business' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] md:max-w-[70%] rounded-lg px-3 py-2 shadow-sm text-sm relative ${
                                msg.sender === 'business' 
                                ? 'bg-[#dcf8c6] text-slate-900 rounded-tr-none' 
                                : 'bg-white text-slate-900 rounded-tl-none'
                            }`}>
                                <p>{msg.text}</p>
                                <span className="text-[10px] text-slate-500 block text-right mt-1 opacity-70">{msg.time}</span>
                            </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Chat Input */}
                <div className="bg-[#f0f2f5] p-2 md:p-3 flex items-center gap-2 shrink-0 border-t border-slate-200">
                    <button className="p-2 text-slate-500 hover:bg-slate-200 rounded-full hidden md:block">
                        <Smile size={24} />
                    </button>
                    <button className="p-2 text-slate-500 hover:bg-slate-200 rounded-full">
                        <Paperclip size={24} />
                    </button>
                    <div className="flex-1 bg-white rounded-full px-4 py-2 shadow-sm border border-slate-200">
                        <input 
                        type="text" 
                        className="w-full focus:outline-none bg-transparent text-sm md:text-base"
                        placeholder="Escribe un mensaje..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        autoFocus
                        />
                    </div>
                    <button 
                        onClick={handleSendMessage}
                        disabled={!inputText.trim()}
                        className={`p-3 rounded-full shadow-md transition-all ${
                        inputText.trim() ? 'bg-[#075E54] text-white hover:scale-105' : 'bg-slate-300 text-slate-500'
                        }`}
                    >
                        <Send size={20} className={inputText.trim() ? 'ml-0.5' : ''} />
                    </button>
                </div>
            </div>
        </div>
      </div>
    );
  }

  // --- RENDER KANBAN BOARD ---
  return (
    <div className="p-4 md:p-8 h-full flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">CRM de Pedidos</h2>
          <p className="text-sm text-slate-500">Toca una tarjeta para ver detalles y chatear</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={simulateIncomingMessage} 
                className="bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-xl text-sm font-bold hover:bg-slate-50 shadow-sm flex items-center gap-2"
            >
                <MessageSquare size={16} /> Simular Mensaje Entrante
            </button>
            <span className="text-sm bg-brand-100 text-brand-800 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                </span>
                En vivo
            </span>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto no-scrollbar">
        <div className="flex gap-4 min-w-[320px] md:min-w-0 h-full">
          {columns.map(col => (
            <div key={col.id} className="flex-1 min-w-[280px] bg-slate-100 rounded-xl p-3 flex flex-col">
              <div className={`flex items-center gap-2 p-3 rounded-lg mb-3 ${col.color}`}>
                <col.icon size={18} />
                <span className="font-bold">{col.label}</span>
                <span className="ml-auto bg-white/50 px-2 rounded text-sm font-mono">
                  {orders.filter(o => o.status === col.id).length}
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3 pb-20 md:pb-0">
                {orders
                  .filter(o => o.status === col.id)
                  .map(order => {
                    const isMsg = order.items.length === 0;
                    return (
                        <div 
                            key={order.id} 
                            onClick={() => handleOpenChat(order)}
                            className={`bg-white p-4 rounded-xl shadow-sm border group cursor-pointer hover:shadow-md transition-all active:scale-[0.98] ${
                                isMsg ? 'border-brand-200' : 'border-slate-200 hover:border-brand-200'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`font-bold text-sm px-1.5 rounded ${isMsg ? 'bg-brand-50 text-brand-700' : 'bg-slate-100 text-slate-800'}`}>
                                    {isMsg ? <MessageCircle size={14} className="inline mr-1"/> : '#'}{order.id}
                                </span>
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Clock size={12} /> {order.createdAt}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                                    {order.clientName.charAt(0)}
                                </div>
                                <p className="font-bold text-slate-900">{order.clientName}</p>
                            </div>
                            
                            {isMsg ? (
                                <p className="text-xs text-slate-500 italic mb-3">
                                    "Hola, quiero hacer un pedido..."
                                </p>
                            ) : (
                                <ul className="text-xs text-slate-500 mb-3 space-y-1 pl-1 border-l-2 border-slate-100">
                                {order.items.map((item, idx) => <li key={idx}>{item}</li>)}
                                </ul>
                            )}
                            
                            <div className="flex justify-between items-center mt-2 border-t pt-2 border-slate-50">
                                {isMsg ? (
                                    <span className="text-xs font-bold text-orange-500 flex items-center gap-1">
                                        <Receipt size={12} /> Crear Ticket
                                    </span>
                                ) : (
                                    <span className="font-bold text-slate-800">${order.total}</span>
                                )}
                                
                                <button 
                                    onClick={(e) => moveOrder(order.id, order.status, e)}
                                    className="bg-slate-900 text-white p-2 rounded-lg hover:bg-brand-600 transition-colors shadow-sm"
                                    title="Avanzar estado"
                                >
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    )
                })}
                {orders.filter(o => o.status === col.id).length === 0 && (
                   <div className="text-center py-12 opacity-50">
                      <ShoppingBag size={32} className="mx-auto mb-2 text-slate-300" />
                      <p className="text-sm text-slate-400 italic">Sin pedidos</p>
                   </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CRM;