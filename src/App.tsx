import { useState } from 'react';
import { 
  Globe, 
  ArrowDown, 
  History, 
  ArrowRight, 
  Layers, 
  SlidersHorizontal, 
  Copy, 
  Check, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';
import Header from './components/Header';
import ArtworkModal from './components/ArtworkModal';
import ShareModal from './components/ShareModal';
import InquirySection from './components/InquirySection';
import TermsSection from './components/TermsSection';
import Footer from './components/Footer';
import { ARTWORKS_DATA } from './data/artworks';
import { Artwork, ArtworkCategory } from './types';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<ArtworkCategory>('all');
  const [activeArtwork, setActiveArtwork] = useState<Artwork | null>(null);
  const [framingMode, setFramingMode] = useState<'contain' | 'cover'>('contain');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [inquiryTargetArtwork, setInquiryTargetArtwork] = useState<string>('');
  const [copiedBannerLink, setCopiedBannerLink] = useState(false);

  // Shared public URL
  const publicShareUrl = typeof window !== 'undefined' && window.location.origin.includes('ais-')
    ? window.location.origin.replace('ais-dev-', 'ais-pre-')
    : 'https://ais-pre-gjpxuzzl5vdsblx5i47hmz-925278960502.asia-east1.run.app';

  // Filter artworks
  const filteredArtworks = ARTWORKS_DATA.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const categoryCounts = {
    all: ARTWORKS_DATA.length,
    anatomical: ARTWORKS_DATA.filter(a => a.category === 'anatomical').length,
    stippling: ARTWORKS_DATA.filter(a => a.category === 'stippling').length,
    psychological: ARTWORKS_DATA.filter(a => a.category === 'psychological').length,
  };

  const handleInquireFromModal = (artwork: Artwork) => {
    setActiveArtwork(null);
    setInquiryTargetArtwork(`${artwork.plateNumber.split(' // ')[0]}: ${artwork.title}`);
    
    // Smooth scroll to inquiry section
    const inquireElem = document.getElementById('inquire');
    if (inquireElem) {
      inquireElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyPublicUrlQuick = async () => {
    try {
      await navigator.clipboard.writeText(publicShareUrl);
      setCopiedBannerLink(true);
      setTimeout(() => setCopiedBannerLink(false), 2500);
    } catch {
      setIsShareModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] selection:bg-[#8b0000] selection:text-[#ffdad4] flex flex-col">
      {/* Header */}
      <Header onOpenShareModal={() => setIsShareModalOpen(true)} />

      {/* Main Content Area */}
      <main className="w-full pt-20 flex-1">
        {/* PUBLIC ACCESS BANNER */}
        <section 
          id="public-share-banner"
          className="w-full bg-[#1c1b1b] border-b border-[#5a403c]/30 px-4 sm:px-8 md:px-12 lg:px-16 py-3 transition-colors"
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono-archive">
            <div className="flex items-center gap-2 text-[#ffb4a8]">
              <Globe className="w-4 h-4 shrink-0 text-[#ffb4a8] animate-pulse" />
              <span className="font-medium">Public Monograph Link Active:</span>
              <span className="text-[#aa8984] hidden md:inline">
                Share with collectors, curators, and visitors worldwide
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                id="banner-copy-link-btn"
                onClick={copyPublicUrlQuick}
                className={`px-3 py-1.5 border text-[11px] uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                  copiedBannerLink
                    ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                    : 'bg-[#2a2a2a] hover:bg-[#353534] border-[#5a403c]/60 text-[#e5e2e1] hover:text-[#ffb4a8]'
                }`}
              >
                {copiedBannerLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Public Link</span>
                  </>
                )}
              </button>

              <button
                id="banner-details-btn"
                onClick={() => setIsShareModalOpen(true)}
                className="px-3 py-1.5 bg-[#8b0000] hover:bg-[#ac012c] text-[#ffdad4] text-[11px] uppercase tracking-widest transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Share Guide</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </section>

        {/* HERO SECTION */}
        <section 
          id="hero" 
          className="relative px-4 sm:px-8 md:px-12 lg:px-16 pt-12 md:pt-20 pb-16 md:pb-24 overflow-hidden"
        >
          {/* Crimson Horizon Ambient Glow */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[340px] bg-[#8b0000]/15 blur-[140px] pointer-events-none rounded-full" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start relative z-10">
            {/* Left: Monograph Identity & Typography */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-block w-2.5 h-2.5 bg-[#8b0000]" />
                <span className="font-mono-archive text-[11px] text-[#aa8984] uppercase tracking-[0.25em]">
                  Archival Monograph // Stithi Vol. 01
                </span>
                <span className="text-[#aa8984]/40 font-mono-archive text-xs">/</span>
                <span className="font-mono-archive text-[11px] text-[#ffb4a8] tracking-widest uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#ffb4a8]" />
                  Direct Collector Dispatch
                </span>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-wrap items-baseline gap-4 select-none">
                  <h1 className="font-editorial text-5xl sm:text-7xl lg:text-8xl tracking-tight text-[#e5e2e1]">
                    स्<span className="text-[#ac012c] italic font-black">ti</span>थि
                  </h1>
                  <span className="font-editorial text-2xl sm:text-3xl text-[#aa8984]/80 font-light hidden sm:inline-block">
                    / Urni Mukherjee
                  </span>
                </div>
                <p className="font-editorial text-xl sm:text-2xl text-[#ffb4a8]/90 mt-3 max-w-2xl font-light italic">
                  Intricate Ink, Dark Surrealism & The Architecture of Human Psyche
                </p>
              </div>

              {/* Quick Stats Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-xl pt-2">
                <div className="bg-[#1c1b1b] border border-[#5a403c]/40 p-4 flex flex-col justify-between">
                  <span className="font-mono-archive text-[10px] text-[#aa8984] uppercase">
                    Inventory
                  </span>
                  <span className="font-editorial text-2xl sm:text-3xl text-[#e5e2e1] mt-1 font-normal">
                    15
                  </span>
                  <span className="text-xs text-[#e3beb8]/80 font-body">
                    Archival Works
                  </span>
                </div>

                <div className="bg-[#1c1b1b] border border-[#5a403c]/40 p-4 flex flex-col justify-between">
                  <span className="font-mono-archive text-[10px] text-[#aa8984] uppercase">
                    Discipline
                  </span>
                  <span className="font-editorial text-2xl sm:text-3xl text-[#e5e2e1] mt-1 font-normal">
                    0.05
                  </span>
                  <span className="text-xs text-[#e3beb8]/80 font-body">
                    Micron, Ink & Carbon
                  </span>
                </div>

                <div className="bg-[#1c1b1b] border border-[#5a403c]/40 p-4 flex flex-col justify-between">
                  <span className="font-mono-archive text-[10px] text-[#aa8984] uppercase">
                    Acquisition
                  </span>
                  <span className="font-editorial text-2xl sm:text-3xl text-[#ffb3b4] mt-1 font-normal">
                    Direct
                  </span>
                  <span className="text-xs text-[#e3beb8]/80 font-body">
                    Collector Escrow
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Artist Biography & Direct Actions */}
            <div id="about" className="lg:col-span-4 flex flex-col gap-5 lg:pt-4">
              <div className="bg-[#1c1b1b] border border-[#5a403c]/40 p-6 sm:p-8 flex flex-col gap-4 relative overflow-hidden">
                <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-[#8b0000]/10 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-[#5a403c]/30 pb-2">
                  <span className="font-mono-archive text-[10px] text-[#ffb4a8] uppercase tracking-widest">
                    Artist Profile
                  </span>
                  <span className="font-mono-archive text-[10px] text-[#aa8984]">
                    KOLKATA / IN
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#e5e2e1] font-body leading-relaxed">
                  Urni Mukherjee maps the quiet corridors where existential anatomy clashes with fractured consciousness. Through relentless fine-line stippling, obsessive cross-hatching, and chiaroscuro depths, her works excavate internal turbulence and the sacred stillness of being.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <a
                    id="hero-view-plates-btn"
                    href="#gallery"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2a2a2a] hover:bg-[#8b0000] text-[#e5e2e1] hover:text-[#ffdad4] font-mono-archive text-xs uppercase tracking-widest transition-all duration-300 shadow-sm"
                  >
                    <span>View Plates</span>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </a>

                  <a
                    id="hero-artist-note-btn"
                    href="#artist-note"
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 text-[#aa8984] hover:text-[#ffb4a8] font-mono-archive text-xs uppercase tracking-widest transition-colors"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Artist Note</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Separator / Catalogue Raisonné Header Bar */}
        <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16 py-4 flex flex-wrap items-center justify-between gap-3 bg-[#0e0e0e] border-y border-[#5a403c]/30">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono-archive text-[11px] text-[#ffb4a8] uppercase tracking-wider">
                CATALOGUE RAISONNÉ
              </span>
              <span className="text-[#aa8984]/40 font-mono-archive text-xs">//</span>
              <span className="font-mono-archive text-[11px] text-[#aa8984] uppercase hidden sm:inline">
                15 ARCHIVAL SPECIMENS
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono-archive text-[10px] text-[#aa8984]">
              <span className="w-2 h-2 rounded-full bg-[#ac012c] animate-pulse" />
              <span>SELECT WORK FOR HISTORICAL DOSSIER</span>
            </div>
          </div>
        </div>

        {/* GALLERY SECTION */}
        <section 
          id="gallery" 
          className="px-4 sm:px-8 md:px-12 lg:px-16 py-16 md:py-24 max-w-7xl mx-auto"
        >
          {/* Gallery Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="font-mono-archive text-xs text-[#ffb4a8] uppercase tracking-[0.2em]">
                Exhibition Chamber
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#e5e2e1] mt-1">
                Selected Plates
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#aa8984] font-body max-w-md">
              Click any specimen plate to inspect high-resolution textures, read contextual backstories, and initiate direct artist acquisition protocol.
            </p>
          </div>

          {/* Filter Bar */}
          <div 
            id="gallery-filter-bar"
            className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#5a403c]/30"
          >
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <button
                id="filter-tab-all"
                onClick={() => setSelectedCategory('all')}
                className={`filter-tab px-4 py-2 font-mono-archive text-xs uppercase tracking-widest transition-all duration-300 border flex items-center gap-2 cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'border-[#8b0000] bg-[#8b0000]/20 text-[#ffb4a8]'
                    : 'border-[#5a403c]/30 bg-[#1c1b1b] hover:border-[#5a403c] text-[#e3beb8]'
                }`}
              >
                <span>All Plates</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-[#8b0000] text-[#ffdad4] font-normal">
                  {categoryCounts.all}
                </span>
              </button>

              <button
                id="filter-tab-anatomical"
                onClick={() => setSelectedCategory('anatomical')}
                className={`filter-tab px-4 py-2 font-mono-archive text-xs uppercase tracking-widest transition-all duration-300 border flex items-center gap-2 cursor-pointer ${
                  selectedCategory === 'anatomical'
                    ? 'border-[#8b0000] bg-[#8b0000]/20 text-[#ffb4a8]'
                    : 'border-[#5a403c]/30 bg-[#1c1b1b] hover:border-[#5a403c] text-[#e3beb8]'
                }`}
              >
                <span>Anatomical & Surreal</span>
                <span className="text-[10px] text-[#aa8984]">
                  {categoryCounts.anatomical}
                </span>
              </button>

              <button
                id="filter-tab-stippling"
                onClick={() => setSelectedCategory('stippling')}
                className={`filter-tab px-4 py-2 font-mono-archive text-xs uppercase tracking-widest transition-all duration-300 border flex items-center gap-2 cursor-pointer ${
                  selectedCategory === 'stippling'
                    ? 'border-[#8b0000] bg-[#8b0000]/20 text-[#ffb4a8]'
                    : 'border-[#5a403c]/30 bg-[#1c1b1b] hover:border-[#5a403c] text-[#e3beb8]'
                }`}
              >
                <span>Fine-Line Stippling</span>
                <span className="text-[10px] text-[#aa8984]">
                  {categoryCounts.stippling}
                </span>
              </button>

              <button
                id="filter-tab-psychological"
                onClick={() => setSelectedCategory('psychological')}
                className={`filter-tab px-4 py-2 font-mono-archive text-xs uppercase tracking-widest transition-all duration-300 border flex items-center gap-2 cursor-pointer ${
                  selectedCategory === 'psychological'
                    ? 'border-[#8b0000] bg-[#8b0000]/20 text-[#ffb4a8]'
                    : 'border-[#5a403c]/30 bg-[#1c1b1b] hover:border-[#5a403c] text-[#e3beb8]'
                }`}
              >
                <span>Psychological & Raw</span>
                <span className="text-[10px] text-[#aa8984]">
                  {categoryCounts.psychological}
                </span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Framing Mode Toggle */}
              <div className="flex items-center bg-[#141414] border border-[#5a403c]/30 p-1 text-[11px] font-mono-archive">
                <button
                  type="button"
                  onClick={() => setFramingMode('contain')}
                  className={`px-2.5 py-1 transition-colors cursor-pointer ${
                    framingMode === 'contain'
                      ? 'bg-[#8b0000] text-[#ffdad4]'
                      : 'text-[#aa8984] hover:text-[#e5e2e1]'
                  }`}
                  title="Show complete uncropped drawing borders"
                >
                  Full Archival Plate
                </button>
                <button
                  type="button"
                  onClick={() => setFramingMode('cover')}
                  className={`px-2.5 py-1 transition-colors cursor-pointer ${
                    framingMode === 'cover'
                      ? 'bg-[#8b0000] text-[#ffdad4]'
                      : 'text-[#aa8984] hover:text-[#e5e2e1]'
                  }`}
                  title="Framed uniform gallery fill"
                >
                  Framed Fill
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-mono-archive text-[#aa8984] uppercase">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#ffb4a8]" />
                <span>
                  {filteredArtworks.length} Works // Raw Master Fidelity
                </span>
              </div>
            </div>
          </div>

          {/* Artworks Grid */}
          <div 
            id="gallery-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            {filteredArtworks.map((art) => (
              <div
                key={art.id}
                id={`artwork-card-${art.id}`}
                onClick={() => setActiveArtwork(art)}
                className={`group relative bg-[#1c1b1b] border border-[#5a403c]/30 p-4 flex flex-col justify-between cursor-pointer transition-all duration-300 hover:bg-[#201f1f] hover:border-[#ac012c]/60 shadow-lg ${
                  art.isDiptych ? 'md:col-span-2 lg:col-span-2' : ''
                }`}
              >
                {/* Image Container */}
                <div 
                  className={`relative overflow-hidden bg-[#0c0c0c] border border-[#5a403c]/20 flex items-center justify-center ${
                    art.isDiptych ? 'aspect-[16/9]' : 'aspect-[3/4]'
                  }`}
                >
                  <img
                    src={art.image}
                    alt={art.title}
                    className={`w-full h-full transition-transform duration-700 ease-out group-hover:scale-[1.03] opacity-95 group-hover:opacity-100 ${
                      framingMode === 'contain' ? 'object-contain p-2.5' : 'object-cover'
                    }`}
                    style={{
                      imageRendering: '-webkit-optimize-contrast',
                    }}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  {/* High-Res Tag */}
                  <div className="absolute top-2 left-2 bg-[#0e0e0e]/85 border border-[#5a403c]/40 px-2 py-0.5 text-[9px] font-mono-archive text-[#ffb4a8] tracking-wider pointer-events-none">
                    MASTER RAW RES
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e]/95 via-[#0e0e0e]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                    <span className="font-mono-archive text-xs uppercase text-[#ffb4a8] tracking-widest flex items-center gap-1.5">
                      Inspect Stippling & Micro-Detail <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Card Meta */}
                <div className="pt-4 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono-archive text-[10px] text-[#aa8984]">
                      {art.plateNumber}
                    </span>
                    <span className="font-mono-archive text-[10px] text-[#ac012c] uppercase font-medium">
                      {art.discipline}
                    </span>
                  </div>

                  <h3 className="font-editorial text-lg sm:text-xl text-[#e5e2e1] group-hover:text-[#ffb4a8] transition-colors">
                    {art.title}
                  </h3>

                  <p className="text-xs text-[#e3beb8]/80 line-clamp-2 font-body">
                    {art.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ARTIST NOTE SECTION */}
        <section 
          id="artist-note" 
          className="relative bg-[#0e0e0e] px-4 sm:px-8 md:px-12 lg:px-16 py-20 md:py-28 overflow-hidden border-t border-[#5a403c]/30"
        >
          <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#8b0000]/10 blur-[150px] pointer-events-none rounded-full" />

          <div className="max-w-4xl mx-auto flex flex-col gap-10 relative z-10">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-[#ac012c]" />
              <span className="font-mono-archive text-xs text-[#ffb4a8] uppercase tracking-[0.25em]">
                Philosophical Stance
              </span>
            </div>

            <h2 className="font-editorial text-3xl sm:text-4xl md:text-5xl text-[#e5e2e1] leading-tight">
              The Needle, The Void & The Ritual of Stithi
            </h2>

            <div className="space-y-6 text-[#e3beb8]/90 font-body text-base sm:text-lg leading-relaxed">
              <p>
                &ldquo;Drawing is neither decoration nor narration for me; it is an act of violent stillness. In Sanskrit, <span className="text-[#ffb4a8] italic">Stithi</span> signifies both stability and the preservation of state amidst the universal tremor. When a 0.05mm steel nib bites into tooth-heavy watercolor paper, silence assumes an architectural form.&rdquo;
              </p>
              <p>
                &ldquo;The human mind exists in permanent dialogue with its own disintegration. Our identities fracture into geometric segments; our eyes turn inward, seeking an anchor in the dark tide. Each dot and obsessive stroke is a tactile anchor against the abyss—a disciplined reckoning with mortality, neurosis, and the quiet ecstasy found only after surrender.&rdquo;
              </p>
              <p className="italic text-[#e5e2e1] font-editorial text-xl sm:text-2xl border-l-2 border-[#ac012c] pl-4 py-1">
                &ldquo;I leave no room for hesitation. In black ink there is no forgiveness, only truth.&rdquo;
              </p>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#5a403c]/30">
              <div>
                <span className="font-editorial text-xl text-[#e5e2e1] block">
                  Urni Mukherjee
                </span>
                <span className="font-mono-archive text-[10px] text-[#aa8984] uppercase tracking-widest">
                  Artist & Custodian // Stithi Archive
                </span>
              </div>

              <div className="text-left sm:text-right">
                <span className="font-mono-archive text-[10px] text-[#ffb4a8] uppercase">
                  Studio Protocol
                </span>
                <p className="font-mono-archive text-xs text-[#e5e2e1]">
                  Kolkata, Bengal // Worldwide Inquiries
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* INQUIRY SECTION */}
        <InquirySection selectedArtworkTitle={inquiryTargetArtwork} />

        {/* TERMS & PROTOCOLS SECTION */}
        <TermsSection />
      </main>

      {/* Footer */}
      <Footer onOpenShareModal={() => setIsShareModalOpen(true)} />

      {/* Modals */}
      <ArtworkModal
        artwork={activeArtwork}
        onClose={() => setActiveArtwork(null)}
        onInquire={handleInquireFromModal}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        sharedUrl={publicShareUrl}
      />
    </div>
  );
}
