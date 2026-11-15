"use client";

import { Suspense, startTransition, useActionState, useEffect, useRef } from "react";
import { Button, Form } from "@heroui/react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { submitContact } from "./actions";

import { IdentityFields, SelectField, TextAreaField } from "@/components/form-fields";
import { eyebrow } from "@/components/primitives";
import { branchesInDisplayOrder } from "@/config/branches";
import { enquiryTypeIds, enquiryTypes, type EnquiryTypeId } from "@/config/enquiry-routing";
import { siteConfig } from "@/config/site";
import { categories } from "@/lib/products";

// useSearchParams needs a Suspense boundary so the rest of the page can
// still be prerendered.
export default function ContactPage() {
  return (
    <Suspense>
      <ContactContent />
    </Suspense>
  );
}

function ContactContent() {
  // Links elsewhere pre-select the enquiry type (?enquiry=medical) and can
  // name a product (?product=<slug>), so Medical's simple quote request
  // arrives already routed and with context (CI-41).
  const searchParams = useSearchParams();
  const enquiryParam = searchParams.get("enquiry");
  const defaultEnquiry = enquiryTypeIds.includes(enquiryParam as EnquiryTypeId) ? (enquiryParam as EnquiryTypeId) : "";
  const productParam = searchParams.get("product")?.trim().slice(0, 120);
  const categoryParam = searchParams.get("category")?.trim().slice(0, 120);
  const subject = productParam ?? categoryParam;
  const defaultMessage = subject ? `Enquiry about: ${subject.replace(/-/g, " ")}\n\n` : "";
  const router = useRouter();
  const [state, formAction, pending] = useActionState(submitContact, { status: "idle" });
  const errorRef = useRef<HTMLParagraphElement>(null);
  // Set synchronously on submit: `pending` only flips after a render, so a
  // fast double-click could otherwise send two requests.
  const submitting = useRef(false);

  useEffect(() => {
    if (!pending) submitting.current = false;
  }, [pending]);

  useEffect(() => {
    if (state.status === "error") errorRef.current?.focus();
    // Same confirmation flow as the RFQ: a page with the reference number.
    if (state.status === "success") router.push(`/contact/sent?ref=${state.reference}`);
  }, [state, router]);

  return (
    <>
      {/* Page header */}
      <section className="border-b border-separator bg-background">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12">
          <p className={eyebrow()}>
            Get in Touch
          </p>
          <h1 className="mb-4 font-display text-4xl font-extrabold tracking-tight text-foreground">
            Contact Us
          </h1>
          <p className="text-base leading-relaxed text-muted" style={{ maxWidth: "52ch" }}>
            Tell us what you need. Our team responds within one
            business day with specifications, pricing, and availability.
          </p>
          <p className="mt-3 text-sm text-muted">
            Need a price on specific products?{" "}
            <NextLink className="font-semibold text-foreground underline underline-offset-2 hover:text-accent" href="/rfq">
              Request a quote
            </NextLink>
            .
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_360px] lg:gap-24">

            {/* Form */}
            <div>
              <Form
                className="flex flex-col gap-6"
                validationBehavior="aria"
                validationErrors={state.status === "error" ? state.fieldErrors : undefined}
                // Submitted by hand rather than via `action`: React resets a form
                // after an action runs, which would wipe what the visitor typed
                // when the server sends back an error.
                onSubmit={(event) => {
                  event.preventDefault();
                  if (submitting.current) return;
                  submitting.current = true;
                  const data = new FormData(event.currentTarget);

                  startTransition(() => formAction(data));
                }}
              >
                {state.status === "error" && (
                  <p
                    ref={errorRef}
                    className="rounded-lg bg-danger-soft px-4 py-3 text-sm text-danger-soft-foreground outline-none"
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

                <IdentityFields />

                <SelectField
                  isRequired
                  defaultSelectedKey={defaultEnquiry}
                  description="This decides who receives your message. Complaints go to one person; everything else goes to our team inboxes."
                  label="Nature of enquiry"
                  name="enquiryType"
                  options={enquiryTypes.map((type) => ({ id: type.id, label: type.label }))}
                  placeholder="Select an option"
                />

                <TextAreaField
                  isRequired
                  defaultValue={defaultMessage}
                  label="Message or requirements"
                  name="message"
                  placeholder="Describe what you need: product names, quantities, grades, pack sizes, or any other details."
                  rows={6}
                />

                <div>
                  <Button className="h-11 px-8" isPending={pending} type="submit">
                    {pending ? "Sending…" : "Send message"}
                  </Button>
                  <p className="mt-3 text-xs text-muted">We respond within one business day.</p>
                </div>
              </Form>
            </div>

            {/* Contact details sidebar */}
            <aside className="flex flex-col gap-10">
              <div>
                <p className="mb-5 text-xs uppercase tracking-[0.25em] text-muted">
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
                <p className="mb-5 text-xs uppercase tracking-[0.25em] text-muted">
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
