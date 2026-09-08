import Image from "next/image";

const tags = ["Hospitals", "Clinics", "Research Labs"];

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path d="M12 2.5l7.5 3.5v5.2c0 5-3.2 8.5-7.5 10.3-4.3-1.8-7.5-5.3-7.5-10.3V6l7.5-3.5z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8.3 12.2l2.6 2.6 4.8-5.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WrenchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path
      d="M14.7 6.3a4 4 0 0 0-5.2 5.2L3 18v3h3l6.5-6.5a4 4 0 0 0 5.2-5.2l-2.75 2.75-2-2 2.75-2.75z"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Content only — no own <section>/background/overflow. Rendered inside
// HeroMedical's own box so the Spotlight (clipped to whatever box contains
// it) covers this too, instead of stopping dead at a section boundary.
export const MedicalHighlights = () => {
  return (
    <div className="relative mx-auto flex max-w-[1400px] flex-col gap-4 px-6 pt-10 pb-10 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between lg:px-12 lg:pb-14">
        {/* Photo card — tall (arc end) */}
        <div className="relative h-56 overflow-hidden rounded-2xl sm:h-72 sm:w-[23%] lg:h-[26rem]">
          <Image
            alt="Clover Medical diagnostic imaging team"
            className="object-cover object-center"
            fill
            src="/medical-team.jpg"
          />
          <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-lg">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-black" />
            <span className="text-xs font-semibold text-black">Diagnostic Imaging Team</span>
          </div>
        </div>

        {/* Stat card — medium */}
        <div className="flex h-56 flex-col justify-center rounded-2xl bg-white px-6 sm:h-60 sm:w-[15%] lg:h-80">
          <p className="font-display text-5xl font-extrabold text-black">6+</p>
          <p className="mt-2 text-sm leading-snug text-black/55">
            Comprehensive product lines
          </p>
        </div>

        {/* Feature card — precision (arc bottom, shortest) */}
        <div className="relative flex h-56 flex-col justify-between overflow-hidden rounded-2xl bg-[#17171d] p-6 sm:h-52 sm:w-[15%] lg:h-64">
          <h3 className="max-w-[14ch] text-lg font-semibold leading-snug text-white">
            Precision &amp; Compliance
          </h3>
          <ShieldCheckIcon className="ml-auto h-16 w-16 text-white/15" />
        </div>

        {/* Feature card — support, medium */}
        <div className="relative flex h-56 flex-col justify-between overflow-hidden rounded-2xl bg-[#17171d] p-6 sm:h-60 sm:w-[15%] lg:h-80">
          <h3 className="max-w-[14ch] text-lg font-semibold leading-snug text-white">
            Rapid After-Sales Support
          </h3>
          <WrenchIcon className="ml-auto h-16 w-16 text-white/15" />
        </div>

        {/* Tag card — tall (arc end) */}
        <div className="flex h-56 flex-col justify-center rounded-2xl bg-white p-6 sm:h-72 sm:w-[23%] lg:h-[26rem]">
          <p className="text-sm font-semibold text-black/50">
            Serving all of Botswana
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-black px-3 py-1.5 text-xs font-medium text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
    </div>
  );
};
