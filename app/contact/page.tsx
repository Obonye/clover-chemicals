"use client";

import { useState } from "react";
import NextLink from "next/link";

import { categories } from "@/lib/products";

type FormState = "idle" | "submitting" | "success";

const fieldClass =
  "w-full max-w-full min-w-0 rounded border border-separator bg-surface px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-accent";

const labelClass =
  "mb-2 block font-mono text-xs font-medium uppercase tracking-widest text-muted";

export default function ContactPage() {
  const [formState, setFormState] = useState<FormState>("idle");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");
    // TODO: wire up to an email service (Resend, SendGrid, etc.)
    setTimeout(() => setFormState("success"), 800);
  }

  return (
    <>
      {/* Page header */}
      <section className="border-b border-separator bg-background">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12">
          <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Get in Touch
          </p>
          <h1 className="mb-4 font-display text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
            Contact Us
          </h1>
          <p className="text-base leading-relaxed text-muted" style={{ maxWidth: "52ch" }}>
            Tell us what you need. Our technical team responds within one
            business day with specifications, pricing, and availability.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_360px] lg:gap-24">

            {/* Form */}
            <div>
              {formState === "success" ? (
                <div className="flex flex-col items-start gap-4 py-8">
                  <span className="font-mono text-xs uppercase tracking-widest text-accent">
                    Message Sent
                  </span>
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                    Thank you — we&apos;ll be in touch.
                  </h2>
                  <p className="text-sm leading-relaxed text-muted" style={{ maxWidth: "44ch" }}>
                    Our technical team will respond within one business day with
                    specifications, pricing, and availability for your enquiry.
                  </p>
                  <button
                    className="mt-4 font-mono text-xs uppercase tracking-widest text-accent transition-colors hover:text-accent/75"
                    type="button"
                    onClick={() => setFormState("idle")}
                  >
                    Send another message →
                  </button>
                </div>
              ) : (
                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label className={labelClass} htmlFor="name">
                        Full Name <span className="text-accent">*</span>
                      </label>
                      <input
                        className={fieldClass}
                        id="name"
                        placeholder="John Smith"
                        required
                        type="text"
                      />
                    </div>
                    <div className="min-w-0">
                      <label className={labelClass} htmlFor="company">
                        Company / Organisation
                      </label>
                      <input
                        className={fieldClass}
                        id="company"
                        placeholder="Acme Ltd."
                        type="text"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label className={labelClass} htmlFor="email">
                        Email Address <span className="text-accent">*</span>
                      </label>
                      <input
                        className={fieldClass}
                        id="email"
                        placeholder="john@example.com"
                        required
                        type="email"
                      />
                    </div>
                    <div className="min-w-0">
                      <label className={labelClass} htmlFor="phone">
                        Phone Number
                      </label>
                      <input
                        className={fieldClass}
                        id="phone"
                        placeholder="+267 000 0000"
                        type="tel"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="product">
                      Product Interest
                    </label>
                    <select className={fieldClass} id="product">
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label}
                        </option>
                      ))}
                      <option value="other">Other / Not sure</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="message">
                      Message / Requirements <span className="text-accent">*</span>
                    </label>
                    <textarea
                      className={`${fieldClass} resize-none`}
                      id="message"
                      placeholder="Describe what you need — product names, quantities, grades, pack sizes, or any other details."
                      required
                      rows={6}
                    />
                  </div>

                  <div>
                    <button
                      className="rounded bg-accent px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50"
                      disabled={formState === "submitting"}
                      type="submit"
                    >
                      {formState === "submitting" ? "Sending…" : "Send Message"}
                    </button>
                    <p className="mt-3 text-xs text-muted">
                      We respond within one business day.
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* Contact details sidebar */}
            <aside className="flex flex-col gap-10">
              <div>
                <p className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-muted">
                  Our Office
                </p>
                <address className="flex flex-col gap-5 not-italic">
                  <div>
                    <p className="mb-1 text-sm font-semibold text-foreground">Address</p>
                    <p className="text-sm leading-relaxed text-muted">
                      123 Industrial Avenue<br />
                      Gaborone, Botswana
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-semibold text-foreground">Email</p>
                    <a
                      className="text-sm text-muted transition-colors hover:text-accent"
                      href="mailto:info@cloverchemical.com"
                    >
                      info@cloverchemical.com
                    </a>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-semibold text-foreground">Phone</p>
                    <a
                      className="text-sm text-muted transition-colors hover:text-accent"
                      href="tel:+26700000000"
                    >
                      +267 000 0000
                    </a>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-semibold text-foreground">Business Hours</p>
                    <p className="text-sm text-muted">Monday – Friday, 8:00 – 17:00 CAT</p>
                  </div>
                </address>
              </div>

              <div className="border-t border-separator pt-10">
                <p className="mb-5 font-mono text-xs uppercase tracking-[0.25em] text-muted">
                  Browse by Category
                </p>
                <ul className="flex flex-col">
                  {categories.map((cat) => (
                    <li key={cat.id} className="border-t border-separator first:border-t-0">
                      <NextLink
                        className="flex items-center justify-between py-3 text-sm text-muted transition-colors hover:text-foreground"
                        href={cat.href}
                      >
                        {cat.label}
                        <span aria-hidden="true" className="text-muted/40">→</span>
                      </NextLink>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

          </div>
        </div>
      </section>
    </>
  );
}
