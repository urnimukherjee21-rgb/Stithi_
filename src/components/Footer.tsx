import { Globe, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenShareModal: () => void;
}

export default function Footer({ onOpenShareModal }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      id="main-app-footer"
      className="w-full bg-[#0e0e0e] border-t border-[#5a403c]/30 py-12 md:py-16"
    >
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start pb-8 border-b border-[#5a403c]/20">
          <div className="md:col-span-5 flex flex-col gap-2">
            <span className="font-editorial text-2xl text-[#e5e2e1]">
              स्<span className="font-black text-[#ac012c]">ti</span>थि
            </span>
            <span className="font-mono-archive text-[10px] text-[#aa8984] uppercase tracking-widest">
              Dark Surrealist Monograph & Archival Studies
            </span>
            <p className="text-xs text-[#e3beb8]/80 mt-1 max-w-sm font-body leading-relaxed">
              Spatial silence, chiaroscuro inquiries, and sacred stillness across multidisciplinary fine art and conceptual archives by Urni Mukherjee.
            </p>
          </div>

          <div className="md:col-span-4 flex flex-col gap-2">
            <span className="font-mono-archive text-[10px] text-[#ffb4a8] uppercase tracking-widest">
              Curatorial & Inquiries
            </span>
            <a 
              href="mailto:urnimukherjee21@gmail.com" 
              className="text-sm font-editorial text-[#e5e2e1] hover:text-[#ffb4a8] transition-colors"
            >
              urnimukherjee21@gmail.com
            </a>
            <span className="font-mono-archive text-[11px] text-[#aa8984]">
              Studio: Kolkata, India // Worldwide Collector Dispatch
            </span>
          </div>

          <div className="md:col-span-3 flex flex-col gap-2 md:items-end">
            <span className="font-mono-archive text-[10px] text-[#ffb4a8] uppercase tracking-widest">
              Site & Protocol
            </span>
            <button
              onClick={onOpenShareModal}
              className="text-xs font-mono-archive text-[#ffb4a8] hover:text-[#ffdad4] transition-colors flex items-center gap-1.5 cursor-pointer py-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Public Share Link</span>
            </button>
            <button
              onClick={scrollToTop}
              className="text-xs font-mono-archive text-[#aa8984] hover:text-[#e5e2e1] transition-colors flex items-center gap-1 cursor-pointer py-1"
            >
              <span>Return to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-mono-archive text-[11px] text-[#aa8984] uppercase">
            © {new Date().getFullYear()} Urni Mukherjee. All Rights Reserved.
          </span>
          <span className="font-mono-archive text-[10px] text-[#aa8984]/60 uppercase tracking-widest">
            Archival Specimen // Edition Stithi 01
          </span>
        </div>
      </div>
    </footer>
  );
}
