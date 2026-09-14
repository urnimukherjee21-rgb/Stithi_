import { useState } from 'react';
import { Globe, Copy, Check, ExternalLink, X, Share2, ShieldCheck } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  sharedUrl?: string;
}

export default function ShareModal({ isOpen, onClose, sharedUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  // The official public shared URL for this applet
  const publicUrl = sharedUrl || 
    (typeof window !== 'undefined' && window.location.origin.includes('ais-') 
      ? window.location.origin.replace('ais-dev-', 'ais-pre-')
      : 'https://ais-pre-gjpxuzzl5vdsblx5i47hmz-925278960502.asia-east1.run.app');

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = publicUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Stithi // Urni Mukherjee Monograph',
          text: 'Explore the dark surrealist archival monograph and fine ink drawings of Urni Mukherjee.',
          url: publicUrl,
        });
      } catch (err) {
        console.error('Share cancelled or failed', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div 
      id="share-modal-backdrop"
      className="fixed inset-0 z-50 bg-[#0e0e0e]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        id="share-modal-dialog"
        className="relative w-full max-w-xl bg-[#1c1b1b] border border-[#5a403c]/40 shadow-2xl p-6 sm:p-8 flex flex-col gap-6"
      >
        {/* Close Button */}
        <button 
          id="close-share-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-[#2a2a2a] hover:bg-[#8b0000] text-[#e5e2e1] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close Share Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#8b0000]/20 border border-[#8b0000]/60 flex items-center justify-center shrink-0 text-[#ffb4a8]">
            <Globe className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono-archive text-[10px] uppercase tracking-[0.2em] text-[#ffb4a8]">
              Public Access Protocol
            </span>
            <h3 className="font-editorial text-2xl text-[#e5e2e1] mt-0.5">
              Public Link for Everyone
            </h3>
            <p className="text-xs text-[#aa8984] mt-1 font-body leading-relaxed">
              Anyone with this link can view Urni Mukherjee&apos;s full archival monograph, examine high-resolution plates, and submit direct acquisitions.
            </p>
          </div>
        </div>

        {/* Link Display Box */}
        <div className="flex flex-col gap-2">
          <label className="font-mono-archive text-[10px] uppercase tracking-widest text-[#aa8984]">
            Shareable Public URL
          </label>
          <div className="flex items-center gap-2 bg-[#0e0e0e] border border-[#5a403c]/60 p-2 sm:p-3">
            <input 
              id="public-site-link-input"
              readOnly 
              value={publicUrl} 
              className="bg-transparent text-sm text-[#ffb4a8] font-mono-archive flex-1 outline-none select-all overflow-hidden text-ellipsis"
            />
            <button
              id="copy-public-link-btn"
              onClick={handleCopy}
              className={`px-4 py-2 text-xs font-mono-archive uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                copied 
                  ? 'bg-emerald-800 text-white' 
                  : 'bg-[#8b0000] hover:bg-[#ac012c] text-[#ffdad4]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <a
            id="open-live-site-btn"
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[140px] px-4 py-3 bg-[#2a2a2a] hover:bg-[#353534] border border-[#5a403c]/40 text-[#e5e2e1] hover:text-[#ffb4a8] font-mono-archive text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 text-center"
          >
            <span>Open in New Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              id="native-share-btn"
              onClick={handleNativeShare}
              className="px-4 py-3 bg-[#2a2a2a] hover:bg-[#353534] border border-[#5a403c]/40 text-[#e5e2e1] font-mono-archive text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Device</span>
            </button>
          )}
        </div>

        {/* Instructions for AI Studio Sharing */}
        <div className="bg-[#131313] border border-[#5a403c]/30 p-4 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 text-xs text-[#ffb4a8] font-mono-archive uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-[#ffb4a8]" />
            <span>AI Studio Public Access Guide</span>
          </div>
          <ol className="text-xs text-[#e3beb8]/90 font-body space-y-1.5 list-decimal list-inside leading-relaxed">
            <li>
              <strong>Google AI Studio UI:</strong> Click the <span className="text-[#ffb4a8] font-mono-archive">Share</span> button in the top right header of AI Studio.
            </li>
            <li>
              <strong>Permission Setting:</strong> Select <span className="text-white font-medium">&quot;Anyone with the link&quot;</span> to make this public so no Google login is required to browse.
            </li>
            <li>
              <strong>Cloud Run Deployment:</strong> You can also choose <span className="text-[#ffb4a8] font-mono-archive">Deploy to Cloud Run</span> from the Settings menu for a permanent dedicated domain.
            </li>
          </ol>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-1 border-t border-[#5a403c]/20 text-[11px] font-mono-archive text-[#aa8984]">
          <span>Direct Curatorial Dispatch Ready</span>
          <button 
            onClick={onClose}
            className="hover:text-[#ffb4a8] uppercase tracking-wider cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
