import { RfqList } from "@/components/rfq/rfq-list";

export default function RfqPage() {
  return (
    <>
      <section className="border-b border-separator bg-background">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-muted">
            Request for Quote
          </p>
          <h1 className="mb-4 font-display text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
            Your RFQ
          </h1>
          <p className="max-w-[52ch] text-base leading-relaxed text-muted">
            Check the products, pack sizes and quantities you&apos;ve collected,
            then send the list to us for a quotation.
          </p>
        </div>
      </section>

      <section className="bg-background py-12 lg:py-16">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <RfqList />
        </div>
      </section>
    </>
  );
}
