const stats = [
  { label: "Year Founded",     value: "1987"  },
  { label: "Global Partners",  value: "10+"   },
  { label: "Divisions",        value: "4"     },
  { label: "Certification",    value: "EDD"   },
];

const pillars = [
  {
    heading: "Citizen-Owned & EDD Certified",
    body: "Majority citizen-owned and registered under Botswana's Economic Diversification Drive, giving our clients the procurement compliance they need for government and institutional contracts.",
  },
  {
    heading: "Global Brands, Local Support",
    body: "Authorised agents for Johnson Diversey, Kimberly Clark, Philips Medical, Thermo Fisher, Shimadzu, Eppendorf, and more, with world-class products backed by a team on the ground in Botswana.",
  },
  {
    heading: "Medical & Lab Leadership",
    body: "Our fastest-growing division and top revenue generator, serving hospitals, clinics, and research facilities across the region with leading scientific instrumentation and equipment.",
  },
];

export const HeritageSection = () => {
  return (
    <section className="py-24" style={{ backgroundColor: "oklch(21.03% 0.0015 144.21)" }}>
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">

        {/* Top: two-column editorial + spec table */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_420px] lg:gap-24">

          {/* Left — heritage narrative */}
          <div className="flex flex-col justify-center">
            <p className="mb-6 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
              Est. 1987
            </p>
            <h2
              className="mb-8 text-4xl font-bold leading-[1.1] tracking-tight text-white lg:text-5xl"
              style={{ maxWidth: "18ch" }}
            >
              Rooted in Botswana. Trusted by global industry.
            </h2>
            <p className="mb-5 text-base leading-[1.75] text-white/60" style={{ maxWidth: "55ch" }}>
              Clover Chemical Industries was established in Botswana in 1987 to
              manufacture and supply chemicals for domestic and industrial use. As
              demand grew, so did our scope, and today we are authorised agents for
              some of the world's leading manufacturers, including Johnson Diversey,
              Kimberly Clark, and Columbus.
            </p>
            <p className="text-base leading-[1.75] text-white/60" style={{ maxWidth: "55ch" }}>
              Our Medical & Laboratory division, representing Philips Medical,
              Thermo Fisher, Shimadzu, Eppendorf, and others, is our fastest-growing
              business. With a recent investment in Zambia, we are bringing the same
              standard of supply to new markets across the region.
            </p>
          </div>

          {/* Right — specification table */}
          <div className="flex flex-col justify-center">
            <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">
              Company Data
            </p>
            <div>
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="flex items-baseline justify-between py-5 last:border-b"
                  style={{
                    animationDelay: `${i * 80}ms`,
                    borderTop: "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  <span className="text-xs font-medium uppercase tracking-widest text-white/45">
                    {stat.label}
                  </span>
                  <span className="font-mono text-2xl font-medium tabular-nums text-white">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-20 h-px" style={{ backgroundColor: "rgba(255,255,255,0.10)" }} />

        {/* Bottom: three pillars — horizontal, no cards */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          {pillars.map((pillar, i) => (
            <div key={pillar.heading}>
              <p
                className="mb-1 font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-accent"
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mb-3 text-base font-semibold tracking-tight text-white">
                {pillar.heading}
              </h3>
              <p className="text-sm leading-relaxed text-white/55" style={{ maxWidth: "38ch" }}>
                {pillar.body}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
