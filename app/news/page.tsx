import Image from "next/image";
import NextLink from "next/link";

import { articles } from "@/lib/news";

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
                sizes="(min-width: 1024px) 860px, 100vw"
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
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
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
