type IconProps = { className?: string };

const ArcMark = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M4 13a8 8 0 1 1 16 0" strokeLinecap="round" />
  </svg>
);

const TriangleMark = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M12 4l8 16H4z" strokeLinejoin="round" />
  </svg>
);

const HexMark = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" strokeLinejoin="round" />
  </svg>
);

const VennMark = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <circle cx={9} cy={12} r={6} />
    <circle cx={15} cy={12} r={6} />
  </svg>
);

const DiamondMark = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path d="M12 3l9 9-9 9-9-9 9-9z" strokeLinejoin="round" />
  </svg>
);

const CrossMark = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
    <path d="M12 4v16M4 12h16" strokeLinecap="round" />
  </svg>
);

const marks = [
  { name: "Meridian Health", Icon: ArcMark },
  { name: "Solace Labs", Icon: TriangleMark },
  { name: "Ionic Diagnostics", Icon: HexMark },
  { name: "Halcyon Care", Icon: VennMark },
  { name: "Vertex Medical", Icon: DiamondMark },
  { name: "Nexora", Icon: CrossMark },
];

export const MedicalPartners = () => {
  return (
    <div className="relative bg-background py-10">
      {/* Fade — lives mostly in the picture row's own bottom space above,
          peaking right at the seam, then bleeding just slightly past it
          into this section. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 -translate-y-[85%]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, color-mix(in oklch, var(--foreground) 6%, transparent) 85%, transparent 100%)",
        }}
      />

      {/* Centered label */}
      <p className="mb-6 text-center font-mono text-xs font-semibold uppercase tracking-[0.25em] text-medical">
        Brands We Work With
      </p>

      {/* Scrolling track */}
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-background to-transparent" />

        <div className="marquee-track flex w-max items-center gap-16">
          {[...marks, ...marks].map(({ name, Icon }, i) => (
            <span
              key={i}
              className="flex items-center gap-2.5 whitespace-nowrap text-foreground/30"
            >
              <Icon className="h-6 w-6" />
              <span className="text-base font-semibold uppercase tracking-widest">
                {name}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
