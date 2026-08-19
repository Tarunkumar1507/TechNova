import React from 'react';
import { LayoutDashboard, ShoppingBag, ClipboardList, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'products', name: 'Products', icon: ShoppingBag },
    { id: 'orders', name: 'Orders', icon: ClipboardList },
  ];

  return (
    <aside className="w-full md:w-64 glass-panel flex-shrink-0 md:min-h-[calc(100vh-4rem)] md:border-r border-slate-800 p-6 flex flex-col justify-between">
      <div className="space-y-6">
        <div>
          <h2 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-4">
            Management Panel
          </h2>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-400 border-l-2 border-sky-500 pl-3.5'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-900 mt-6 md:mt-0">
        <Link
          to="/"
          className="flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Exit to Storefront</span>
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
