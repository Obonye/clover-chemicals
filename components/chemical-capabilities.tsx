import { eyebrow } from "@/components/primitives";

// Source: Clover_Chemical_Industries_Company_Profile.md ("Clover Manufactured
// Products" and the certificates paragraph). Keep this to what makes the
// Chemicals division specific; company-wide history, ownership and partners
// live on /about and the group home (CI-82).
const madeByClover = [
  "Car Shampoo",
  "Oven Cleaner",
  "Epigel Rose Hand Soap",
  "Organitox Disinfectant",
  "Degreaser",
  "Window Cleaner",
  "Pit Fresh",
  "Carpet Shampoo",
  "Sanitox",
  "Fabric Softener",
  "Household Range",
];

const standards = [
  { label: "BOBS · BOS 111", value: "Dishwash" },
  { label: "BOBS · BOS 113", value: "Disinfectant" },
  { label: "BOBS · BOS 844:2020", value: "Sanitiser" },
  { label: "Certificates", value: "Agrochemicals, Manufacturing, Public Health" },
];

export const ChemicalCapabilities = () => {
  return (
    <section className="bg-[oklch(0.9280_0.0020_67.8)] py-24 dark:bg-[oklch(21.03%_0.0015_144.21)]">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_420px] lg:gap-24">
          {/* Left: what Clover makes itself */}
          <div className="flex flex-col justify-center">
            <p className={eyebrow({ class: "mb-6" })}>Made by Clover</p>
            <h2
              className="mb-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground"
              style={{ maxWidth: "18ch" }}
            >
              Our own range, blended in-house.
            </h2>
            <p className="mb-8 text-base leading-relaxed text-muted" style={{ maxWidth: "52ch" }}>
              Clover produces and blends its own range of cleaning chemicals in-house to meet the needs of
              our customers.
            </p>
            <ul aria-label="Clover-made products" className="flex flex-wrap gap-2">
              {madeByClover.map((name) => (
                <li
                  key={name}
                  className="rounded-full border border-separator bg-surface px-3 py-1.5 text-sm font-medium text-foreground"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: standards and certificates */}
          <div className="flex flex-col justify-center">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.25em] text-foreground/35">
              Standards &amp; certificates
            </p>
            <dl>
              {standards.map((row) => (
                <div
                  key={row.label}
                  className="flex items-baseline justify-between gap-6 border-t border-foreground/10 py-5 last:border-b"
                >
                  <dt className="shrink-0 text-xs font-medium uppercase tracking-widest text-foreground/45">
                    {row.label}
                  </dt>
                  <dd className="text-right font-mono text-base font-medium text-foreground">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};
