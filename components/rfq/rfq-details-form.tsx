"use client";

import type { RfqSubmitState } from "@/app/rfq/actions";
import type { RfqLineItem } from "@/lib/rfq/types";

import * as React from "react";
import { getLocalTimeZone, today } from "@internationalized/date";
import {
  Button,
  Calendar,
  DateField,
  DatePicker,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  ListBox,
  Radio,
  RadioGroup,
  Select,
  TextArea,
  TextField,
} from "@heroui/react";

import { submitRfq } from "@/app/rfq/actions";
import { branchesInDisplayOrder } from "@/config/branches";
import { siteConfig } from "@/config/site";
import { buildRfqMailto } from "@/lib/rfq/mailto";
import { RFQ_FULFILMENT } from "@/lib/rfq/schema";

export type RfqSubmitSuccess = Extract<RfqSubmitState, { status: "success" }>;

type RfqDetailsFormProps = {
  /** The lines that will be sent (problem lines already left out). */
  items: RfqLineItem[];
  /** False while the list is still being checked against the catalogue. */
  ready: boolean;
  onSuccess: (result: RfqSubmitSuccess) => void;
};

const Field = ({
  name,
  label,
  isRequired,
  type = "text",
  autoComplete,
  placeholder,
  description,
}: {
  name: string;
  label: string;
  isRequired?: boolean;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  description?: string;
}) => (
  <TextField fullWidth isRequired={isRequired} name={name} type={type} variant="secondary">
    <Label>{label}</Label>
    <Input autoComplete={autoComplete} className="h-11" placeholder={placeholder} />
    {description && <Description>{description}</Description>}
    <FieldError />
  </TextField>
);

type Fulfilment = (typeof RFQ_FULFILMENT)[number];

const FULFILMENT_OPTIONS: { value: Fulfilment; label: string; description: string }[] = [
  { value: "delivery", label: "Delivery", description: "We deliver to your site and include it in the quote." },
  { value: "collection", label: "Collection", description: "You collect the order from one of our branches." },
];

// Radio cards, per HeroUI's RadioGroup customization pattern: the whole
// card is the clickable Radio.Content, with the label and description
// stacked beside the control. The selected/hovered/focus-visible data
// attributes live on the Radio root (React Aria's element), not on
// Radio.Content, so the root is the `group` everything here keys off.
const radioCardClass =
  "flex h-full w-full items-start gap-3 rounded-xl border border-separator bg-surface px-4 py-3.5 transition-colors group-data-[hovered=true]:border-accent/40 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[selected=true]:border-accent group-data-[selected=true]:bg-accent-soft";
const radioControlClass =
  "mt-0.5 size-5 shrink-0 rounded-full border border-border bg-default shadow-none group-data-[selected=true]:border-transparent group-data-[selected=true]:bg-accent";
const radioIndicatorClass =
  "before:rounded-full before:bg-default group-data-[selected=true]:before:scale-50 group-data-[selected=true]:before:bg-accent-foreground";

const BranchSelect = ({ label, placeholder }: { label: string; placeholder: string }) => (
  <Select fullWidth isRequired name="branch" placeholder={placeholder} variant="secondary">
    <Label>{label}</Label>
    <Select.Trigger className="h-11 min-h-11">
      <Select.Value />
      <Select.Indicator />
    </Select.Trigger>
    <FieldError />
    <Select.Popover>
      <ListBox>
        {branchesInDisplayOrder.map((branch) => (
          <ListBox.Item key={branch.slug} id={branch.slug} textValue={branch.name}>
            {branch.name}
            <ListBox.ItemIndicator />
          </ListBox.Item>
        ))}
      </ListBox>
    </Select.Popover>
  </Select>
);

export const RfqDetailsForm = ({ items, ready, onSuccess }: RfqDetailsFormProps) => {
  const [state, formAction, pending] = React.useActionState(submitRfq, { status: "idle" });
  const errorRef = React.useRef<HTMLParagraphElement>(null);
  const [fulfilment, setFulfilment] = React.useState<Fulfilment | null>(null);
  // Set synchronously on submit: `pending` only flips after a render, so a
  // fast double-click could otherwise send two requests.
  const submitting = React.useRef(false);

  React.useEffect(() => {
    if (!pending) submitting.current = false;
  }, [pending]);

  React.useEffect(() => {
    if (state.status === "success") onSuccess(state);
    if (state.status === "error") errorRef.current?.focus();
  }, [state, onSuccess]);

  // Every product-range request needs the buyer's description (CI-73).
  const missingDetails = items.filter((line) => line.type === "category" && line.details.trim() === "");
  const canSend = ready && items.length > 0 && missingDetails.length === 0 && !pending;

  return (
    <Form
      aria-labelledby="rfq-details-heading"
      className="flex flex-col gap-5"
      validationBehavior="aria"
      validationErrors={state.status === "error" ? state.fieldErrors : undefined}
      // Submitted by hand rather than via `action`: React resets a form after
      // an action runs, which would wipe what the buyer typed on an error.
      onSubmit={(event) => {
        event.preventDefault();
        if (submitting.current) return;
        submitting.current = true;
        const data = new FormData(event.currentTarget);

        React.startTransition(() => formAction(data));
      }}
    >
      <div>
        <h2 className="font-display text-xl font-extrabold tracking-tight text-foreground" id="rfq-details-heading">
          Your details
        </h2>
        <p className="mt-1 text-sm text-muted">We&apos;ll reply with a quotation, usually within one business day.</p>
      </div>

      {state.status === "error" && (
        <div
          ref={errorRef}
          className="flex flex-col gap-2 rounded-lg bg-danger-soft px-4 py-3 text-sm text-danger-soft-foreground outline-none"
          role="alert"
          tabIndex={-1}
        >
          <p>{state.message}</p>
          {/* No field errors means the request itself failed: keep the list
              usable by offering the same RFQ by email or phone. */}
          {!state.fieldErrors && items.length > 0 && (
            <p>
              Your list is still saved. You can try again below, or{" "}
              <a className="font-semibold underline underline-offset-2" href={buildRfqMailto(items)}>
                email it to us
              </a>{" "}
              or call{" "}
              <a
                className="font-semibold underline underline-offset-2"
                href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`}
              >
                {siteConfig.contact.phone}
              </a>
              .
            </p>
          )}
        </div>
      )}

      <input name="items" type="hidden" value={JSON.stringify(items)} />

      {/* Honeypot: hidden from people and assistive tech, but bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="rfq-website">Website</label>
        <input autoComplete="off" id="rfq-website" name="website" tabIndex={-1} type="text" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field isRequired autoComplete="name" label="Full name" name="fullName" />
        <Field isRequired autoComplete="organization" label="Company" name="company" />
        <Field isRequired autoComplete="email" label="Email" name="email" type="email" />
        <Field
          autoComplete="tel"
          description="Preferred. Give a mobile or a landline."
          label="Mobile"
          name="mobile"
          placeholder="+267 71 234 567"
          type="tel"
        />
        <Field
          autoComplete="tel"
          description="Optional if you gave a mobile."
          label="Landline"
          name="landline"
          placeholder="+267 391 2345"
          type="tel"
        />
      </div>

      <RadioGroup
        isRequired
        className="gap-3 **:data-[slot=radio]:mt-0"
        name="fulfilment"
        value={fulfilment}
        variant="secondary"
        onChange={(value) => setFulfilment(value as Fulfilment)}
      >
        <Label>Delivery or collection</Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FULFILMENT_OPTIONS.map((option) => (
            <Radio key={option.value} className="group" value={option.value}>
              <Radio.Content className={radioCardClass}>
                <Radio.Control className={radioControlClass}>
                  <Radio.Indicator className={radioIndicatorClass} />
                </Radio.Control>
                <span className="flex flex-col gap-0.5">
                  <span className="font-semibold text-foreground">{option.label}</span>
                  <Description className="group-data-[selected=true]:text-accent-soft-foreground">
                    {option.description}
                  </Description>
                </span>
              </Radio.Content>
            </Radio>
          ))}
        </div>
        <FieldError />
      </RadioGroup>

      {/* Only the fields that matter for the chosen option. */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {fulfilment === "delivery" && (
          <Field
            isRequired
            autoComplete="street-address"
            description="Street, area and town, or the site address."
            label="Delivery address"
            name="deliveryAddress"
          />
        )}
        {fulfilment === "collection" && (
          <BranchSelect label="Collect from" placeholder="Choose a branch" />
        )}

        {/* Submits as YYYY-MM-DD, which the server schema re-checks. */}
        <DatePicker className="w-full" minValue={today(getLocalTimeZone())} name="requiredBy">
          <Label>Required by</Label>
          <DateField.Group fullWidth className="h-11" variant="secondary">
            <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
            <DateField.Suffix>
              <DatePicker.Trigger aria-label="Choose a required-by date">
                <DatePicker.TriggerIndicator />
              </DatePicker.Trigger>
            </DateField.Suffix>
          </DateField.Group>
          <FieldError />
          <DatePicker.Popover>
            <Calendar aria-label="Required-by date">
              <Calendar.Header>
                <Calendar.YearPickerTrigger>
                  <Calendar.YearPickerTriggerHeading />
                  <Calendar.YearPickerTriggerIndicator />
                </Calendar.YearPickerTrigger>
                <Calendar.NavButton slot="previous" />
                <Calendar.NavButton slot="next" />
              </Calendar.Header>
              <Calendar.Grid>
                <Calendar.GridHeader>{(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}</Calendar.GridHeader>
                <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
              </Calendar.Grid>
              <Calendar.YearPickerGrid>
                <Calendar.YearPickerGridBody>
                  {({ year }) => <Calendar.YearPickerCell year={year} />}
                </Calendar.YearPickerGridBody>
              </Calendar.YearPickerGrid>
            </Calendar>
          </DatePicker.Popover>
        </DatePicker>
      </div>

      <TextField fullWidth name="message" variant="secondary">
        <Label>Message</Label>
        <TextArea placeholder="Anything else we should know about this request." rows={4} />
        <FieldError />
      </TextField>

      <div className="flex flex-wrap items-center gap-4">
        <Button className="h-11 px-6" isDisabled={!canSend} isPending={pending} type="submit">
          {pending
            ? "Sending…"
            : state.status === "error" && !state.fieldErrors
              ? "Try again"
              : `Send request (${items.length} item${items.length === 1 ? "" : "s"})`}
        </Button>
        {!ready && <span className="text-sm text-muted">Checking your list…</span>}
        {ready && missingDetails.length > 0 && (
          <span className="text-sm text-warning" role="status">
            Tell us what you need for{" "}
            {missingDetails.map((line) => (line.type === "category" ? line.categoryName : "")).join(", ")}.
          </span>
        )}
        {ready && items.length === 0 && (
          <span className="text-sm text-warning">Fix the items marked above to send your request.</span>
        )}
      </div>
    </Form>
  );
};
