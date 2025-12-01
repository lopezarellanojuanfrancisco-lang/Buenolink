
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Image as ImageIcon, 
  Edit2, 
  Trash2, 
  Save, 
  Eye, 
  CheckCircle,
  X,
  Camera,
  ToggleLeft,
  ToggleRight,
  Settings,
  Check,
  AlertCircle,
  Share2,
  Megaphone,
  MessageCircle,
  Copy,
  ExternalLink,
  Smartphone,
  ShoppingBag,
  ChevronRight,
  Minus,
  ArrowLeft,
  Bike,
  Store,
  Banknote,
  CreditCard,
  MapPin,
  ClipboardList,
  PenLine,
  Search,
  ChevronDown
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isAvailable: boolean;
}

interface MenuProps {
  onNavigate?: (view: string, params?: any) => void;
}

const MOCK_MENU: MenuItem[] = [
  { id: '1', name: 'Tacos al Pastor', description: 'Carne adobada con piña, cebolla y cilantro.', price: 25, category: 'Tacos', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=200&q=80', isAvailable: true },
  { id: '2', name: 'Gringa de Pastor', description: 'Queso fundido y carne al pastor en tortilla de harina.', price: 65, category: 'Tacos', image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&w=200&q=80', isAvailable: true },
  { id: '3', name: 'Coca Cola 600ml', description: 'Refresco bien frío.', price: 30, category: 'Bebidas', image: '', isAvailable: true },
  { id: '4', name: 'Flan Napolitano', description: 'Casero con caramelo.', price: 45, category: 'Postres', image: '', isAvailable: false },
];

// --- COMPONENT: CUSTOMER SIMULATOR (Modern Delivery App Style) ---
const CustomerMenuPreview: React.FC<{ 
    items: MenuItem[], 
    categories: string[], 
    onClose: () => void 
}> = ({ items, categories, onClose }) => {
    // Cart now includes notes per item
    const [cart, setCart] = useState<{item: MenuItem, qty: number, notes?: string}[]>([]);
    const [activeCat, setActiveCat] = useState('Todo');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Product Detail Modal State (The "UberEats" style modal)
    const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
    const [productModalQty, setProductModalQty] = useState(1);
    const [productModalNote, setProductModalNote] = useState('');

    // Checkout State
    const [viewState, setViewState] = useState<'menu' | 'checkout'>('menu');
    const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
    const [paymentType, setPaymentType] = useState<'cash' | 'transfer'>('cash');
    const [globalOrderNotes, setGlobalOrderNotes] = useState('');

    // Helpers
    const allCategories = ['Todo', ...categories];
    
    const addToCart = (item: MenuItem, qty: number, notes: string) => {
        const existingIndex = cart.findIndex(c => c.item.id === item.id && c.notes === notes);
        
        if (existingIndex >= 0) {
            // Update existing item with same notes
            const newCart = [...cart];
            newCart[existingIndex].qty += qty;
            setCart(newCart);
        } else {
            // Add new line item
            setCart([...cart, { item, qty, notes }]);
        }
        closeProductModal();
    };

    const removeFromCart = (index: number) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const openProductModal = (item: MenuItem) => {
        setSelectedProduct(item);
        setProductModalQty(1);
        setProductModalNote('');
    };

    const closeProductModal = () => {
        setSelectedProduct(null);
        setProductModalQty(1);
        setProductModalNote('');
    };

    const total = cart.reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0);
    const totalItems = cart.reduce((acc, curr) => acc + curr.qty, 0);

    const generateWhatsAppOrder = () => {
        let text = `Hola *Tacos El Primo*, quiero hacer un pedido:%0A%0A`;
        
        // Items
        cart.forEach(c => {
            text += `▪ ${c.qty}x ${c.item.name} ($${c.item.price * c.qty})%0A`;
            if (c.notes) {
                text += `  📝 _Nota: ${c.notes}_%0A`;
            }
        });
        
        text += `%0A💰 *Total: $${total}*`;
        text += `%0A---------------------------%0A`;
        
        // Delivery Info
        if (deliveryType === 'delivery') {
            text += `🛵 *Entrega:* A Domicilio%0A`;
            text += `📍 (Enviaré mi ubicación en el siguiente mensaje)%0A`;
        } else {
            text += `🛍️ *Entrega:* Paso a recoger%0A`;
        }

        // Payment Info
        text += `💳 *Pago:* ${paymentType === 'cash' ? 'Efectivo' : 'Transferencia'}%0A`;

        // Global Notes
        if (globalOrderNotes.trim()) {
            text += `ℹ️ *Info Extra:* ${globalOrderNotes}%0A`;
        }

        return text;
    };

    const filteredItems = items.filter(i => {
        const matchesCategory = activeCat === 'Todo' || i.category === activeCat;
        const matchesSearch = i.name.toLowerCase().includes(searchQuery.toLowerCase()) || i.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // --- VIEW: CHECKOUT ---
    if (viewState === 'checkout') {
        return (
            <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="bg-white px-4 py-4 flex items-center gap-4 shadow-sm z-50 sticky top-0">
                    <button onClick={() => setViewState('menu')} className="p-2 hover:bg-slate-100 rounded-full">
                        <ArrowLeft size={24} className="text-slate-700" />
                    </button>
                    <h2 className="font-bold text-lg text-slate-900">Confirmar Pedido</h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
                    
                    {/* 1. Order Summary */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <ShoppingBag size={18} className="text-brand-600"/> Resumen
                        </h3>
                        <div className="space-y-4">
                            {cart.map((c, idx) => (
                                <div key={idx} className="flex flex-col gap-1 border-b border-slate-50 pb-2 last:border-0 last:pb-0 relative">
                                    <div className="flex justify-between text-sm pr-6">
                                        <span className="text-slate-600"><span className="font-bold text-slate-900">{c.qty}x</span> {c.item.name}</span>
                                        <span className="font-medium">${c.item.price * c.qty}</span>
                                    </div>
                                    {c.notes && (
                                        <p className="text-xs text-slate-500 italic flex items-center gap-1">
                                            <PenLine size={10} /> {c.notes}
                                        </p>
                                    )}
                                    <button 
                                        onClick={() => removeFromCart(idx)}
                                        className="absolute right-0 top-0 text-slate-300 hover:text-red-500 p-1"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                            <div className="border-t border-slate-100 pt-3 flex justify-between items-center mt-3">
                                <span className="font-bold text-slate-900">Total a Pagar</span>
                                <span className="font-bold text-xl text-brand-600">${total}</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Delivery Method */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                         <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <MapPin size={18} className="text-brand-600"/> Método de Entrega
                        </h3>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setDeliveryType('delivery')}
                                className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                                    deliveryType === 'delivery' 
                                    ? 'border-brand-500 bg-brand-50 text-brand-700' 
                                    : 'border-slate-100 bg-slate-50 text-slate-400'
                                }`}
                            >
                                <Bike size={24} />
                                <span className="text-xs font-bold">A Domicilio</span>
                            </button>
                            <button 
                                onClick={() => setDeliveryType('pickup')}
                                className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                                    deliveryType === 'pickup' 
                                    ? 'border-brand-500 bg-brand-50 text-brand-700' 
                                    : 'border-slate-100 bg-slate-50 text-slate-400'
                                }`}
                            >
                                <Store size={24} />
                                <span className="text-xs font-bold">Recoger</span>
                            </button>
                        </div>
                    </div>

                     {/* 3. Payment Method */}
                     <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                         <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <CreditCard size={18} className="text-brand-600"/> Forma de Pago
                        </h3>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setPaymentType('cash')}
                                className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                                    paymentType === 'cash' 
                                    ? 'border-green-500 bg-green-50 text-green-700' 
                                    : 'border-slate-100 bg-slate-50 text-slate-400'
                                }`}
                            >
                                <Banknote size={24} />
                                <span className="text-xs font-bold">Efectivo</span>
                            </button>
                            <button 
                                onClick={() => setPaymentType('transfer')}
                                className={`flex-1 p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                                    paymentType === 'transfer' 
                                    ? 'border-green-500 bg-green-50 text-green-700' 
                                    : 'border-slate-100 bg-slate-50 text-slate-400'
                                }`}
                            >
                                <Smartphone size={24} />
                                <span className="text-xs font-bold">Transferencia</span>
                            </button>
                        </div>
                    </div>

                    {/* 4. Global Comments */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                         <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <ClipboardList size={18} className="text-brand-600"/> Información Adicional
                        </h3>
                        <textarea 
                            value={globalOrderNotes}
                            onChange={(e) => setGlobalOrderNotes(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none"
                            placeholder="Instrucciones de entrega, referencia de domicilio, etc."
                            rows={2}
                        ></textarea>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 safe-area-bottom z-50">
                    <button 
                         onClick={() => window.open(`https://wa.me/5512345678?text=${generateWhatsAppOrder()}`, '_blank')}
                         className="w-full bg-[#25D366] text-white p-4 rounded-xl shadow-xl shadow-green-200 flex items-center justify-center gap-3 active:scale-[0.98] transition-all hover:bg-[#20bd5a]"
                    >
                        <MessageCircle size={24} />
                        <span className="font-bold text-lg">Enviar Pedido por WhatsApp</span>
                    </button>
                </div>
            </div>
        );
    }

    // --- VIEW: MENU BROWSING (Default) ---
    return (
        <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col animate-in slide-in-from-bottom duration-300">
            
            {/* 1. TOP BAR: Simulation Context */}
            <div className="bg-slate-900 text-white px-4 py-3 flex justify-between items-center shadow-md z-50 shrink-0 safe-area-top">
                <div className="flex items-center gap-2">
                    <Smartphone size={18} className="text-brand-400" />
                    <span className="font-medium text-sm">Vista Cliente</span>
                </div>
                <button 
                    onClick={onClose}
                    className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
                >
                    Salir
                </button>
            </div>

            {/* 2. APP HEADER: Restaurant Branding */}
            <div className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40 pb-2">
                <div className="px-4 py-3">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tacos El Primo 🌮</h1>
                    <p className="text-slate-500 text-sm mb-3">Comida Mexicana • 20-30 min</p>
                    
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar en el menú..." 
                            className="w-full bg-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                
                {/* Category Pills */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-2 mask-linear-fade">
                    {allCategories.map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setActiveCat(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm ${
                                activeCat === cat 
                                ? 'bg-brand-600 text-white ring-2 ring-brand-100' 
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. MENU CONTENT */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 pb-32">
                <div className="flex items-center justify-between">
                     <h3 className="font-bold text-lg text-slate-800">{activeCat === 'Todo' ? 'Menú Completo' : activeCat}</h3>
                     <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        {filteredItems.length} Resultados
                     </span>
                </div>

                {filteredItems.length === 0 && (
                    <div className="py-10 text-center opacity-50">
                        <ShoppingBag size={48} className="mx-auto mb-2 text-slate-300"/>
                        <p>No hay productos disponibles.</p>
                    </div>
                )}
                
                <div className="grid grid-cols-1 gap-4">
                    {filteredItems.map(item => {
                        const cartItem = cart.find(c => c.item.id === item.id);
                        const qtyInCart = cart.filter(c => c.item.id === item.id).reduce((acc, curr) => acc + curr.qty, 0);
                        
                        return (
                            <div 
                                key={item.id} 
                                onClick={() => item.isAvailable && openProductModal(item)}
                                className={`bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex gap-4 transition-all active:scale-[0.98] cursor-pointer ${!item.isAvailable ? 'opacity-60 grayscale' : 'hover:border-brand-200 hover:shadow-md'}`}
                            >
                                {/* Text Info */}
                                <div className="flex-1 flex flex-col justify-between min-h-[90px] py-1">
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-base leading-tight mb-1">{item.name}</h4>
                                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>
                                    </div>
                                    <div className="mt-2 font-bold text-lg text-slate-800">
                                        ${item.price}
                                    </div>
                                </div>

                                {/* Image & Add Button */}
                                <div className="flex flex-col items-center justify-between gap-2 shrink-0 relative">
                                    <div className="w-24 h-24 bg-slate-100 rounded-xl overflow-hidden shadow-inner relative">
                                        {item.image ? (
                                            <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={24}/></div>
                                        )}
                                        {qtyInCart > 0 && (
                                            <div className="absolute top-0 right-0 bg-brand-600 text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-bl-xl shadow-sm">
                                                {qtyInCart}
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Mini Add Button Appearance */}
                                    <div className={`absolute -bottom-3 shadow-md border rounded-full px-3 py-1 text-xs font-bold transition-colors ${item.isAvailable ? 'bg-white border-slate-200 text-brand-600' : 'bg-slate-200 text-slate-500 border-slate-300'}`}>
                                        {item.isAvailable ? 'Agregar' : 'Agotado'}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 4. BOTTOM FLOATING BAR: Go To Checkout */}
            {totalItems > 0 && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent pb-8 pt-8 z-40">
                    <button 
                         onClick={() => setViewState('checkout')}
                         className="w-full bg-brand-600 text-white p-4 rounded-2xl shadow-xl shadow-brand-200 flex items-center justify-between active:scale-[0.98] transition-all hover:bg-brand-700"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-black/10 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">
                                {totalItems}
                            </div>
                            <span className="font-bold text-lg">Ver Pedido</span>
                        </div>
                        <span className="font-bold text-lg">${total}</span>
                    </button>
                </div>
            )}

            {/* --- PRODUCT DETAIL MODAL (FULL SCREEN MOBILE STYLE) --- */}
            {selectedProduct && (
                <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex justify-center items-end md:items-center animate-in fade-in duration-200">
                    {/* Desktop Click Backdrop */}
                    <div className="absolute inset-0 hidden md:block" onClick={closeProductModal}></div>
                    
                    <div className="bg-white w-full h-full md:h-auto md:max-h-[85vh] md:max-w-md md:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300 flex flex-col relative z-10">
                        
                        {/* Image Header (Hero) */}
                        <div className="h-72 md:h-64 bg-slate-200 relative shrink-0">
                            {selectedProduct.image ? (
                                <img src={selectedProduct.image} className="w-full h-full object-cover" alt={selectedProduct.name} />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400"><ImageIcon size={48}/></div>
                            )}
                            {/* Gradient Overlay for Text Visibility */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent opacity-60"></div>
                            
                            <button onClick={closeProductModal} className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full shadow-sm text-white hover:bg-white/40 transition-colors">
                                <ArrowLeft size={24} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 pb-28">
                            <div className="flex justify-between items-start mb-2">
                                <h2 className="text-3xl font-black text-slate-900 leading-tight">{selectedProduct.name}</h2>
                                <span className="text-2xl font-bold text-brand-600">${selectedProduct.price}</span>
                            </div>
                            <p className="text-slate-500 mb-8 leading-relaxed text-lg">{selectedProduct.description}</p>
                            
                            <div className="border-t border-slate-100 pt-6">
                                <label className="block text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                                    <PenLine size={18} className="text-brand-600"/> ¿Alguna nota para la cocina?
                                </label>
                                <textarea 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-base focus:ring-2 focus:ring-brand-500 focus:outline-none resize-none"
                                    rows={3}
                                    placeholder="Ej. Sin cebolla, salsa aparte, extra limón..."
                                    value={productModalNote}
                                    onChange={(e) => setProductModalNote(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Fixed Footer Actions */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 safe-area-bottom shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center bg-slate-100 rounded-xl p-1.5 border border-slate-200">
                                    <button 
                                        onClick={() => setProductModalQty(Math.max(1, productModalQty - 1))}
                                        className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-colors active:scale-90"
                                    >
                                        <Minus size={22} />
                                    </button>
                                    <span className="w-12 text-center font-bold text-xl">{productModalQty}</span>
                                    <button 
                                        onClick={() => setProductModalQty(productModalQty + 1)}
                                        className="w-12 h-12 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-colors active:scale-90"
                                    >
                                        <Plus size={22} />
                                    </button>
                                </div>
                                <button 
                                    onClick={() => addToCart(selectedProduct, productModalQty, productModalNote)}
                                    className="flex-1 bg-brand-600 text-white font-bold h-16 rounded-xl shadow-lg shadow-brand-200 hover:bg-brand-700 active:scale-95 transition-all flex items-center justify-between px-6 text-lg"
                                >
                                    <span>Agregar</span>
                                    <span>${selectedProduct.price * productModalQty}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


const Menu: React.FC<MenuProps> = ({ onNavigate }) => {
  // --- STATE ---
  const [items, setItems] = useState<MenuItem[]>(MOCK_MENU);
  const [categories, setCategories] = useState<string[]>(['Tacos', 'Bebidas', 'Postres', 'Extras']);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  
  // UI Modes
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isManagingCategories, setIsManagingCategories] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  
  // Product Form State
  const [currentItem, setCurrentItem] = useState<Partial<MenuItem>>({});

  // Category Manager State
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryIndex, setEditingCategoryIndex] = useState<number | null>(null);
  const [tempCategoryName, setTempCategoryName] = useState('');

  // --- PRODUCT LOGIC ---

  const handleAddItem = () => {
    setCurrentItem({
      id: Date.now().toString(),
      category: activeCategory, // Default to current tab
      isAvailable: true,
      image: ''
    });
    setIsEditingProduct(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setCurrentItem({ ...item });
    setIsEditingProduct(true);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const handleSaveItem = () => {
    if (!currentItem.name || !currentItem.price) return;

    if (items.find(i => i.id === currentItem.id)) {
      // Edit existing
      setItems(items.map(i => i.id === currentItem.id ? currentItem as MenuItem : i));
    } else {
      // Create new
      setItems([...items, currentItem as MenuItem]);
    }
    setIsEditingProduct(false);
  };

  const toggleAvailability = (id: string) => {
    setItems(items.map(i => i.id === id ? { ...i, isAvailable: !i.isAvailable } : i));
  };

  // --- CATEGORY LOGIC ---

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
      setCategories([...categories, newCategoryName.trim()]);
      setNewCategoryName('');
    }
  };

  const handleDeleteCategory = (category: string) => {
    // Check if products exist in this category
    const hasProducts = items.some(i => i.category === category);
    
    if (hasProducts) {
       alert(`No puedes eliminar "${category}" porque tiene productos. Mueve o elimina los productos primero.`);
       return;
    }

    const newCats = categories.filter(c => c !== category);
    setCategories(newCats);
    
    // If we deleted the active category, switch to the first available
    if (activeCategory === category && newCats.length > 0) {
      setActiveCategory(newCats[0]);
    }
  };

  const startEditingCategory = (index: number) => {
    setEditingCategoryIndex(index);
    setTempCategoryName(categories[index]);
  };

  const saveCategoryName = (index: number) => {
    if (!tempCategoryName.trim()) return;
    
    const oldName = categories[index];
    const newName = tempCategoryName.trim();

    // 1. Update Category List
    const updatedCategories = [...categories];
    updatedCategories[index] = newName;
    setCategories(updatedCategories);

    // 2. Update all products that had the old category name
    const updatedItems = items.map(item => 
      item.category === oldName ? { ...item, category: newName } : item
    );
    setItems(updatedItems);

    // 3. Update active category if needed
    if (activeCategory === oldName) {
      setActiveCategory(newName);
    }

    setEditingCategoryIndex(null);
  };

  // --- SHARE LOGIC ---
  const handleShareOption = (type: 'mass' | 'whatsapp' | 'copy') => {
    const menuLink = "https://cuponera.pro/tacos-el-primo";
    const promoText = `🌮 ¡Hola! Ya puedes ver nuestro Menú Digital actualizado con fotos y precios. Haz tu pedido aquí: ${menuLink}`;

    if (type === 'mass') {
        if (onNavigate) {
            onNavigate('mass_messages', {
                prefilledMessage: promoText,
                sourceCampaign: 'Menú Digital',
                attachment: 'none'
            });
        }
    } else if (type === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(promoText)}`, '_blank');
    } else {
        navigator.clipboard.writeText(menuLink);
        // Show small toast simulation
        const btn = document.getElementById('copy-btn');
        if (btn) btn.innerText = "¡Copiado!";
        setTimeout(() => { if (btn) btn.innerText = "Copiar Link"; }, 2000);
    }
    
    if (type !== 'copy') setShowShareModal(false);
  }

  // Filtered List
  const filteredItems = items.filter(i => i.category === activeCategory);

  // --- RENDER: PRODUCT EDITOR MODAL ---
  if (isEditingProduct) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col animate-in slide-in-from-bottom-10">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <button onClick={() => setIsEditingProduct(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
            <X size={24} />
          </button>
          <h3 className="font-bold text-slate-800 text-lg">
            {items.find(i => i.id === currentItem.id) ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <button 
            onClick={handleSaveItem}
            className="text-brand-600 font-bold text-sm px-3 py-1 hover:bg-brand-50 rounded-lg"
          >
            Guardar
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Image Upload Simulator */}
          <div className="flex justify-center">
             <div 
               className="w-32 h-32 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-brand-400 hover:text-brand-500 transition-colors relative overflow-hidden"
               onClick={() => setCurrentItem({...currentItem, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=200&q=80'})}
             >
                {currentItem.image ? (
                  <>
                    <img src={currentItem.image} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Camera className="text-white" />
                    </div>
                  </>
                ) : (
                  <>
                    <Camera size={28} className="mb-2" />
                    <span className="text-xs font-bold uppercase">Subir Foto</span>
                  </>
                )}
             </div>
          </div>

          <div className="space-y-4">
             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nombre del Producto</label>
                <input 
                  type="text" 
                  value={currentItem.name || ''}
                  onChange={e => setCurrentItem({...currentItem, name: e.target.value})}
                  className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold text-lg"
                  placeholder="Ej. Tacos al Pastor"
                />
             </div>

             <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Precio</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                        <input 
                        type="number" 
                        value={currentItem.price || ''}
                        onChange={e => setCurrentItem({...currentItem, price: parseFloat(e.target.value)})}
                        className="w-full p-4 pl-8 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold text-lg"
                        placeholder="0.00"
                        />
                    </div>
                </div>
                <div className="flex-1">
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Categoría</label>
                   <select 
                      value={currentItem.category}
                      onChange={e => setCurrentItem({...currentItem, category: e.target.value})}
                      className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 h-[62px]"
                   >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                   </select>
                </div>
             </div>

             <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Descripción</label>
                <textarea 
                  value={currentItem.description || ''}
                  onChange={e => setCurrentItem({...currentItem, description: e.target.value})}
                  className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none h-32"
                  placeholder="Ingredientes, tamaño, detalles..."
                ></textarea>
             </div>

             <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-700">Disponible (En Stock)</span>
                <button 
                  onClick={() => setCurrentItem({...currentItem, isAvailable: !currentItem.isAvailable})}
                  className={`text-3xl transition-colors ${currentItem.isAvailable ? 'text-green-500' : 'text-slate-300'}`}
                >
                   {currentItem.isAvailable ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                </button>
             </div>
          </div>
        </div>
        
        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex gap-3">
           {items.find(i => i.id === currentItem.id) && (
             <button 
                onClick={() => { handleDeleteItem(currentItem.id!); setIsEditingProduct(false); }}
                className="p-4 rounded-xl bg-red-50 text-red-600 hover:bg-red-100"
             >
                <Trash2 size={24} />
             </button>
           )}
           <button 
             onClick={handleSaveItem}
             className="flex-1 bg-slate-900 text-white font-bold rounded-xl py-4 hover:bg-brand-600 transition-colors shadow-lg"
           >
              Guardar Producto
           </button>
        </div>
      </div>
    );
  }

  // --- RENDER: CATEGORY MANAGER MODAL ---
  if (isManagingCategories) {
    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4">
         <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <h3 className="font-bold text-slate-800 text-lg">Editar Categorías</h3>
               <button onClick={() => setIsManagingCategories(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
                  <X size={20} />
               </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
               <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex gap-3 text-sm text-blue-800 mb-4">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p>Si cambias el nombre de una categoría, todos sus productos se actualizarán automáticamente.</p>
               </div>

               {/* Add New */}
               <div className="flex gap-2 mb-6">
                  <input 
                    type="text" 
                    placeholder="Nueva categoría..." 
                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                  />
                  <button 
                    onClick={handleAddCategory}
                    disabled={!newCategoryName.trim()}
                    className="bg-slate-900 text-white p-3 rounded-xl disabled:opacity-50"
                  >
                    <Plus size={20} />
                  </button>
               </div>

               {/* List */}
               <div className="space-y-2">
                  {categories.map((cat, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                       {editingCategoryIndex === idx ? (
                         <>
                           <input 
                              type="text" 
                              className="flex-1 bg-slate-50 p-1.5 rounded-lg border border-brand-300 focus:outline-none font-bold text-slate-800"
                              value={tempCategoryName}
                              onChange={(e) => setTempCategoryName(e.target.value)}
                              autoFocus
                           />
                           <button onClick={() => saveCategoryName(idx)} className="p-2 bg-green-100 text-green-700 rounded-lg">
                              <Check size={16} />
                           </button>
                         </>
                       ) : (
                         <>
                           <span className="flex-1 font-medium text-slate-700">{cat}</span>
                           <span className="text-xs text-slate-400 mr-2">
                             ({items.filter(i => i.category === cat).length})
                           </span>
                           <button onClick={() => startEditingCategory(idx)} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-slate-50 rounded-lg">
                              <Edit2 size={16} />
                           </button>
                           <button onClick={() => handleDeleteCategory(cat)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-slate-50 rounded-lg">
                              <Trash2 size={16} />
                           </button>
                         </>
                       )}
                    </div>
                  ))}
               </div>
            </div>
            
            <div className="p-4 border-t border-slate-100">
               <button onClick={() => setIsManagingCategories(false)} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl">
                 Listo
               </button>
            </div>
         </div>
      </div>
    );
  }

  // --- RENDER MAIN LIST ---
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto h-full flex flex-col relative">
      
      {/* 1. PROCESS BANNER (Logic Explanation) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4 items-center w-full md:w-auto">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-900 font-bold flex items-center justify-center border border-slate-300">1</div>
                <span className="text-sm font-bold text-slate-700">Edita</span>
             </div>
             <div className="h-0.5 w-8 bg-slate-200"></div>
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-600 font-bold flex items-center justify-center border border-brand-200">2</div>
                <span className="text-sm font-bold text-brand-600">Simula</span>
             </div>
             <div className="h-0.5 w-8 bg-slate-200"></div>
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-900 font-bold flex items-center justify-center border border-slate-300">3</div>
                <span className="text-sm font-bold text-slate-700">Comparte</span>
             </div>
          </div>
          <button 
             onClick={() => setShowPreview(true)}
             className="w-full md:w-auto bg-brand-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-brand-200 hover:bg-brand-700 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
             <Smartphone size={20} />
             Probar como Cliente
          </button>
      </div>


      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Menú Digital</h2>
          <p className="text-sm text-slate-500">Agrega productos, edita precios y comparte.</p>
        </div>
        <div className="flex gap-2">
            <button 
              onClick={() => setShowShareModal(true)}
              className="p-3 bg-white text-slate-700 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors shadow-sm font-bold flex items-center gap-2"
            >
                <Share2 size={18} /> <span className="hidden md:inline">Compartir Link</span>
            </button>
        </div>
      </div>

      {/* Category Tabs & Settings */}
      <div className="flex items-center gap-2 mb-2">
          <button 
            onClick={() => setIsManagingCategories(true)}
            className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 border border-slate-200 transition-colors shrink-0"
            title="Editar Categorías"
          >
             <Settings size={20} />
          </button>
          <div className="flex gap-2 overflow-x-auto pb-4 pt-1 no-scrollbar flex-1 mask-linear-fade">
            {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                      activeCategory === cat 
                      ? 'bg-slate-800 text-white shadow-md transform scale-105' 
                      : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                    {cat}
                </button>
            ))}
          </div>
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto pb-24">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {filteredItems.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                   <p>No hay productos en esta categoría.</p>
                </div>
             )}
             
             {filteredItems.map(item => (
                 <div key={item.id} className={`bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex gap-4 transition-opacity ${!item.isAvailable ? 'opacity-60' : ''}`}>
                     {/* Image Thumbnail */}
                     <div className="w-24 h-24 rounded-xl bg-slate-100 shrink-0 overflow-hidden relative">
                        {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                <ImageIcon size={24} />
                            </div>
                        )}
                        {!item.isAvailable && (
                            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-white uppercase bg-red-500 px-2 py-0.5 rounded">Agotado</span>
                            </div>
                        )}
                     </div>

                     {/* Content */}
                     <div className="flex-1 flex flex-col justify-between py-1">
                         <div>
                             <div className="flex justify-between items-start">
                                 <h3 className="font-bold text-slate-900 leading-tight">{item.name}</h3>
                                 <button onClick={() => toggleAvailability(item.id)} className={`text-xs px-2 py-0.5 rounded-md font-bold ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                     {item.isAvailable ? 'ON' : 'OFF'}
                                 </button>
                             </div>
                             <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                         </div>
                         
                         <div className="flex justify-between items-end mt-2">
                             <span className="font-bold text-lg text-slate-800">${item.price}</span>
                             <button 
                                onClick={() => handleEditItem(item)}
                                className="bg-slate-100 p-2 rounded-lg text-slate-600 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                             >
                                 <Edit2 size={16} />
                             </button>
                         </div>
                     </div>
                 </div>
             ))}

             {/* Add Button (Inline) */}
             <button 
               onClick={handleAddItem}
               className="min-h-[120px] rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 bg-slate-50 hover:bg-white hover:border-brand-400 hover:text-brand-500 transition-all active:scale-95"
             >
                 <div className="bg-white p-2 rounded-full shadow-sm mb-2">
                     <Plus size={24} />
                 </div>
                 <span className="font-bold text-sm">Agregar Producto</span>
             </button>
         </div>
      </div>

      {/* Floating Action Button (Mobile) */}
      <div className="md:hidden fixed bottom-20 right-4">
          <button 
            onClick={handleAddItem}
            className="w-14 h-14 bg-brand-600 text-white rounded-full shadow-xl shadow-brand-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          >
              <Plus size={28} />
          </button>
      </div>

      {/* --- PREVIEW MODAL (THE CUSTOMER SIMULATOR) --- */}
      {showPreview && (
          <CustomerMenuPreview 
            items={items} 
            categories={categories} 
            onClose={() => setShowPreview(false)} 
          />
      )}

      {/* SHARE MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-in slide-in-from-bottom-10">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-xl text-slate-800">Compartir Menú</h3>
                 <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-slate-100 rounded-full">
                    <X size={20} className="text-slate-500"/>
                 </button>
              </div>

              <div className="space-y-3">
                 <button 
                    onClick={() => handleShareOption('mass')}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-purple-200 hover:shadow-purple-300 transition-all group active:scale-95"
                 >
                     <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                        <Megaphone size={24} />
                     </div>
                     <div className="text-left">
                        <p className="font-bold">Enviar a Todos</p>
                        <p className="text-xs opacity-90">Campaña masiva a tu base</p>
                     </div>
                 </button>

                 <button 
                    onClick={() => handleShareOption('whatsapp')}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#25D366] text-white shadow-lg shadow-green-200 hover:shadow-green-300 transition-all group active:scale-95"
                 >
                     <div className="bg-white/20 p-3 rounded-xl group-hover:scale-110 transition-transform">
                        <MessageCircle size={24} />
                     </div>
                     <div className="text-left">
                        <p className="font-bold">WhatsApp Directo</p>
                        <p className="text-xs opacity-90">Enviar a un contacto</p>
                     </div>
                 </button>

                 <div className="flex items-center gap-2 p-3 rounded-2xl border border-slate-200 bg-slate-50 mt-4">
                     <span className="text-xs font-mono text-slate-500 truncate flex-1 px-2">
                        https://cuponera.pro/tacos-el-primo
                     </span>
                     <button 
                        onClick={() => handleShareOption('copy')}
                        className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-brand-600 hover:border-brand-200 font-bold text-xs flex items-center gap-1 active:scale-95 transition-all"
                        id="copy-btn"
                     >
                        <Copy size={14} /> Copiar
                     </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
