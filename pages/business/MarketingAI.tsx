
import React, { useState } from 'react';
import { generateDailyStrategy, MarketingContext } from '../../services/geminiService';
import { 
  Sparkles, 
  Copy, 
  RefreshCw, 
  Calendar, 
  CheckCircle, 
  Play, 
  ArrowRight,
  Zap,
  Users,
  Camera,
  Megaphone,
  Heart,
  Clock,
  MessageSquare,
  Settings,
  BrainCircuit,
  X,
  Image as ImageIcon,
  Upload,
  Tags,
  Wand2,
  Trash2
} from 'lucide-react';

interface WeeklyTask {
  day: string;
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  isDone: boolean;
  strategyPrompt: string;
}

interface BrandAsset {
    id: string;
    url: string;
    description: string; // Context for AI
    tags: string[];
    isEnhanced: boolean; // Has been processed by AI
}

interface Props {
  onNavigate?: (view: string, params?: any) => void;
}

const WEEKLY_PLAN: WeeklyTask[] = [
  {
    id: 'mon',
    day: 'Lunes',
    title: 'Motivación & Menú',
    description: 'Arranca la semana mostrando tu mejor platillo o una frase inspiradora.',
    icon: Zap,
    color: 'bg-yellow-100 text-yellow-700',
    isDone: false,
    strategyPrompt: 'Motivar a los clientes para iniciar bien la semana y antojarlos del menú del día.'
  },
  {
    id: 'tue',
    day: 'Martes',
    title: 'Promo 2x1',
    description: 'Los martes suelen ser lentos. Lanza una oferta agresiva para atraer flujo.',
    icon: Megaphone,
    color: 'bg-red-100 text-red-700',
    isDone: false,
    strategyPrompt: 'Anunciar una promoción agresiva (tipo 2x1 o descuento) para levantar las ventas de un día lento.'
  },
  {
    id: 'wed',
    day: 'Miércoles',
    title: 'Producto Estrella',
    description: 'Educa al cliente. Explica por qué tu producto es especial (ingredientes, proceso).',
    icon: Camera,
    color: 'bg-blue-100 text-blue-700',
    isDone: false,
    strategyPrompt: 'Destacar un producto específico, describiendo sus ingredientes o calidad para generar deseo (Food Porn).'
  },
  {
    id: 'thu',
    day: 'Jueves',
    title: 'Interacción / TBT',
    description: 'Haz una pregunta a tus clientes o comparte un recuerdo del negocio.',
    icon: Users,
    color: 'bg-purple-100 text-purple-700',
    isDone: false,
    strategyPrompt: 'Generar interacción haciendo una pregunta divertida a los clientes o recordando algo nostálgico.'
  },
  {
    id: 'fri',
    day: 'Viernes',
    title: 'Agenda de Fin de Semana',
    description: 'Recuérdales reservar o hacer sus pedidos con tiempo para el finde.',
    icon: Calendar,
    color: 'bg-green-100 text-green-700',
    isDone: false,
    strategyPrompt: 'Crear sentido de urgencia para el fin de semana. Invitar a reservar mesa o pedir a domicilio.'
  },
  {
    id: 'sat',
    day: 'Sábado',
    title: 'Prueba Social',
    description: 'Comparte una foto de un cliente feliz o una reseña positiva.',
    icon: Heart,
    color: 'bg-pink-100 text-pink-700',
    isDone: false,
    strategyPrompt: 'Agradecer a los clientes por su preferencia y compartir una reseña positiva o foto de clientes felices.'
  }
];

const MOCK_ASSETS: BrandAsset[] = [
    {
        id: '1',
        url: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=300&q=80',
        description: 'Tacos al pastor con piña y cilantro, primer plano.',
        tags: ['tacos', 'comida', 'antojo'],
        isEnhanced: true
    },
    {
        id: '2',
        url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=300&q=80',
        description: 'Local lleno de gente cenando, ambiente cálido.',
        tags: ['ambiente', 'local', 'noche'],
        isEnhanced: false
    }
];

const MarketingAI: React.FC<Props> = ({ onNavigate }) => {
  const [tasks, setTasks] = useState(WEEKLY_PLAN);
  const [selectedDay, setSelectedDay] = useState<WeeklyTask | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  
  // Config Modal State
  const [showConfig, setShowConfig] = useState(false);
  const [configTab, setConfigTab] = useState<'info' | 'gallery'>('info');

  // Brand Context State
  const [context, setContext] = useState<MarketingContext>({
      businessName: 'Tacos El Primo',
      businessType: 'Restaurante Mexicano',
      topProducts: 'Tacos al Pastor, Gringas, Aguas Frescas',
      tone: 'Divertido y Cercano',
      targetAudience: 'Familias y jóvenes locales'
  });

  // Gallery State
  const [assets, setAssets] = useState<BrandAsset[]>(MOCK_ASSETS);
  const [enhancingId, setEnhancingId] = useState<string | null>(null);

  // Determine "Today" (Mocked for demo, defaulting to Monday or generic)
  const todayIndex = 0; // Monday
  const todayTask = tasks[todayIndex];

  const handleOpenTask = (task: WeeklyTask) => {
    setSelectedDay(task);
    setResult(''); // Clear previous
  };

  const handleGenerate = async () => {
    if (!selectedDay) return;
    setLoading(true);
    
    // Use the dynamic context instead of hardcoded strings
    const text = await generateDailyStrategy(context, selectedDay.day, selectedDay.strategyPrompt);
    
    setResult(text);
    setLoading(false);
  };

  const markAsDone = () => {
    if (!selectedDay) return;
    setTasks(tasks.map(t => t.id === selectedDay.id ? { ...t, isDone: true } : t));
    setSelectedDay(null);
  };

  const sendToMassMessages = () => {
      if (onNavigate && result) {
          onNavigate('mass_messages', {
              prefilledMessage: result,
              sourceCampaign: `Estrategia IA: ${selectedDay?.title}`
          });
      }
  };

  // --- GALLERY HANDLERS ---
  const handleEnhanceImage = (id: string) => {
      setEnhancingId(id);
      // Simulate AI processing time
      setTimeout(() => {
          setAssets(prev => prev.map(asset => {
              if (asset.id === id) {
                  return {
                      ...asset,
                      isEnhanced: true,
                      // Simulate AI finding new tags or improving description
                      tags: [...asset.tags, '✨ Mejorada', 'HD'],
                      description: asset.description + ' (Optimizado por IA para redes sociales)'
                  };
              }
              return asset;
          }));
          setEnhancingId(null);
      }, 2000);
  };

  const handleUploadSim = () => {
      const newAsset: BrandAsset = {
          id: Date.now().toString(),
          url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=300&q=80',
          description: 'Nueva foto subida (Pendiente de análisis)',
          tags: ['nuevo'],
          isEnhanced: false
      };
      setAssets([newAsset, ...assets]);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto h-full flex flex-col relative">
      
      {/* Header */}
      <div className="mb-6 flex justify-between items-start">
         <div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                <Sparkles className="text-violet-600" /> Tu Agencia Virtual
            </h2>
            <p className="text-slate-500">Marketing semanal impulsado por IA y adaptado a tu negocio.</p>
         </div>
         <button 
            onClick={() => setShowConfig(true)}
            className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-2 text-sm font-bold"
         >
             <BrainCircuit size={18} className="text-violet-600" />
             Configurar IA
         </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT: CALENDAR GRID */}
          <div className="flex-1 w-full space-y-4">
              
              {/* TODAY'S MISSION CARD */}
              <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-violet-200 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8 opacity-10 transform rotate-12 group-hover:rotate-0 transition-transform duration-500">
                      <todayTask.icon size={120} />
                  </div>
                  
                  <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                              Misión de Hoy: {todayTask.day}
                          </span>
                      </div>
                      <h3 className="text-3xl font-bold mb-2">{todayTask.title}</h3>
                      <p className="text-violet-100 mb-6 max-w-sm text-sm leading-relaxed">
                          {todayTask.description}
                      </p>
                      
                      <button 
                        onClick={() => handleOpenTask(todayTask)}
                        className="bg-white text-violet-700 font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-violet-50 active:scale-95 transition-all flex items-center gap-2"
                      >
                          <Play size={20} fill="currentColor" />
                          Ejecutar Misión Ahora
                      </button>
                  </div>
              </div>

              {/* WEEKLY GRID */}
              <div>
                  <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                      <Calendar size={18} /> Calendario Semanal
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {tasks.map((task) => (
                          <button
                            key={task.id}
                            onClick={() => handleOpenTask(task)}
                            className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
                                task.isDone 
                                ? 'bg-slate-50 border-slate-200 opacity-60' 
                                : 'bg-white border-slate-200 hover:border-violet-300 hover:shadow-md'
                            }`}
                          >
                              <div className="flex justify-between items-start mb-2">
                                  <div className={`p-2 rounded-lg ${task.color}`}>
                                      <task.icon size={20} />
                                  </div>
                                  {task.isDone && <CheckCircle className="text-green-500" size={20} />}
                              </div>
                              <h5 className="font-bold text-slate-800">{task.day}: {task.title}</h5>
                              <p className="text-xs text-slate-500 line-clamp-2 mt-1">{task.description}</p>
                          </button>
                      ))}
                  </div>
              </div>
          </div>

          {/* RIGHT: TASK EXECUTOR (Sticky) */}
          <div className="w-full lg:w-[400px] bg-white rounded-3xl border border-slate-200 shadow-xl sticky top-4 overflow-hidden flex flex-col min-h-[500px]">
              {selectedDay ? (
                  <div className="flex flex-col h-full animate-in slide-in-from-right">
                      {/* Header */}
                      <div className={`p-6 ${selectedDay.color.replace('text-', 'bg-').replace('100', '50')} border-b border-slate-100`}>
                          <div className="flex justify-between items-start mb-2">
                              <span className="text-xs font-bold uppercase opacity-60 tracking-wider">Estrategia del {selectedDay.day}</span>
                              <button onClick={() => setSelectedDay(null)} className="p-1 hover:bg-black/5 rounded-full"><Clock size={16}/></button>
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900 leading-tight">{selectedDay.title}</h3>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                          <div className="mb-6">
                              <p className="text-sm text-slate-600 font-medium mb-4">
                                  <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Instrucción:</span>
                                  {selectedDay.description}
                              </p>
                              
                              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 relative min-h-[160px]">
                                  {loading ? (
                                      <div className="absolute inset-0 flex flex-col items-center justify-center text-violet-600 gap-3">
                                          <RefreshCw className="animate-spin" size={32} />
                                          <p className="text-xs font-bold animate-pulse">Consultando a la IA...</p>
                                      </div>
                                  ) : result ? (
                                      <textarea 
                                        className="w-full h-full bg-transparent resize-none focus:outline-none text-slate-800 text-sm leading-relaxed"
                                        value={result}
                                        readOnly
                                      />
                                  ) : (
                                      <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center p-4">
                                          <Sparkles size={32} className="mb-2 opacity-50" />
                                          <p className="text-xs">Presiona generar para que la IA escriba el post basado en <strong>{context.businessName}</strong>.</p>
                                      </div>
                                  )}
                              </div>
                          </div>

                          <div className="mt-auto space-y-3">
                              {!result ? (
                                  <button 
                                    onClick={handleGenerate}
                                    className="w-full bg-violet-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-violet-200 hover:bg-violet-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                                  >
                                      <Sparkles size={20} /> Generar Contenido
                                  </button>
                              ) : (
                                  <div className="space-y-3">
                                      {/* PRIMARY ACTION: SEND BULK */}
                                      <button 
                                        onClick={sendToMassMessages}
                                        className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                                      >
                                          <MessageSquare size={20} /> 
                                          <span>Lanzar Campaña Masiva</span>
                                      </button>
                                      
                                      {/* SECONDARY ACTIONS */}
                                      <div className="flex gap-2">
                                        <button 
                                            onClick={() => navigator.clipboard.writeText(result)}
                                            className="flex-1 py-3 bg-white border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-2 text-sm"
                                        >
                                            <Copy size={16} /> Copiar
                                        </button>
                                        <button 
                                            onClick={markAsDone}
                                            className="flex-1 py-3 bg-green-50 text-green-700 border border-green-200 rounded-xl font-medium hover:bg-green-100 flex items-center justify-center gap-2 text-sm"
                                        >
                                            <CheckCircle size={16} /> Terminar
                                        </button>
                                      </div>
                                  </div>
                              )}
                          </div>
                      </div>
                  </div>
              ) : (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                          <ArrowRight size={32} />
                      </div>
                      <p className="font-medium">Selecciona un día del calendario para trabajar en tu marketing.</p>
                  </div>
              )}
          </div>
      </div>

      {/* --- CONFIG MODAL (BRAND BRAIN) --- */}
      {showConfig && (
        <div className="fixed inset-0 z-[60] bg-slate-900/60 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 flex flex-col max-h-[90vh]">
                
                {/* Modal Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-2">
                        <div className="bg-violet-100 p-2 rounded-lg text-violet-600">
                             <BrainCircuit size={20} />
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg">Entrenar a tu IA</h3>
                    </div>
                    <button onClick={() => setShowConfig(false)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100">
                    <button 
                        onClick={() => setConfigTab('info')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${configTab === 'info' ? 'border-violet-600 text-violet-700 bg-violet-50/50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                    >
                        Datos del Negocio
                    </button>
                    <button 
                        onClick={() => setConfigTab('gallery')}
                        className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${configTab === 'gallery' ? 'border-violet-600 text-violet-700 bg-violet-50/50' : 'border-transparent text-slate-500 hover:bg-slate-50'}`}
                    >
                        Galería Inteligente ✨
                    </button>
                </div>
                
                {/* Content Area */}
                <div className="p-6 overflow-y-auto flex-1">
                    
                    {/* TAB: INFO */}
                    {configTab === 'info' && (
                        <div className="space-y-5 animate-in fade-in">
                            <p className="text-sm text-slate-500 bg-violet-50 p-3 rounded-xl border border-violet-100">
                                Cuanta más información des, mejores serán las ideas. La IA usará esto para personalizar cada mensaje.
                            </p>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Nombre del Negocio</label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                    value={context.businessName}
                                    onChange={(e) => setContext({...context, businessName: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Giro / Categoría</label>
                                <input 
                                    type="text" 
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500"
                                    placeholder="Ej. Barbería clásica, Cafetería Vegana..."
                                    value={context.businessType}
                                    onChange={(e) => setContext({...context, businessType: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Productos Estrella</label>
                                <textarea 
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-violet-500 h-24 resize-none"
                                    placeholder="Ej. Tacos al pastor, Gringas, Horchata casera..."
                                    value={context.topProducts}
                                    onChange={(e) => setContext({...context, topProducts: e.target.value})}
                                />
                                <p className="text-[10px] text-slate-400 mt-1">Sepáralos por comas. La IA intentará vender esto.</p>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Público Objetivo</label>
                                    <input 
                                        type="text" 
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                                        placeholder="Ej. Estudiantes..."
                                        value={context.targetAudience}
                                        onChange={(e) => setContext({...context, targetAudience: e.target.value})}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Tono de Voz</label>
                                    <select 
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                                        value={context.tone}
                                        onChange={(e) => setContext({...context, tone: e.target.value})}
                                    >
                                        <option>Divertido y Cercano</option>
                                        <option>Formal y Profesional</option>
                                        <option>Urgente y Promocional</option>
                                        <option>Minimalista y Elegante</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: GALLERY */}
                    {configTab === 'gallery' && (
                        <div className="space-y-6 animate-in fade-in">
                            <div className="bg-gradient-to-r from-pink-50 to-violet-50 p-4 rounded-xl border border-pink-100">
                                <div className="flex gap-3">
                                    <div className="bg-white p-2 rounded-lg text-pink-600 shadow-sm h-fit">
                                        <Sparkles size={20} />
                                    </div>
                                    <div className="text-sm">
                                        <h4 className="font-bold text-slate-800">IA Vision</h4>
                                        <p className="text-slate-600">Sube fotos de tus productos. La IA las "verá", mejorará su calidad y entenderá el contexto para usarlas en tus campañas.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Upload Area */}
                            <div 
                                onClick={handleUploadSim}
                                className="border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-400 bg-slate-50 hover:bg-white hover:border-violet-400 hover:text-violet-500 transition-all cursor-pointer"
                            >
                                <Upload size={32} className="mb-2" />
                                <span className="font-bold text-sm">Subir Nueva Foto</span>
                                <span className="text-xs opacity-70">JPG, PNG</span>
                            </div>

                            {/* Asset Grid */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-slate-400 uppercase">Tus Activos ({assets.length})</h4>
                                {assets.map(asset => (
                                    <div key={asset.id} className="flex gap-4 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                        <div className="w-24 h-24 rounded-lg bg-slate-100 overflow-hidden shrink-0 relative group">
                                            <img src={asset.url} className="w-full h-full object-cover" alt="Asset" />
                                            {asset.isEnhanced && (
                                                <div className="absolute bottom-1 right-1 bg-violet-600 text-white p-1 rounded-full shadow-sm">
                                                    <Sparkles size={10} />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <p className="font-medium text-slate-800 text-sm truncate pr-2">{asset.description}</p>
                                                <button className="text-slate-300 hover:text-red-500"><Trash2 size={16}/></button>
                                            </div>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-1 my-2">
                                                {asset.tags.map(tag => (
                                                    <span key={tag} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium border border-slate-200">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* AI Action */}
                                            {!asset.isEnhanced ? (
                                                <button 
                                                    onClick={() => handleEnhanceImage(asset.id)}
                                                    className="text-xs flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-violet-600 transition-colors"
                                                    disabled={enhancingId === asset.id}
                                                >
                                                    {enhancingId === asset.id ? (
                                                        <>
                                                            <RefreshCw size={12} className="animate-spin" /> Mejorando...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Wand2 size={12} /> Mejorar con IA
                                                        </>
                                                    )}
                                                </button>
                                            ) : (
                                                <span className="text-[10px] font-bold text-violet-600 flex items-center gap-1 bg-violet-50 px-2 py-1 rounded w-fit">
                                                    <CheckCircle size={10} /> Optimizado
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {configTab === 'info' && (
                        <button 
                            onClick={() => setShowConfig(false)}
                            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-800 transition-all mt-4 sticky bottom-0"
                        >
                            Guardar Configuración
                        </button>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MarketingAI;
