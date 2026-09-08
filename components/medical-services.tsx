const pillars = [
  {
    heading: "Professional Installation & Commissioning",
    body: "We manage the complete delivery, assembly, and integration of all medical and laboratory systems to ensure they function seamlessly within your existing facility infrastructure.",
  },
  {
    heading: "Precision Calibration & Quality Assurance",
    body: "Our engineering team conducts rigorous testing and metrology calibration aligned with global medical and ISO standards, guaranteeing analytical precision, regulatory compliance, and maximum safety.",
  },
  {
    heading: "Comprehensive After-Sales Support",
    body: "We offer reliable preventative maintenance agreements, prompt troubleshooting, rapid spare parts fulfillment, and comprehensive laboratory and clinical user training to minimize downtime.",
  },
];

export const MedicalServices = () => {
  return (
    <section className="bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-medical">
          Beyond the Sale
        </p>
        <h2 className="mb-12 font-display text-3xl font-extrabold tracking-tight text-heading lg:mb-16 lg:text-4xl">
          Technical &amp; after-sales support.
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
              <h3 className="mb-3 text-lg font-semibold tracking-tight text-heading">
                {pillar.heading}
              </h3>
              <p className="text-sm leading-relaxed text-muted" style={{ maxWidth: "38ch" }}>
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
