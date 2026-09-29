import { Phone, MessageCircle, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { trackCallClick, trackWhatsAppClick } from '@/components/shared/SEO';

interface MobileStickyBarProps {
  phone?: string;
  whatsapp?: string;
  onBookAppointment: () => void;
}

export function MobileStickyBar({ phone, whatsapp, onBookAppointment }: MobileStickyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Guard for browser-only code
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCallClick = () => {
    if (phone) trackCallClick(phone);
  };

  const handleWhatsAppClick = () => {
    if (whatsapp) trackWhatsAppClick(whatsapp);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-slate-200 shadow-lg px-4 py-3 safe-area-bottom">
      <div className="flex items-center justify-between gap-3">
        {phone && (
          <a
            href={`tel:${phone}`}
            onClick={handleCallClick}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-600 text-white font-semibold text-sm min-h-[44px]"
          >
            <Phone className="w-4 h-4" />
            Call
          </a>
        )}
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Hi, I need help with document services`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-accent-600 text-white font-semibold text-sm min-h-[44px]"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        )}
        <button
          onClick={onBookAppointment}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-secondary-600 text-white font-semibold text-sm min-h-[44px]"
        >
          <Calendar className="w-4 h-4" />
          Book
        </button>
      </div>
    </div>
  );
}
