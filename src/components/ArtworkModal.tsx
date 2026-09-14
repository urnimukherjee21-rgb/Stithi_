import { useEffect, useState, useRef, MouseEvent as ReactMouseEvent } from 'react';
import { 
  X, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ExternalLink,
  Move,
  Maximize2
} from 'lucide-react';
import { Artwork } from '../types';

interface ArtworkModalProps {
  artwork: Artwork | null;
  onClose: () => void;
  onInquire: (artwork: Artwork) => void;
}

export default function ArtworkModal({ artwork, onClose, onInquire }: ArtworkModalProps) {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-') {
        handleZoomOut();
      } else if (e.key === '0') {
        handleResetZoom();
      }
    };

    if (artwork) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      setZoomLevel(1);
      setPanOffset({ x: 0, y: 0 });
      setImageLoaded(false);
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [artwork, onClose]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (isDragging && zoomLevel > 1) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!artwork) return null;

  const rawMasterUrl = artwork.rawImage || artwork.image;

  return (
    <div
      id="artwork-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="artwork-modal-card"
        className="relative w-full max-w-6xl bg-[#1c1b1b] border border-[#5a403c]/40 max-h-[94vh] flex flex-col lg:flex-row overflow-hidden shadow-2xl"
      >
        {/* Close Button */}
        <button
          id="close-artwork-modal-btn"
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-10 h-10 bg-[#2a2a2a]/95 hover:bg-[#8b0000] text-[#e5e2e1] flex items-center justify-center transition-colors cursor-pointer border border-[#5a403c]/40"
          aria-label="Close specimen view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: High-Res Master Image Presentation & Magnification Controls */}
        <div className="lg:w-3/5 bg-[#0e0e0e] p-4 sm:p-6 flex flex-col items-center justify-between relative min-h-[360px] border-b lg:border-b-0 lg:border-r border-[#5a403c]/30 select-none">
          {/* Top Bar: Master Resolution Badge & External Raw Link */}
          <div className="w-full flex items-center justify-between gap-2 z-20 pb-2 border-b border-[#5a403c]/20">
            <div className="flex items-center gap-2 text-[10px] font-mono-archive text-[#ffb4a8] uppercase tracking-widest">
              <Layers className="w-3.5 h-3.5 text-[#ffb4a8]" />
              <span className="font-semibold">Master Uncompressed Source</span>
            </div>

            <a
              id="view-raw-source-btn"
              href={rawMasterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] font-mono-archive text-[#aa8984] hover:text-[#ffb4a8] uppercase transition-colors px-2 py-1 bg-[#1a1a1a] border border-[#5a403c]/30"
              title="Open raw uncompressed original plate in new tab"
            >
              <span>Raw Plate</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Center Stage: Interactive Zoomable Image */}
          <div 
            ref={imageContainerRef}
            className={`relative w-full flex-1 max-h-[66vh] flex items-center justify-center overflow-hidden my-3 ${
              zoomLevel > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-zoom-in'
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={() => {
              if (zoomLevel === 1) handleZoomIn();
            }}
          >
            {!imageLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0e0e0e] z-10 text-xs font-mono-archive text-[#aa8984]">
                <div className="w-6 h-6 border-2 border-[#8b0000] border-t-transparent rounded-full animate-spin"></div>
                <span>Streaming Uncompressed Master...</span>
              </div>
            )}

            <div
              style={{
                transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
                transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                transformOrigin: 'center center',
              }}
              className="flex items-center justify-center max-h-full max-w-full"
            >
              <img
                id="modal-artwork-image"
                src={rawMasterUrl}
                alt={artwork.title}
                onLoad={() => setImageLoaded(true)}
                className="max-h-[60vh] w-auto max-w-full object-contain select-none shadow-2xl filter contrast-[1.02]"
                style={{
                  imageRendering: '-webkit-optimize-contrast',
                }}
                referrerPolicy="no-referrer"
              />
            </div>

            {zoomLevel > 1 && (
              <div className="absolute bottom-2 left-2 bg-[#1c1b1b]/90 border border-[#5a403c]/50 px-2 py-1 flex items-center gap-1.5 text-[9px] font-mono-archive text-[#ffb4a8] pointer-events-none">
                <Move className="w-3 h-3 text-[#ffb4a8]" />
                <span>Drag to Inspect Stippling Texture</span>
              </div>
            )}
          </div>

          {/* Bottom Controls: Zoom & Magnifier Toolbar */}
          <div className="w-full pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#5a403c]/20 z-20">
            <div className="flex items-center gap-1 bg-[#1a1a1a] border border-[#5a403c]/40 p-1">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                className="p-1.5 text-[#aa8984] hover:text-[#e5e2e1] disabled:opacity-30 transition-colors cursor-pointer"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <span className="px-2 font-mono-archive text-xs text-[#ffb4a8] min-w-[52px] text-center font-semibold">
                {Math.round(zoomLevel * 100)}%
              </span>

              <button
                type="button"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3.5}
                className="p-1.5 text-[#aa8984] hover:text-[#e5e2e1] disabled:opacity-30 transition-colors cursor-pointer"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {zoomLevel > 1 && (
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="p-1.5 text-[#aa8984] hover:text-[#ffb4a8] transition-colors border-l border-[#5a403c]/30 ml-1 cursor-pointer"
                  title="Reset Zoom (0)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomLevel(zoomLevel === 1 ? 2 : 1)}
                className="px-2.5 py-1.5 bg-[#201f1f] hover:bg-[#2c2b2b] border border-[#5a403c]/40 text-[10px] font-mono-archive text-[#e5e2e1] hover:text-[#ffb4a8] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Maximize2 className="w-3 h-3" />
                <span>{zoomLevel === 1 ? 'Detail Magnifier' : 'Fit Frame'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Detailed Curatorial Dossier & Acquisition Action */}
        <div className="lg:w-2/5 p-6 sm:p-8 md:p-9 flex flex-col justify-between overflow-y-auto bg-[#1c1b1b]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#5a403c]/30 pb-2">
              <span className="font-mono-archive text-[10px] text-[#ffb4a8] uppercase tracking-widest">
                {artwork.catalog}
              </span>
              <span className="font-mono-archive text-[10px] text-[#aa8984] uppercase">
                ORIGINAL MONOGRAPH
              </span>
            </div>

            <div>
              <h3 className="font-editorial text-2xl sm:text-3xl text-[#e5e2e1]">
                {artwork.title}
              </h3>
              <p className="font-editorial text-sm sm:text-base text-[#ffb4a8]/90 italic font-light mt-1">
                {artwork.caption}
              </p>
            </div>

            <div className="py-2 flex flex-col gap-1.5 border-t border-b border-[#5a403c]/20">
              <span className="font-mono-archive text-[10px] text-[#aa8984] uppercase tracking-widest">
                Medium & Discipline
              </span>
              <p className="text-xs text-[#e3beb8] font-body">
                {artwork.medium}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <span className="font-mono-archive text-[10px] text-[#aa8984] uppercase tracking-widest">
                Curatorial Backstory
              </span>
              <p className="text-xs sm:text-sm text-[#e5e2e1] leading-relaxed font-body">
                {artwork.story}
              </p>
            </div>

            <div className="p-3 bg-[#0e0e0e] border border-[#5a403c]/30 flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#ffb3b4] shrink-0" />
              <span className="font-mono-archive text-[10px] text-[#aa8984] uppercase tracking-wider">
                Custodianship by Private Inscription Only
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 sm:pt-8 flex flex-col gap-2.5 border-t border-[#5a403c]/30 mt-6">
            <button
              id="modal-inquire-direct-btn"
              onClick={() => onInquire(artwork)}
              className="w-full py-3.5 px-4 bg-[#8b0000] hover:bg-[#ac012c] text-[#ffdad4] font-mono-archive text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Mail className="w-4 h-4" />
              <span>Inquire to Acquire This Plate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              id="modal-close-secondary-btn"
              onClick={onClose}
              className="w-full py-2 bg-transparent text-[#aa8984] hover:text-[#e5e2e1] font-mono-archive text-[10px] uppercase tracking-widest transition-colors cursor-pointer text-center"
            >
              Return to Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
