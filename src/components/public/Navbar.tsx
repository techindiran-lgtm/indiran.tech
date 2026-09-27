import { useState, useEffect } from 'react';
import { Menu, X, Phone, MessageCircle, Settings, ChevronDown } from 'lucide-react';
import type { Settings as SettingsType } from '@/lib/types';

interface NavbarProps {
  settings: SettingsType | null;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Navbar({ settings, onNavigate, currentPage }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'services', label: 'Services' },
    { key: 'about', label: 'About' },
    { key: 'contact', label: 'Contact' },
  ];

  const handleNav = (page: string) => {
    onNavigate(page);
    setOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-soft border-b border-slate-200/60'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <button onClick={() => handleNav('home')} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 flex items-center justify-center shadow-glow-primary group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-extrabold text-xl">A</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-accent-500 border-2 border-white" />
            </div>
            <div className="text-left">
              <p className="font-extrabold text-slate-900 leading-tight text-base">{settings?.business_name ?? 'AAR'}</p>
              <p className="text-[11px] text-slate-500 font-tamil leading-tight">
                {settings?.tamil_name ?? 'AAR பத்திரம் எழுதும் அலுவலகம்'}
              </p>
            </div>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-100/60 backdrop-blur-sm">
            {navItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleNav(item.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === item.key
                    ? 'text-primary-700 bg-white shadow-soft'
                    : 'text-slate-600 hover:text-primary-700 hover:bg-white/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            {settings?.phone && (
              <a
                href={`tel:${settings.phone}`}
                className="btn-secondary !px-3.5 !py-2"
                title="Call us"
              >
                <Phone className="w-4 h-4" />
                <span className="text-xs">Call</span>
              </a>
            )}
            {settings?.whatsapp && (
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-success !px-3.5 !py-2"
                title="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">WhatsApp</span>
              </a>
            )}
            <button
              onClick={() => handleNav('admin')}
              className="w-9 h-9 rounded-xl text-slate-500 hover:text-primary-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
              title="Admin Panel"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 animate-slide-down">
            <div className="flex flex-col gap-1 p-2 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-card">
              {navItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => handleNav(item.key)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium text-left transition-colors ${
                    currentPage === item.key
                      ? 'text-primary-700 bg-primary-50'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="flex gap-2 mt-2 px-1">
                {settings?.phone && (
                  <a href={`tel:${settings.phone}`} className="btn-secondary flex-1 !py-2.5">
                    <Phone className="w-4 h-4" /> Call
                  </a>
                )}
                {settings?.whatsapp && (
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-success flex-1 !py-2.5"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                )}
              </div>
              <button
                onClick={() => handleNav('admin')}
                className="px-4 py-3 rounded-xl text-sm font-medium text-left text-slate-500 hover:bg-slate-50 flex items-center gap-2 transition-colors"
              >
                <Settings className="w-4 h-4" /> Admin Panel
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
