"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import NextLink from "next/link";

import { submitContact, type ContactField } from "./actions";

import { branchesInDisplayOrder } from "@/config/branches";
import { enquiryTypes } from "@/config/enquiry-routing";
import { siteConfig } from "@/config/site";
import { categories } from "@/lib/products";

const fieldClass =
  "w-full max-w-full min-w-0 rounded border border-separator bg-surface px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 outline-none transition-colors focus:border-accent";

const labelClass =
  "mb-2 block font-mono text-xs font-medium uppercase tracking-widest text-muted";

const errorClass = "mt-1.5 text-xs text-danger";

export default function ContactPage() {
  const [state, formAction, pending] = useActionState(submitContact, { status: "idle" });
  // The success panel replaces the form; "Send another message" dismisses that
  // result so the (freshly mounted, empty) form shows again.
  const [dismissed, setDismissed] = useState<typeof state | null>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state.status === "error") errorRef.current?.focus();
  }, [state]);

  const fieldErrors: Partial<Record<ContactField, string>> =
    state.status === "error" ? (state.fieldErrors ?? {}) : {};

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
            Tell us what you need. Our team responds within one
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
              {state.status === "success" && dismissed !== state ? (
                <div className="flex flex-col items-start gap-4 py-8">
                  <span className="font-mono text-xs uppercase tracking-widest text-accent">
                    Message Sent
                  </span>
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                    Thank you — we&apos;ll be in touch.
                  </h2>
                  <p className="text-sm leading-relaxed text-muted" style={{ maxWidth: "44ch" }}>
                    Our team will respond within one business day with
                    specifications, pricing, and availability for your enquiry.
                    Your reference is <strong className="text-foreground">{state.reference}</strong>.
                  </p>
                  <button
                    className="mt-4 font-mono text-xs uppercase tracking-widest text-accent transition-colors hover:text-accent/75"
                    type="button"
                    onClick={() => setDismissed(state)}
                  >
                    Send another message →
                  </button>
                </div>
              ) : (
                <form action={formAction} className="flex flex-col gap-6">
                  {state.status === "error" && (
                    <p
                      ref={errorRef}
                      className="rounded bg-danger-soft px-4 py-3 text-sm text-danger-soft-foreground outline-none"
                      role="alert"
                      tabIndex={-1}
                    >
                      {state.message}
                    </p>
                  )}

                  {/* Honeypot: hidden from people and assistive tech, but bots fill it. */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                    <label htmlFor="contact-website">Website</label>
                    <input autoComplete="off" id="contact-website" name="website" tabIndex={-1} type="text" />
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label className={labelClass} htmlFor="name">
                        Full Name <span className="text-accent">*</span>
                      </label>
                      <input
                        className={fieldClass}
                        aria-invalid={fieldErrors.name ? true : undefined}
                        autoComplete="name"
                        id="name"
                        name="name"
                        placeholder="John Smith"
                        required
                        type="text"
                      />
                      {fieldErrors.name && <p className={errorClass}>{fieldErrors.name}</p>}
                    </div>
                    <div className="min-w-0">
                      <label className={labelClass} htmlFor="company">
                        Company / Organisation
                      </label>
                      <input
                        className={fieldClass}
                        autoComplete="organization"
                        id="company"
                        name="company"
                        placeholder="Acme Ltd."
                        type="text"
                      />
                      {fieldErrors.company && <p className={errorClass}>{fieldErrors.company}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="min-w-0">
                      <label className={labelClass} htmlFor="email">
                        Email Address <span className="text-accent">*</span>
                      </label>
                      <input
                        className={fieldClass}
                        aria-invalid={fieldErrors.email ? true : undefined}
                        autoComplete="email"
                        id="email"
                        name="email"
                        placeholder="john@example.com"
                        required
                        type="email"
                      />
                      {fieldErrors.email && <p className={errorClass}>{fieldErrors.email}</p>}
                    </div>
                    <div className="min-w-0">
                      <label className={labelClass} htmlFor="phone">
                        Phone Number
                      </label>
                      <input
                        className={fieldClass}
                        aria-invalid={fieldErrors.phone ? true : undefined}
                        autoComplete="tel"
                        id="phone"
                        name="phone"
                        placeholder="+267 71 234 567"
                        type="tel"
                      />
                      {fieldErrors.phone && <p className={errorClass}>{fieldErrors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="enquiryType">
                      Nature of Enquiry <span className="text-accent">*</span>
                    </label>
                    <select
                      className={fieldClass}
                      aria-invalid={fieldErrors.enquiryType ? true : undefined}
                      defaultValue=""
                      id="enquiryType"
                      name="enquiryType"
                      required
                    >
                      <option disabled value="">
                        Select an option
                      </option>
                      {enquiryTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.enquiryType && <p className={errorClass}>{fieldErrors.enquiryType}</p>}
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="message">
                      Message / Requirements <span className="text-accent">*</span>
                    </label>
                    <textarea
                      className={`${fieldClass} resize-none`}
                      aria-invalid={fieldErrors.message ? true : undefined}
                      id="message"
                      name="message"
                      placeholder="Describe what you need — product names, quantities, grades, pack sizes, or any other details."
                      required
                      rows={6}
                    />
                    {fieldErrors.message && <p className={errorClass}>{fieldErrors.message}</p>}
                  </div>

                  <div>
                    <button
                      className="rounded bg-accent px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-accent-foreground transition-colors hover:bg-accent/90 disabled:opacity-50"
                      disabled={pending}
                      type="submit"
                    >
                      {pending ? "Sending…" : "Send Message"}
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
                  Our Offices
                </p>
                <address className="flex flex-col gap-5 not-italic">
                  {branchesInDisplayOrder.map((branch) => (
                    <div key={branch.slug}>
                      <p className="mb-1 text-sm font-semibold text-foreground">{branch.name}</p>
                      <NextLink
                        className="text-sm leading-relaxed text-muted transition-colors hover:text-accent"
                        href={`/locations#${branch.slug}`}
                      >
                        {branch.address}
                      </NextLink>
                    </div>
                  ))}
                  <div>
                    <p className="mb-1 text-sm font-semibold text-foreground">Email</p>
                    <a
                      className="text-sm text-muted transition-colors hover:text-accent"
                      href={`mailto:${siteConfig.contact.email}`}
                    >
                      {siteConfig.contact.email}
                    </a>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-semibold text-foreground">Phone</p>
                    <a
                      className="text-sm text-muted transition-colors hover:text-accent"
                      href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
                    >
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-semibold text-foreground">WhatsApp</p>
                    <a
                      className="text-sm text-muted transition-colors hover:text-accent"
                      href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^\d]/g, "")}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {siteConfig.contact.whatsapp}
                    </a>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-semibold text-foreground">Business Hours</p>
                    <p className="text-sm text-muted">{siteConfig.contact.hours}</p>
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
