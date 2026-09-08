import Image from "next/image";
import NextLink from "next/link";

type ProductLine = {
  heading: string;
  intro: string;
  image: string;
  span: string;
};

const productLines: ProductLine[] = [
  {
    heading: "Advanced Diagnostic Imaging & Healthcare IT",
    intro: "Cutting-edge imaging modalities and digital infrastructure for exceptional diagnostic clarity.",
    image: "/product_lines/diagnostic-imaging.jpg",
    span: "col-span-1 row-span-1 md:col-span-2 md:row-span-2",
  },
  {
    heading: "Clinical Laboratory Diagnostics & Automation",
    intro: "Robust, automated systems and highly reliable testing portfolios for medical pathology labs.",
    image: "/product_lines/lab-diagnostics.jpg",
    span: "col-span-1 row-span-1 md:col-span-2 md:row-span-1",
  },
  {
    heading: "Analytical Chemistry & Institutional Research",
    intro: "Elite scientific instrumentation and daily consumables for research and quality-control labs.",
    image: "/product_lines/analytical-chemistry.jpg",
    span: "col-span-1 row-span-1",
  },
  {
    heading: "Surgery & Advanced Wound Care",
    intro: "Ergonomic instrumentation, sterile environment solutions, and high-performance consumables.",
    image: "/product_lines/surgery.jpg",
    span: "col-span-1 row-span-1",
  },
  {
    heading: "Patient Care Continuum",
    intro: "Tailored in-patient and out-patient solutions across every stage of treatment and recovery.",
    image: "/product_lines/patient-care.jpg",
    span: "col-span-1 row-span-1 md:col-span-2 md:row-span-1",
  },
  {
    heading: "Renal Care & Dialysis Systems",
    intro: "Dedicated infrastructure and consumables for advanced renal replacement therapies.",
    image: "/product_lines/renal-care.jpg",
    span: "col-span-1 row-span-1 md:col-span-2 md:row-span-1",
  },
];

export const MedicalProductBento = () => {
  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-12">
        <h2 className="mb-14 font-display text-3xl font-extrabold tracking-tight text-heading lg:mb-16 lg:text-4xl">
          Dedicated medical and scientific sectors.
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4 md:auto-rows-[17rem] lg:auto-rows-[20rem]">
          {productLines.map((line) => (
            <NextLink
              key={line.heading}
              className={`group relative block min-h-64 overflow-hidden rounded-2xl md:min-h-0 ${line.span}`}
              href="/contact?division=medical"
            >
              <Image
                alt={line.heading}
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                fill
                src={line.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

              {/* Glass overlay — blurs the photo behind it on hover */}
              <div className="absolute inset-0 bg-white/10 opacity-0 backdrop-blur-md transition-opacity duration-300 ease-out group-hover:opacity-100" />

              {/* Arrow — pops in on hover */}
              <div className="absolute top-4 right-4 flex h-10 w-10 scale-75 items-center justify-center rounded-full bg-medical opacity-0 shadow-lg transition-all duration-300 ease-out group-hover:scale-100 group-hover:opacity-100 lg:top-5 lg:right-5">
                <svg className="h-4 w-4 text-medical-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M7 17L17 7M17 7H9M17 7V15" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6">
                <h3 className="mb-1.5 text-lg font-semibold leading-snug text-white lg:text-xl">
                  {line.heading}
                </h3>
                <p className="max-h-0 max-w-md -translate-y-1 overflow-hidden text-sm leading-snug text-white/70 opacity-0 transition-all duration-300 ease-out group-hover:max-h-24 group-hover:translate-y-0 group-hover:opacity-100">
                  {line.intro}
                </p>
              </div>
            </NextLink>
          ))}
        </div>
      </div>
    </section>
  );
};
