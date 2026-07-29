import Image from "next/image";
import NextLink from "next/link";

type Article = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
};

const articles: Article[] = [
  {
    slug: "clover-chemical-expands-into-zambia",
    category: "Company News",
    title: "Clover Chemical Expands Operations into Zambia",
    excerpt:
      "Following sustained growth across our Medical & Laboratory division, Clover Chemical Industries has formalised its investment in Zambia, extending our precision chemical supply network to a second southern African market.",
    date: "12 May 2025",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1717386255773-1e3037c81788?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "shimadzu-analytical-instruments-available",
    category: "Products",
    title: "New Shimadzu Analytical Instruments Now Available",
    excerpt:
      "As authorised agents for Shimadzu, we are pleased to offer the latest range of UV-Vis spectrophotometers, HPLC systems, and gas chromatographs to laboratories across Botswana.",
    date: "3 Apr 2025",
    readTime: "3 min read",
    image:
      "https://images.unsplash.com/photo-1614935151651-0bea6508db6b?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "agricultural-chemical-demand-southern-africa",
    category: "Industry",
    title: "Agricultural Chemical Demand Grows Across Southern Africa",
    excerpt:
      "Rising food security concerns and expanding commercial farming operations are driving significant growth in demand for crop-protection formulations and fertilizers across the SADC region.",
    date: "18 Mar 2025",
    readTime: "5 min read",
    image:
      "https://plus.unsplash.com/premium_photo-1661811677567-6f14477aa1fa?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "philips-medical-serviced-locally",
    category: "Products",
    title: "Philips Medical Equipment Now Fully Serviced Locally",
    excerpt:
      "Clover Chemical Industries has expanded its technical service capability for Philips Medical imaging and diagnostic equipment, reducing downtime for hospitals and clinics across Botswana.",
    date: "5 Feb 2025",
    readTime: "3 min read",
    image:
      "https://plus.unsplash.com/premium_photo-1661767897334-bbfbdfdc4d1a?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "edd-certification-renewed-2025",
    category: "Company News",
    title: "EDD Certification Renewed for 2025",
    excerpt:
      "Clover Chemical Industries has successfully renewed its Economic Diversification Drive certification, reinforcing our compliance for government and institutional procurement contracts.",
    date: "20 Jan 2025",
    readTime: "2 min read",
    image:
      "https://images.unsplash.com/photo-1628863353691-0071c8c1874c?auto=format&fit=crop&w=800&q=80",
  },
  {
    slug: "thermo-fisher-partnership-laboratory-division",
    category: "Partnerships",
    title: "Thermo Fisher Partnership Strengthens Laboratory Division",
    excerpt:
      "Our ongoing partnership with Thermo Fisher Scientific brings the latest in laboratory consumables, reagents, and instrumentation to research facilities and quality-control labs across the region.",
    date: "8 Jan 2025",
    readTime: "3 min read",
    image:
      "https://images.unsplash.com/photo-1496247749665-49cf5b1022e9?auto=format&fit=crop&w=800&q=80",
  },
];

const [featured, ...rest] = articles;

const categoryColors: Record<string, string> = {
  "Company News": "text-accent",
  Products: "text-accent",
  Industry: "text-accent",
  Partnerships: "text-accent",
};

export default function NewsPage() {
  return (
    <>
      {/* Page header */}
      <section className="border-b border-separator bg-background">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Latest Updates
          </p>
          <h1 className="mb-4 font-display text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
            News
          </h1>
          <p className="text-base leading-relaxed text-muted" style={{ maxWidth: "52ch" }}>
            Company announcements, industry developments, and product updates
            from Clover Chemical Industries.
          </p>
        </div>
      </section>

      <div className="bg-background">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12">

          {/* Featured article */}
          <article className="mb-16 grid grid-cols-1 gap-px bg-separator lg:grid-cols-[1fr_420px]">
            <div className="relative h-72 overflow-hidden bg-surface lg:h-auto lg:min-h-[420px]">
              <Image
                alt={featured.title}
                className="object-cover object-center transition-transform duration-700 hover:scale-105"
                fill
                priority
                src={featured.image}
              />
            </div>
            <div className="flex flex-col justify-between bg-background p-8 lg:p-10">
              <div>
                <p className="mb-4 font-mono text-xs font-medium uppercase tracking-widest text-accent">
                  {featured.category}
                </p>
                <h2 className="mb-4 font-display text-2xl font-extrabold leading-snug tracking-tight text-foreground lg:text-3xl">
                  {featured.title}
                </h2>
                <p className="text-sm leading-relaxed text-muted">
                  {featured.excerpt}
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-separator pt-6">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-muted">{featured.date}</span>
                  <span className="font-mono text-xs text-foreground/25">·</span>
                  <span className="font-mono text-xs text-muted">{featured.readTime}</span>
                </div>
                <NextLink
                  className="font-mono text-xs font-medium uppercase tracking-widest text-accent transition-colors hover:text-accent/75"
                  href={`/news/${featured.slug}`}
                >
                  Read more →
                </NextLink>
              </div>
            </div>
          </article>

          {/* Article grid */}
          <div className="grid grid-cols-1 gap-px bg-separator sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((article) => (
              <article key={article.slug} className="flex flex-col bg-background">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    alt={article.title}
                    className="object-cover object-center transition-transform duration-500 hover:scale-105"
                    fill
                    src={article.image}
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="mb-3 font-mono text-xs font-medium uppercase tracking-widest text-accent">
                    {article.category}
                  </p>
                  <h3 className="mb-3 text-base font-bold leading-snug tracking-tight text-foreground">
                    {article.title}
                  </h3>
                  <p className="mb-6 flex-1 text-sm leading-relaxed text-muted">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between border-t border-separator pt-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-muted">{article.date}</span>
                      <span className="font-mono text-xs text-foreground/25">·</span>
                      <span className="font-mono text-xs text-muted">{article.readTime}</span>
                    </div>
                    <NextLink
                      className="font-mono text-xs font-medium uppercase tracking-widest text-accent transition-colors hover:text-accent/75"
                      href={`/news/${article.slug}`}
                    >
                      Read →
                    </NextLink>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
