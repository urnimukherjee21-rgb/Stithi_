import { useState } from 'react';
import { Share2, Mail, Menu, X, ExternalLink, Globe } from 'lucide-react';

interface HeaderProps {
  onOpenShareModal: () => void;
  onSelectArtwork?: (id: number) => void;
}

export default function Header({ onOpenShareModal }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      id="main-app-header"
      className="fixed top-0 w-full z-40 bg-[#0e0e0e]/90 backdrop-blur-xl border-b border-[#5a403c]/30"
    >
      <div className="h-20 w-full px-4 sm:px-8 md:px-12 lg:px-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <a 
            id="brand-logo-link"
            href="#hero" 
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('hero');
            }}
            className="flex items-baseline gap-1 group cursor-pointer"
          >
            <span className="font-editorial text-2xl tracking-widest text-[#e5e2e1] group-hover:text-[#ffb4a8] transition-colors">
              स्
            </span>
            <span className="font-editorial text-2xl text-[#ac012c] tracking-widest font-black">
              ti
            </span>
            <span className="font-editorial text-2xl tracking-widest text-[#e5e2e1] group-hover:text-[#ffb4a8] transition-colors">
              थि
            </span>
            <span className="ml-2 font-mono-archive text-[10px] text-[#aa8984] uppercase tracking-widest hidden sm:inline-block">
              // STITHI MONOGRAPH
            </span>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav 
          id="desktop-nav-menu"
          className="hidden lg:flex items-center gap-8 text-xs uppercase font-mono-archive tracking-wider text-[#e3beb8]"
        >
          <button 
            id="nav-link-works"
            onClick={() => scrollToSection('gallery')} 
            className="hover:text-[#ffb4a8] transition-colors cursor-pointer py-1 border-b border-transparent hover:border-[#ffb4a8]"
          >
            Selected Works
          </button>
          <button 
            id="nav-link-about"
            onClick={() => scrollToSection('about')} 
            className="hover:text-[#ffb4a8] transition-colors cursor-pointer py-1 border-b border-transparent hover:border-[#ffb4a8]"
          >
            About Urni
          </button>
          <button 
            id="nav-link-note"
            onClick={() => scrollToSection('artist-note')} 
            className="hover:text-[#ffb4a8] transition-colors cursor-pointer py-1 border-b border-transparent hover:border-[#ffb4a8]"
          >
            Artist Note
          </button>
          <button 
            id="nav-link-protocols"
            onClick={() => scrollToSection('protocols')} 
            className="hover:text-[#ffb4a8] transition-colors cursor-pointer py-1 border-b border-transparent hover:border-[#ffb4a8]"
          >
            Collector Codex
          </button>
          <button 
            id="nav-link-inquire"
            onClick={() => scrollToSection('inquire')} 
            className="hover:text-[#ffb4a8] transition-colors cursor-pointer py-1 border-b border-transparent hover:border-[#ffb4a8]"
          >
            Inquire
          </button>
        </nav>

        {/* Action Controls: Public Link & Contact */}
        <div className="flex items-center gap-3">
          {/* Public Link / Share Button */}
          <button
            id="header-public-link-btn"
            onClick={onOpenShareModal}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#8b0000]/25 hover:bg-[#8b0000]/50 border border-[#ac012c]/60 hover:border-[#ffb4a8] text-[#ffb4a8] font-mono-archive text-[11px] uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-sm"
            title="Make site public / copy shareable link"
          >
            <Globe className="w-3.5 h-3.5 text-[#ffb4a8] animate-pulse" />
            <span className="hidden sm:inline">Public Link</span>
            <Share2 className="w-3.5 h-3.5 opacity-80" />
          </button>

          {/* Curatorial Contact link */}
          <a
            id="header-curatorial-contact-btn"
            href="mailto:urnimukherjee21@gmail.com"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#5a403c]/70 hover:border-[#ac012c] hover:bg-[#8b0000] text-[#e5e2e1] hover:text-[#ffdad4] font-mono-archive text-[11px] uppercase tracking-widest transition-all duration-300"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Curatorial Contact</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#e5e2e1] hover:text-[#ffb4a8] bg-[#1c1b1b] border border-[#5a403c]/40 cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          id="mobile-nav-drawer"
          className="lg:hidden bg-[#131313] border-b border-[#5a403c]/40 px-6 py-5 flex flex-col gap-4"
        >
          <button 
            onClick={() => scrollToSection('gallery')} 
            className="text-left font-mono-archive text-xs uppercase tracking-widest text-[#e5e2e1] hover:text-[#ffb4a8] py-2 border-b border-[#5a403c]/20"
          >
            Selected Works (15 Plates)
          </button>
          <button 
            onClick={() => scrollToSection('about')} 
            className="text-left font-mono-archive text-xs uppercase tracking-widest text-[#e5e2e1] hover:text-[#ffb4a8] py-2 border-b border-[#5a403c]/20"
          >
            About Urni Mukherjee
          </button>
          <button 
            onClick={() => scrollToSection('artist-note')} 
            className="text-left font-mono-archive text-xs uppercase tracking-widest text-[#e5e2e1] hover:text-[#ffb4a8] py-2 border-b border-[#5a403c]/20"
          >
            Artist Note // Ritual of Stithi
          </button>
          <button 
            onClick={() => scrollToSection('protocols')} 
            className="text-left font-mono-archive text-xs uppercase tracking-widest text-[#e5e2e1] hover:text-[#ffb4a8] py-2 border-b border-[#5a403c]/20"
          >
            Collector Codex & Shipping
          </button>
          <button 
            onClick={() => scrollToSection('inquire')} 
            className="text-left font-mono-archive text-xs uppercase tracking-widest text-[#e5e2e1] hover:text-[#ffb4a8] py-2 border-b border-[#5a403c]/20"
          >
            Direct Inquiry Form
          </button>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenShareModal();
              }}
              className="w-full py-2.5 bg-[#8b0000]/30 border border-[#ac012c] text-[#ffb4a8] font-mono-archive text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Public Share Link</span>
            </button>
            <a
              href="mailto:urnimukherjee21@gmail.com"
              className="w-full py-2.5 bg-[#1c1b1b] border border-[#5a403c]/50 text-[#e5e2e1] font-mono-archive text-xs uppercase tracking-widest flex items-center justify-center gap-2 text-center"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Direct Studio Email</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
