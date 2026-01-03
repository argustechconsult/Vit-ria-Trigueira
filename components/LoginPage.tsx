
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ChevronLeft, Crown } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin();
      navigate('/admin');
    } else {
      alert('Credenciais incorretas. Use admin / admin.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF8FF] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-100/40 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl p-8 sm:p-12 border-4 border-purple-50 relative">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-purple-600 transition-colors mb-8 font-bold text-xs uppercase tracking-widest group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Início
        </Link>
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-purple-900 text-gold rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-100">
            <Crown size={40} />
          </div>
          <h2 className="text-3xl font-black text-purple-950 tracking-tighter uppercase">Painel Studio</h2>
          <p className="text-slate-500 mt-2 font-medium">Gestão Profissional Vitória Trigueira</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-purple-300 uppercase tracking-widest ml-1">Usuário</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-purple-200" size={20} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-purple-50 border-2 border-purple-100 rounded-2xl py-4 pl-14 pr-5 text-purple-900 focus:outline-none focus:border-purple-900 font-bold transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-purple-300 uppercase tracking-widest ml-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-purple-200" size={20} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-purple-50 border-2 border-purple-100 rounded-2xl py-4 pl-14 pr-5 text-purple-900 focus:outline-none focus:border-purple-900 font-bold transition-all"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-purple-900 text-gold py-5 rounded-2xl font-black text-lg hover:bg-purple-800 transition-all shadow-xl shadow-purple-100 active:scale-95 mt-4 uppercase tracking-widest"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
