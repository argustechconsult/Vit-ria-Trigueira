
import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, DollarSign, Columns, LogOut, Menu, X, Crown } from 'lucide-react';

interface AdminLayoutProps {
  onLogout: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogoutClick = () => {
    onLogout();
    navigate('/');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-purple-950 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-purple-950">
              <Crown size={24} />
            </div>
            <div>
              <h1 className="text-lg font-black text-white leading-none">Trigueira</h1>
              <p className="text-[8px] text-gold uppercase tracking-[0.2em] font-black mt-1">Gestão Studio</p>
            </div>
          </div>
          <button onClick={closeSidebar} className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <NavLink to="/admin" end onClick={closeSidebar} className={({ isActive }) => `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-semibold ${isActive ? 'bg-purple-800 text-white shadow-lg' : 'text-purple-300 hover:bg-white/5 hover:text-white'}`}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/admin/clients" onClick={closeSidebar} className={({ isActive }) => `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-semibold ${isActive ? 'bg-purple-800 text-white shadow-lg' : 'text-purple-300 hover:bg-white/5 hover:text-white'}`}>
            <Users size={20} /> Clientes
          </NavLink>
          <NavLink to="/admin/schedule" onClick={closeSidebar} className={({ isActive }) => `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-semibold ${isActive ? 'bg-purple-800 text-white shadow-lg' : 'text-purple-300 hover:bg-white/5 hover:text-white'}`}>
            <Calendar size={20} /> Agenda
          </NavLink>
          <NavLink to="/admin/tasks" onClick={closeSidebar} className={({ isActive }) => `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-semibold ${isActive ? 'bg-purple-800 text-white shadow-lg' : 'text-purple-300 hover:bg-white/5 hover:text-white'}`}>
            <Columns size={20} /> Tarefas
          </NavLink>
          <NavLink to="/admin/finance" onClick={closeSidebar} className={({ isActive }) => `flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all font-semibold ${isActive ? 'bg-purple-800 text-white shadow-lg' : 'text-purple-300 hover:bg-white/5 hover:text-white'}`}>
            <DollarSign size={20} /> Financeiro
          </NavLink>
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={handleLogoutClick} className="w-full flex items-center justify-center gap-3 px-5 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all font-bold border border-red-500/20">
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSidebar}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
              aria-label="Alternar menu"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800 truncate">Painel Vitória Trigueira</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">Vitória Trigueira</p>
              <p className="text-[10px] text-purple-600 font-bold uppercase tracking-wider">Trancista & CEO</p>
            </div>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 border-2 border-purple-500 shadow-md">
              <Crown size={24} />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50 custom-scrollbar">
          <div className="p-4 sm:p-8 max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
