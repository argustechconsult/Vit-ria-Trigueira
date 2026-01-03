
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, Menu, X as CloseIcon, Scissors, Star, Heart, Instagram, Phone, Crown, Sparkles, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Appointment, GlobalSettings } from '../types';
import { generateConfirmationMessage } from '../services/geminiService';

interface LandingPageProps {
  onBookingComplete: (client: { name: string, email: string, phone: string }, appointment: { date: string, time: string }) => Appointment;
  settings: GlobalSettings;
  appointments: Appointment[];
}

const LandingPage: React.FC<LandingPageProps> = ({ onBookingComplete, settings, appointments }) => {
  const [showBooking, setShowBooking] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientInfo, setClientInfo] = useState({ name: '', email: '', phone: '' });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const galleryImages = [
    { url: 'https://images.unsplash.com/photo-1643185539104-3622eb1f0ff6?q=80&w=800', title: 'Nagô Waves' },
    { url: 'https://images.unsplash.com/photo-1595476108010-b4d1f8c2b1b1?q=80&w=800', title: 'Box Braids Gold' },
    { url: 'https://images.unsplash.com/photo-1620331311520-246422ff82f9?q=80&w=800', title: 'Gypsy Braids' },
    { url: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?q=80&w=800', title: 'Fulani Braids' },
    { url: 'https://images.unsplash.com/photo-1584297115890-50b55502f928?q=80&w=800', title: 'Goddess Locs' },
    { url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=800', title: 'Nagô Masculina' }
  ];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  // Auto-scroll logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // Check if we are near the end
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scroll('right');
        }
      }
    }, 4000); // Slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const getBrazilDateTime = () => {
    return new Date(new Date().toLocaleString("en-US", { timeZone: "America/Sao_Paulo" }));
  };

  const todayStr = useMemo(() => {
    const brDate = getBrazilDateTime();
    const year = brDate.getFullYear();
    const month = String(brDate.getMonth() + 1).padStart(2, '0');
    const day = String(brDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const timeSlots = ['08:00', '13:00', '14:00'];

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return [];
    const brNow = getBrazilDateTime();
    const currentHour = brNow.getHours();
    return timeSlots.filter(time => {
      if (selectedDate === todayStr) {
        const [hour] = time.split(':').map(Number);
        if (hour < currentHour) return false;
      }
      return !appointments.some(app => app.date === selectedDate && app.time === time && app.status !== 'cancelled');
    });
  }, [selectedDate, todayStr, appointments]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(targetId.replace('#', ''));
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      onBookingComplete(clientInfo, { date: selectedDate, time: selectedTime });
      await generateConfirmationMessage(clientInfo.name, selectedDate, selectedTime, '');
      await new Promise(resolve => setTimeout(resolve, 1500));
      setBookingStep(3);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF8FF] font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-purple-900 rounded-full flex items-center justify-center text-gold shadow-lg group-hover:scale-110 transition-transform">
              <div className="text-gold">
                <Crown size={24} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-purple-900 leading-none">Trigueira</span>
              <span className="text-[10px] text-gold font-bold tracking-[0.2em] uppercase">Studio Braids</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#inicio" onClick={(e) => handleNavClick(e, '#inicio')} className="text-purple-900/70 hover:text-purple-900 font-bold transition-colors">Início</a>
            <a href="#galeria" onClick={(e) => handleNavClick(e, '#galeria')} className="text-purple-900/70 hover:text-purple-900 font-bold transition-colors">Galeria</a>
            <a href="#servicos" onClick={(e) => handleNavClick(e, '#servicos')} className="text-purple-900/70 hover:text-purple-900 font-bold transition-colors">Serviços</a>
            <Link to="/login" className="text-purple-400 hover:text-purple-600 font-bold text-sm">Painel</Link>
            <button onClick={() => setShowBooking(true)} className="btn-attention bg-purple-900 text-gold px-6 py-2.5 rounded-full font-black shadow-lg hover:bg-purple-800 transition-all uppercase text-xs tracking-widest">
              Agendar Coroa
            </button>
          </div>
          <button className="md:hidden p-2 text-purple-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <CloseIcon size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-purple-50 p-6 space-y-4 animate-fade-in shadow-xl">
            <a href="#inicio" onClick={(e) => handleNavClick(e, '#inicio')} className="block py-2 text-purple-900 font-bold">Início</a>
            <a href="#galeria" onClick={(e) => handleNavClick(e, '#galeria')} className="block py-2 text-purple-900 font-bold">Galeria</a>
            <a href="#servicos" onClick={(e) => handleNavClick(e, '#servicos')} className="block py-2 text-purple-900 font-bold">Serviços</a>
            <button onClick={() => { setShowBooking(true); setIsMenuOpen(false); }} className="w-full bg-purple-900 text-gold py-4 rounded-full font-black uppercase tracking-widest text-xs">Agendar Agora</button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section id="inicio" className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-purple-900/5 -z-10 rounded-l-[10rem]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-900 text-xs font-black uppercase tracking-widest">
                <Sparkles size={14} className="text-gold" /> Studio Trigueira Braids
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-purple-950 leading-[0.9] tracking-tighter">
                Sua beleza <br /> <span className="text-purple-700">merece ser</span> <br /> <span className="italic text-gold">coroada</span>.
              </h1>
              <p className="text-xl text-purple-900/60 leading-relaxed max-w-lg">
                Vitória Trigueira traz a arte das tranças afro com um toque de realeza. Técnicas exclusivas, cuidado com a saúde capilar e o visual que você sempre sonhou.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => setShowBooking(true)} className="bg-purple-900 text-gold px-10 py-5 rounded-full font-black text-lg hover:bg-purple-800 shadow-2xl shadow-purple-200 transition-all uppercase tracking-widest">
                  Marcar Horário
                </button>
                <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-full border border-purple-100 shadow-sm">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-300">WhatsApp</p>
                    <p className="font-bold text-purple-900">21 96457-8564</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-gold/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
              <img src="https://images.unsplash.com/photo-1643185539104-3622eb1f0ff6?auto=format&fit=crop&q=80&w=800" alt="Braids" className="rounded-[3rem] shadow-2xl border-8 border-white object-cover aspect-[4/5] transform hover:rotate-2 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Carousel */}
      <section id="galeria" className="py-24 bg-purple-50 scroll-mt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div className="space-y-4">
              <span className="text-gold font-black uppercase tracking-widest text-xs flex items-center gap-2">
                <Sparkles size={16} /> Portfólio Real
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-purple-950 tracking-tighter">Galeria de <span className="text-purple-600">Rainhas</span></h2>
            </div>
            <div className="hidden md:flex gap-4">
              <button onClick={() => scroll('left')} className="w-12 h-12 rounded-full border-2 border-purple-200 flex items-center justify-center text-purple-900 hover:bg-purple-900 hover:text-gold transition-all">
                <ChevronLeft size={24} />
              </button>
              <button onClick={() => scroll('right')} className="w-12 h-12 rounded-full border-2 border-purple-200 flex items-center justify-center text-purple-900 hover:bg-purple-900 hover:text-gold transition-all">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
          
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 custom-scrollbar scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {galleryImages.map((img, idx) => (
              <div 
                key={idx} 
                className="min-w-[300px] md:min-w-[400px] aspect-[4/5] snap-center relative rounded-[2.5rem] overflow-hidden group shadow-xl border-4 border-white"
              >
                <img 
                  src={img.url} 
                  alt={img.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                  <div className="text-white">
                    <p className="text-gold font-black uppercase tracking-widest text-[10px] mb-1">Studio Trigueira Braids</p>
                    <h3 className="text-xl font-bold">{img.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-center md:hidden gap-4">
            <button onClick={() => scroll('left')} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-purple-900">
              <ChevronLeft size={20} />
            </button>
            <button onClick={() => scroll('right')} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-purple-900">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="servicos" className="py-24 bg-white scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-purple-950 mb-16 tracking-tighter">Estilos que <span className="text-gold">Empoderam</span></h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Star />, title: 'Box Braids', desc: 'Versatilidade e estilo que dura. O clássico que nunca sai de moda.' },
              { icon: <Scissors />, title: 'Nagô Artística', desc: 'Tranças rasteiras com desenhos exclusivos e design personalizado.' },
              { icon: <Heart />, title: 'Twist & Crochet', desc: 'Volume, leveza e um acabamento natural e impecável.' }
            ].map((s, i) => (
              <div key={i} className="p-10 rounded-[3rem] bg-purple-50 border border-purple-100 hover:shadow-2xl transition-all group">
                <div className="w-16 h-16 bg-purple-900 text-gold rounded-2xl flex items-center justify-center mb-8 mx-auto group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
                <h3 className="text-2xl font-black text-purple-900 mb-4 uppercase tracking-tight">{s.title}</h3>
                <p className="text-purple-900/60 font-medium">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-950 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12 items-center text-center md:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center text-purple-950">
                <Crown size={28} />
              </div>
              <h3 className="text-2xl font-black tracking-tighter">Trigueira Braids</h3>
            </div>
            <p className="text-purple-200/50 text-sm">Transformando fios em coroas de autoestima e ancestralidade no Rio de Janeiro.</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <p className="text-gold font-black uppercase tracking-widest text-xs">Siga no Instagram</p>
            <a href="https://instagram.com/trigueirabraids" target="_blank" className="flex items-center gap-2 text-2xl font-bold hover:text-gold transition-colors">
              <Instagram /> @trigueirabraids
            </a>
          </div>
          <div className="flex flex-col items-center md:items-end gap-2 text-sm text-purple-200/50">
            <p className="flex items-center gap-2"><MapPin size={16} /> Rio de Janeiro, RJ</p>
            <p className="flex items-center gap-2"><Phone size={16} /> 21 96457-8564</p>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-purple-950/80 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden relative animate-scale-up border-4 border-purple-100">
            <button onClick={() => setShowBooking(false)} className="absolute top-6 right-6 text-purple-300 hover:text-purple-900 z-10 p-2 hover:bg-purple-50 rounded-full transition-colors font-bold">✕</button>
            <div className="bg-purple-900 p-10 text-gold text-center">
              <Crown size={40} className="mx-auto mb-4" />
              <h3 className="text-3xl font-black tracking-tighter uppercase">Agendamento Real</h3>
              <p className="text-purple-200 text-xs font-bold uppercase tracking-widest mt-2">Reserve sua vaga com Vitória Trigueira</p>
            </div>
            <div className="p-10">
              {isProcessing ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-6">
                  <div className="w-16 h-16 border-4 border-gold/20 border-t-purple-900 rounded-full animate-spin"></div>
                  <p className="text-lg font-black text-purple-900 uppercase tracking-widest">Processando...</p>
                </div>
              ) : (
                <>
                  {bookingStep === 1 && (
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <label className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={18} /> Data da Sessão</label>
                        <input type="date" min={todayStr} className="w-full bg-purple-50 border-2 border-purple-100 rounded-2xl py-4 px-6 outline-none font-bold text-purple-900 focus:border-purple-900 transition-colors" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(''); }} />
                      </div>
                      {selectedDate && (
                        <div className="space-y-4">
                          <label className="text-xs font-black text-purple-400 uppercase tracking-widest flex items-center gap-2"><Clock size={18} /> Horários Disponíveis</label>
                          <div className="grid grid-cols-3 gap-3">
                            {availableTimeSlots.map(time => (
                              <button key={time} onClick={() => setSelectedTime(time)} className={`py-4 px-2 rounded-2xl border-2 font-black text-xs transition-all ${selectedTime === time ? 'bg-purple-900 border-purple-900 text-gold shadow-lg shadow-purple-200' : 'bg-white border-purple-100 text-purple-400 hover:border-purple-300'}`}>{time}</button>
                            ))}
                          </div>
                        </div>
                      )}
                      <button disabled={!selectedDate || !selectedTime} onClick={() => setBookingStep(2)} className="w-full bg-purple-900 text-gold py-5 rounded-2xl font-black uppercase tracking-widest disabled:opacity-20 shadow-xl shadow-purple-100 transition-all active:scale-95">Próximo Passo</button>
                    </div>
                  )}
                  {bookingStep === 2 && (
                    <form onSubmit={handleBookingSubmit} className="space-y-6">
                      <div className="bg-purple-50 p-6 rounded-2xl border-2 border-purple-100 text-purple-900 font-black text-sm uppercase text-center">
                        {new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')} às {selectedTime}
                      </div>
                      <div className="space-y-4">
                        <input type="text" required className="w-full bg-purple-50 border-2 border-purple-100 rounded-2xl py-4 px-6 font-bold outline-none focus:border-purple-900" placeholder="Nome da Rainha" value={clientInfo.name} onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})} />
                        <input type="tel" required className="w-full bg-purple-50 border-2 border-purple-100 rounded-2xl py-4 px-6 font-bold outline-none focus:border-purple-900" placeholder="WhatsApp (DDD)" value={clientInfo.phone} onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})} />
                        <input type="email" required className="w-full bg-purple-50 border-2 border-purple-100 rounded-2xl py-4 px-6 font-bold outline-none focus:border-purple-900" placeholder="Seu Email" value={clientInfo.email} onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})} />
                      </div>
                      <div className="flex gap-4">
                        <button type="button" onClick={() => setBookingStep(1)} className="flex-1 bg-slate-100 py-4 rounded-2xl font-black uppercase text-xs text-slate-500">Voltar</button>
                        <button type="submit" className="flex-[2] bg-purple-900 text-gold py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-purple-100">Confirmar</button>
                      </div>
                    </form>
                  )}
                  {bookingStep === 3 && (
                    <div className="text-center space-y-8 py-4">
                      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce"><CheckCircle size={56} /></div>
                      <h3 className="text-3xl font-black text-purple-950 uppercase tracking-tighter">Coroa Agendada!</h3>
                      <p className="text-purple-900/60 font-medium">Aguardamos você no Studio Trigueira Braids. Você receberá uma confirmação em breve.</p>
                      <button onClick={() => setShowBooking(false)} className="w-full bg-purple-900 text-gold py-5 rounded-2xl font-black uppercase tracking-widest">Fechar</button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
