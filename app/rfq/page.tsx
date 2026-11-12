import { RfqList } from "@/components/rfq/rfq-list";

export default function RfqPage() {
  return (
    <>
      <section className="border-b border-separator bg-background">
        <div className="mx-auto max-w-[1280px] px-6 pb-5 pt-8 lg:px-12">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-foreground lg:text-3xl">
            Your RFQ
          </h1>
          <p className="mt-1 text-sm text-muted">Tell us what you need and we'll send you a quotation.</p>
        </div>
      </section>

      <section className="bg-background py-6 lg:py-8">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <RfqList />
        </div>
      </section>
    </>
  );
}
