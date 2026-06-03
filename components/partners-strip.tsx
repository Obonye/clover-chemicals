const partners = [
  "Johnson Diversey",
  "Kimberly Clark",
  "Columbus",
  "Philips Medical",
  "Carestream",
  "Thermo Fisher",
  "Shimadzu",
  "Erweka",
  "Eppendorf",
];

export const PartnersStrip = () => {
  return (
    <div className="border-y border-separator bg-background py-10">

      {/* Centered label */}
      <p className="mb-6 text-center font-mono text-xs font-semibold uppercase tracking-[0.25em] text-accent">
        Trusted Partners
      </p>

      {/* Scrolling track */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-background to-transparent" />

        <div className="marquee-track flex items-center gap-16 w-max">
          {[...partners, ...partners].map((name, i) => (
            <span
              key={i}
              className="text-base font-semibold uppercase tracking-widest text-foreground/25 whitespace-nowrap"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};
