import React from 'react';
import { MOCK_ORDERS } from '../../constants';
import { Clock } from 'lucide-react';

const Orders: React.FC = () => {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Historial de Pedidos</h2>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 hidden md:table-header-group">
            <tr>
                <th className="p-4 text-sm font-semibold text-slate-500">ID</th>
                <th className="p-4 text-sm font-semibold text-slate-500">Cliente</th>
                <th className="p-4 text-sm font-semibold text-slate-500">Items</th>
                <th className="p-4 text-sm font-semibold text-slate-500">Total</th>
                <th className="p-4 text-sm font-semibold text-slate-500">Estado</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
            {MOCK_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 flex flex-col md:table-row p-4 md:p-0">
                    <td className="p-2 md:p-4 text-slate-900 font-mono text-sm md:table-cell flex justify-between">
                        <span className="md:hidden font-bold text-slate-500">ID:</span>
                        #{order.id}
                    </td>
                    <td className="p-2 md:p-4 font-medium text-slate-900 md:table-cell flex justify-between">
                         <span className="md:hidden font-bold text-slate-500">Cliente:</span>
                        {order.clientName}
                    </td>
                    <td className="p-2 md:p-4 text-slate-600 text-sm md:table-cell">
                        <span className="md:hidden font-bold text-slate-500 block mb-1">Items:</span>
                        {order.items.join(', ')}
                    </td>
                    <td className="p-2 md:p-4 font-bold text-slate-900 md:table-cell flex justify-between">
                        <span className="md:hidden font-bold text-slate-500">Total:</span>
                        ${order.total}
                    </td>
                    <td className="p-2 md:p-4 md:table-cell flex justify-between items-center">
                        <span className="md:hidden font-bold text-slate-500">Estado:</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                            order.status === 'READY' || order.status === 'DELIVERED' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-orange-100 text-orange-700'
                        }`}>
                            {order.status === 'PREPARING' && <Clock size={12} />}
                            {order.status}
                        </span>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;