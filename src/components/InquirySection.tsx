import { useState, useEffect, FormEvent } from 'react';
import { Mail, Send, CheckCircle, Shield, ArrowUpRight, AlertTriangle, Copy, Check, ExternalLink } from 'lucide-react';
import { ARTWORKS_DATA } from '../data/artworks';

interface InquirySectionProps {
  selectedArtworkTitle?: string;
}

export default function InquirySection({ selectedArtworkTitle }: InquirySectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [artwork, setArtwork] = useState('General Monograph Inquiry');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'direct_ready' | 'fallback'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [copied, setCopied] = useState(false);

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

  const getDossierText = () => {
    return (
      `Stithi Monograph Acquisition Dispatch\n` +
      `----------------------------------------\n` +
      `Artist Contact: urnimukherjee21@gmail.com\n` +
      `Collector Name: ${name || 'Private Collector'}\n` +
      `Collector Email: ${email || 'Not specified'}\n` +
      `Selected Plate: ${artwork}\n\n` +
      `Collector Note & Courier Destination:\n` +
      `${message || 'Inquiring regarding current availability, archival framing, and acquisition terms.'}\n\n` +
      `Dispatched via Stithi Monograph Portfolio.`
    );
  };

  const generateGmailUrl = () => {
    const subject = encodeURIComponent(`[Stithi Acquisition] Inquiry: ${artwork} — ${name || 'Collector'}`);
    const body = encodeURIComponent(getDossierText());
    return `https://mail.google.com/mail/?view=cm&fs=1&to=urnimukherjee21@gmail.com&su=${subject}&body=${body}`;
  };

  const generateMailtoUrl = () => {
    const subject = encodeURIComponent(`[Stithi Acquisition] Inquiry: ${artwork} — ${name || 'Collector'}`);
    const body = encodeURIComponent(getDossierText());
    return `mailto:urnimukherjee21@gmail.com?subject=${subject}&body=${body}`;
  };

  const handleCopyDossier = async () => {
    try {
      await navigator.clipboard.writeText(getDossierText());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  const handleManualMailClient = () => {
    window.location.href = generateMailtoUrl();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setStatusMessage("Transmitting acquisition dossier to urnimukherjee21@gmail.com...");

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

      if (data.success && data.method === 'smtp') {
        setStatus('success');
        setStatusMessage(`Inquiry dispatched successfully via Nodemailer SMTP to urnimukherjee21@gmail.com. Urni Mukherjee's studio will reply within 48 curatorial hours.`);
        setName('');
        setEmail('');
        setMessage('');
        return;
      }

      // If background SMTP is not active or awaiting activation, trigger direct Compose tab
      const gmailUrl = generateGmailUrl();
      const opened = window.open(gmailUrl, '_blank');

      setStatus('direct_ready');
      setStatusMessage(
        opened 
          ? `Inquiry prepared for urnimukherjee21@gmail.com. We have opened your Web Gmail compose tab with the dossier filled in. Simply click "Send" in Gmail to deliver directly into Urni's inbox!`
          : `Inquiry prepared for urnimukherjee21@gmail.com. Click "Open in Web Gmail" below to send with one click, or use your default email app.`
      );
    } catch {
      // Fallback opens Gmail draft
      window.open(generateGmailUrl(), '_blank');
      setStatus('direct_ready');
      setStatusMessage(`Inquiry dossier prepared for urnimukherjee21@gmail.com. Click "Open in Web Gmail" or "Launch Email App" below to complete dispatch.`);
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

          <div className="p-4 bg-[#181818] border border-[#5a403c]/30 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-mono-archive text-[#ffb4a8] uppercase">
              <Mail className="w-3.5 h-3.5" />
              <span>Direct 1-Click Compose</span>
            </div>
            <p className="text-[11px] text-[#aa8984]">
              For 100% guaranteed delivery from your personal email account without third-party delay:
            </p>
            <div className="pt-1 flex flex-wrap gap-2">
              <a
                id="instant-gmail-btn"
                href={generateGmailUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-[#8b0000] hover:bg-[#ac012c] text-[#ffdad4] text-xs font-mono-archive uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Open in Web Gmail</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <a
                id="instant-mail-app-btn"
                href={generateMailtoUrl()}
                className="px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#353534] border border-[#5a403c]/40 text-[#e5e2e1] text-xs font-mono-archive uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <span>Launch Email App</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
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
                  {status === 'submitting' ? 'Forwarding...' : 'Send Inquiry to Urni Mukherjee'}
                </span>
                <Send className="w-3.5 h-3.5" />
              </button>

              <span className="font-mono-archive text-[10px] text-[#aa8984] text-center sm:text-right">
                Destination: urnimukherjee21@gmail.com
              </span>
            </div>

            {/* Direct Quick Actions Bar */}
            <div className="pt-3 border-t border-[#5a403c]/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-archive">
              <span className="text-[#aa8984] text-[11px]">
                Or send directly from your account:
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <a
                  id="direct-gmail-link"
                  href={generateGmailUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 bg-[#252525] hover:bg-[#333] border border-[#5a403c]/40 text-[#ffb4a8] text-[11px] flex items-center gap-1.5 transition-colors"
                  title="Open pre-filled draft directly in Web Gmail"
                >
                  <Mail className="w-3 h-3 text-[#ffb4a8]" />
                  <span>Open in Web Gmail</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  id="direct-client-link"
                  href={generateMailtoUrl()}
                  className="px-2.5 py-1.5 bg-[#252525] hover:bg-[#333] border border-[#5a403c]/40 text-[#e5e2e1] text-[11px] flex items-center gap-1.5 transition-colors"
                  title="Open in default desktop or mobile mail program"
                >
                  <span>Email App</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyDossier}
                  className="px-2.5 py-1.5 bg-[#252525] hover:bg-[#333] border border-[#5a403c]/40 text-[#aa8984] hover:text-[#e5e2e1] text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Copy formatted dossier to clipboard"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy Note'}</span>
                </button>
              </div>
            </div>

            {/* Status Feedback Banners */}
            {statusMessage && (
              <div 
                id="inquiry-feedback-banner"
                className={`p-4 border text-xs font-mono-archive flex flex-col gap-3 ${
                  status === 'success' 
                    ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200' 
                    : status === 'direct_ready'
                    ? 'bg-[#251817] border-[#8b0000] text-[#ffdad4]'
                    : 'bg-[#201f1f] border-[#5a403c]/50 text-[#ffb4a8]'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {status === 'success' ? (
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <Mail className="w-4 h-4 shrink-0 text-[#ffb4a8] mt-0.5" />
                  )}
                  <div className="flex flex-col gap-1 leading-relaxed">
                    <span className="font-semibold">
                      {status === 'success' ? 'Dispatched via Nodemailer:' : 'Acquisition Dispatch Prepared:'}
                    </span>
                    <span>{statusMessage}</span>
                  </div>
                </div>

                {status === 'direct_ready' && (
                  <div className="p-3 bg-[#171110] border border-[#5a403c]/40 flex flex-col gap-2.5 mt-1">
                    <div className="text-[11px] text-[#e3beb8] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#ffb4a8] rounded-full animate-pulse"></span>
                      <span>Recipient: <strong>urnimukherjee21@gmail.com</strong></span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <a
                        id="modal-direct-gmail-btn"
                        href={generateGmailUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-[#8b0000] hover:bg-[#ac012c] text-[#ffdad4] text-xs font-mono-archive uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Send Now in Web Gmail</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>

                      <a
                        href={generateMailtoUrl()}
                        className="px-3.5 py-2 bg-[#2a2a2a] hover:bg-[#353534] border border-[#5a403c]/50 text-[#e5e2e1] text-xs font-mono-archive uppercase tracking-wider flex items-center gap-1.5"
                      >
                        <span>Launch Mail App</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>

                      <button
                        type="button"
                        onClick={handleCopyDossier}
                        className="px-3.5 py-2 bg-[#202020] hover:bg-[#2c2c2c] border border-[#5a403c]/40 text-[#aa8984] hover:text-[#e5e2e1] text-xs font-mono-archive uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Copy Dossier'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {status === 'fallback' && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    <a
                      href={generateGmailUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-[#8b0000] hover:bg-[#ac012c] text-[#ffdad4] text-[11px] uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Send with 1-Click in Web Gmail</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                    <a
                      href={generateMailtoUrl()}
                      className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#353534] border border-[#5a403c]/50 text-[#e5e2e1] text-[11px] uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <span>Open in Mail App</span>
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
