export default function TermsSection() {
  return (
    <section 
      id="protocols" 
      className="px-4 sm:px-8 md:px-12 lg:px-16 py-16 md:py-20 bg-[#0e0e0e] border-t border-[#5a403c]/30"
    >
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-[#5a403c]/30 pb-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#aa8984]"></span>
            <h3 className="font-editorial text-xl sm:text-2xl text-[#e5e2e1]">
              Collector Terms & Archival Protocols
            </h3>
          </div>
          <span className="font-mono-archive text-[10px] text-[#aa8984] uppercase tracking-widest">
            CODEX 2025 // STITHI
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#1c1b1b] border border-[#5a403c]/30 p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono-archive text-xs text-[#ffb3b4]">01</span>
              <h4 className="font-editorial text-lg text-[#e5e2e1] font-normal">
                Originality & Authenticity
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#e3beb8]/90 font-body leading-relaxed">
              Every work in the Stithi archive is an uncompromising original created on acid-free, archival heavy-tooth paper using archival pigmented inks. Accompanied by a physical Certificate of Provenance signed and cataloged by Urni Mukherjee.
            </p>
          </div>

          <div className="bg-[#1c1b1b] border border-[#5a403c]/30 p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono-archive text-xs text-[#ffb3b4]">02</span>
              <h4 className="font-editorial text-lg text-[#e5e2e1] font-normal">
                Insured Worldwide Courier
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#e3beb8]/90 font-body leading-relaxed">
              Works are encased in bespoke moisture-resistant reinforced timber casing or museum-grade archival tubes. Fully insured international transit with end-to-end telemetry directly from Kolkata to the collector&apos;s vault.
            </p>
          </div>

          <div className="bg-[#1c1b1b] border border-[#5a403c]/30 p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono-archive text-xs text-[#ffb3b4]">03</span>
              <h4 className="font-editorial text-lg text-[#e5e2e1] font-normal">
                Copyright & Reproduction
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#e3beb8]/90 font-body leading-relaxed">
              Acquisition transfers physical custodianship of the specimen. All reproduction, publishing, digital replication, and licensing copyrights remain exclusively with the artist Urni Mukherjee in perpetuity.
            </p>
          </div>

          <div className="bg-[#1c1b1b] border border-[#5a403c]/30 p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono-archive text-xs text-[#ffb3b4]">04</span>
              <h4 className="font-editorial text-lg text-[#e5e2e1] font-normal">
                Private Commissions
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#e3beb8]/90 font-body leading-relaxed">
              A limited number of bespoke commissions are accepted annually. Each commission engages a confidential conceptual inquiry into personal or literary psyches before ink touches paper.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
