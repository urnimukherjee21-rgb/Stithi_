import { useState, useEffect, FormEvent } from 'react';
import { Mail, Send, CheckCircle, Shield, ArrowUpRight } from 'lucide-react';
import { ARTWORKS_DATA } from '../data/artworks';

interface InquirySectionProps {
  selectedArtworkTitle?: string;
}

export default function InquirySection({ selectedArtworkTitle }: InquirySectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [artwork, setArtwork] = useState('General Monograph Inquiry');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'fallback' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedArtworkTitle) {
      // Find matching option
      const found = ARTWORKS_DATA.find(a => a.title.toLowerCase() === selectedArtworkTitle.toLowerCase());
      if (found) {
        setArtwork(`${found.plateNumber.split(' // ')[0]}: ${found.title}`);
      } else {
        setArtwork(selectedArtworkTitle);
      }
    }
  }, [selectedArtworkTitle]);

  const generateMailtoUrl = () => {
    const subject = encodeURIComponent(`Artwork Inquiry: ${artwork}`);
    const body = encodeURIComponent(
      `Urni Mukherjee Fine Art Studio Acquisition Dispatch\n\n` +
      `Collector Name: ${name || 'Collector'}\n` +
      `Collector Email: ${email || 'Not specified'}\n` +
      `Plate / Work: ${artwork}\n\n` +
      `Collector Note & Courier Destination:\n${message || 'Please provide information on availability and acquisition terms.'}\n\n` +
      `Dispatched via Stithi Monograph Portfolio.`
    );
    return `mailto:urnimukherjee21@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleManualMailClient = () => {
    window.location.href = generateMailtoUrl();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setStatusMessage("Transmitting acquisition inquiry via studio Nodemailer service...");
    setPreviewUrl(null);

    try {
      const response = await fetch("/api/inquire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          name,
          email,
          artwork,
          message
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Nodemailer dispatch returned an unexpected status.");
      }

      setStatus('success');
      setStatusMessage(`Inquiry dispatched successfully via Nodemailer to Urni Mukherjee's studio (urnimukherjee21@gmail.com). You will receive a direct reply within 48 curatorial hours.`);
      if (data.previewUrl) {
        setPreviewUrl(data.previewUrl);
      }
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Transmission error';
      setStatus('fallback');
      setStatusMessage(`The studio server recorded your request. Click below to confirm transmission in your local email client or dispatch directly: ${errMsg}`);
    }
  };

  return (
    <section 
      id="inquire" 
      className="px-4 sm:px-8 md:px-12 lg:px-16 py-20 md:py-28 bg-[#131313] border-t border-[#5a403c]/30"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left Column: Context & Direct Contact */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#8b0000]"></span>
            <span className="font-mono-archive text-xs text-[#ffb4a8] uppercase tracking-widest">
              Direct Acquisition
            </span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#e5e2e1] leading-tight">
            Curatorial Dialogue
          </h2>

          <p className="text-sm sm:text-base text-[#e3beb8]/90 font-body leading-relaxed">
            Original fine ink monographs, archival museum-grade diptychs, and private commission requests are handled in direct dialogue with Urni Mukherjee. No automated bidding or third-party intermediaries.
          </p>

          <div className="bg-[#1c1b1b] border border-[#5a403c]/40 p-6 flex flex-col gap-3">
            <span className="font-mono-archive text-[10px] text-[#aa8984] uppercase tracking-widest">
              Direct Communication Line
            </span>
            <a 
              id="inquiry-email-direct-link"
              href="mailto:urnimukherjee21@gmail.com" 
              className="font-editorial text-xl sm:text-2xl text-[#ffb4a8] hover:text-[#ffdad9] transition-colors flex items-center gap-2"
            >
              <span>urnimukherjee21@gmail.com</span>
              <ArrowUpRight className="w-4 h-4 opacity-70" />
            </a>
            <span className="text-xs text-[#aa8984] font-body">
              Inquiries generally receive personalized artist replies within 48 curatorial hours.
            </span>
          </div>

          <div className="flex items-center gap-2.5 text-[#aa8984] font-mono-archive text-[11px]">
            <Shield className="w-4 h-4 text-[#ffb3b4] shrink-0" />
            <span>Each piece is accompanied by a hand-signed, wax-sealed Certificate of Provenance.</span>
          </div>
        </div>

        {/* Right Column: Acquisition Form */}
        <div className="lg:col-span-7 bg-[#1c1b1b] border border-[#5a403c]/40 p-6 sm:p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ac012c]/10 blur-3xl pointer-events-none"></div>

          <form 
            id="acquisition-form" 
            onSubmit={handleSubmit} 
            className="flex flex-col gap-5 relative z-10"
          >
            <div className="flex flex-col gap-1.5">
              <label 
                htmlFor="collector-name" 
                className="font-mono-archive text-[10px] text-[#aa8984] uppercase tracking-widest"
              >
                Collector Full Name *
              </label>
              <input
                id="collector-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Julian Vane"
                className="w-full bg-[#0e0e0e] border border-[#5a403c]/40 px-4 py-3 text-[#e5e2e1] text-sm focus:border-[#ffb4a8] focus:bg-[#201f1f] outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label 
                htmlFor="collector-email" 
                className="font-mono-archive text-[10px] text-[#aa8984] uppercase tracking-widest"
              >
                Direct Email Address *
              </label>
              <input
                id="collector-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="julian@collector-vault.org"
                className="w-full bg-[#0e0e0e] border border-[#5a403c]/40 px-4 py-3 text-[#e5e2e1] text-sm focus:border-[#ffb4a8] focus:bg-[#201f1f] outline-none transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label 
                htmlFor="selected-artwork" 
                className="font-mono-archive text-[10px] text-[#aa8984] uppercase tracking-widest"
              >
                Work of Interest
              </label>
              <select
                id="selected-artwork"
                value={artwork}
                onChange={(e) => setArtwork(e.target.value)}
                className="w-full bg-[#0e0e0e] border border-[#5a403c]/40 px-4 py-3 text-[#e5e2e1] text-sm focus:border-[#ffb4a8] focus:bg-[#201f1f] outline-none transition-colors"
              >
                <option value="General Monograph Inquiry">General Monograph Inquiry</option>
                {ARTWORKS_DATA.map((art) => (
                  <option key={art.id} value={`${art.plateNumber.split(' // ')[0]}: ${art.title}`}>
                    {art.plateNumber.split(' // ')[0]}: {art.title} ({art.discipline})
                  </option>
                ))}
                <option value="Bespoke Studio Commission">Bespoke Studio Commission</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label 
                htmlFor="collector-message" 
                className="font-mono-archive text-[10px] text-[#aa8984] uppercase tracking-widest"
              >
                Collector Note / Shipping Region
              </label>
              <textarea
                id="collector-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Mention destination city for courier arrangements or specific curatorial questions..."
                className="w-full bg-[#0e0e0e] border border-[#5a403c]/40 px-4 py-3 text-[#e5e2e1] text-sm focus:border-[#ffb4a8] focus:bg-[#201f1f] outline-none transition-colors"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <button
                id="submit-inquiry-btn"
                type="submit"
                disabled={status === 'submitting'}
                className="px-8 py-4 bg-[#8b0000] hover:bg-[#ac012c] disabled:opacity-50 text-[#ffdad4] font-mono-archive text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-md"
              >
                <span>
                  {status === 'submitting' ? 'Dispatching...' : 'Send Inquiry to Urni Mukherjee'}
                </span>
                <Send className="w-3.5 h-3.5" />
              </button>

              <span className="font-mono-archive text-[10px] text-[#aa8984] text-center sm:text-right">
                Protocol: Direct Email Dispatch
              </span>
            </div>

            {statusMessage && (
              <div 
                id="inquiry-feedback-banner"
                className={`p-4 border text-xs font-mono-archive flex flex-col gap-2.5 ${
                  status === 'success' 
                    ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200' 
                    : 'bg-[#201f1f] border-[#5a403c]/50 text-[#ffb4a8]'
                }`}
              >
                <div className="flex items-start gap-2">
                  {status === 'success' && <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />}
                  <span>{statusMessage}</span>
                </div>

                {previewUrl && (
                  <div className="pt-1">
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#353534] border border-[#5a403c]/50 text-[#ffb4a8] text-[11px] underline"
                    >
                      <span>View Nodemailer Archival Transmission Log</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {status === 'fallback' && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleManualMailClient}
                      className="px-4 py-2 bg-[#8b0000] hover:bg-[#ac012c] text-[#ffdad4] text-[11px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Launch In Your Email App</span>
                    </button>
                    <a
                      href="mailto:urnimukherjee21@gmail.com"
                      className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#353534] border border-[#5a403c]/50 text-[#e5e2e1] text-[11px] uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <span>Write Direct to urnimukherjee21@gmail.com</span>
                    </a>
                  </div>
                )}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
