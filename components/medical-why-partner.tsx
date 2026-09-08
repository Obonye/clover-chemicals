const pillars = [
  {
    heading: "End-to-End Solutions",
    body: "From heavy diagnostic machinery and IT integration to everyday laboratory glassware, pipettes, and consumables, we are your single-source healthcare and research provider.",
  },
  {
    heading: "Uncompromising Quality Standards",
    body: "Every item in our catalog meets strict international medical, scientific, and regulatory benchmarks.",
  },
  {
    heading: "Local Technical Presence",
    body: "Our Gaborone-based engineering support ensures rapid response times and reliable on-site technical assistance whenever your facility or institution needs it.",
  },
];

export const MedicalWhyPartner = () => {
  return (
    <section className="relative isolate overflow-hidden bg-[#1c1c1c] py-16 lg:py-20">
      {/* Gentle corner glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(40% 55% at 100% 0%, color-mix(in oklch, var(--medical) 22%, transparent), transparent 70%), radial-gradient(40% 55% at 0% 100%, color-mix(in oklch, var(--medical) 22%, transparent), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[1280px] px-6 lg:px-12">
        <h2 className="mb-12 font-display text-3xl font-extrabold tracking-tight text-white lg:mb-16 lg:text-4xl">
          Why partner with Clover Medical?
        </h2>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          {pillars.map((pillar, i) => (
            <div key={pillar.heading}>
              <p
                aria-hidden="true"
                className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-medical"
              >
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mb-3 text-lg font-semibold tracking-tight text-white">
                {pillar.heading}
              </h3>
              <p className="text-sm leading-relaxed text-white/60" style={{ maxWidth: "38ch" }}>
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
