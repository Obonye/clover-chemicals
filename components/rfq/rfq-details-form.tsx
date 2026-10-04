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
import { branches } from "@/config/branches";
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

const BranchSelect = ({ label, isRequired, placeholder }: { label: string; isRequired?: boolean; placeholder: string }) => (
  <Select fullWidth isRequired={isRequired} name="branch" placeholder={placeholder} variant="secondary">
    <Label>{label}</Label>
    <Select.Trigger className="h-11 min-h-11">
      <Select.Value />
      <Select.Indicator />
    </Select.Trigger>
    <FieldError />
    <Select.Popover>
      <ListBox>
        {branches.map((branch) => (
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

  React.useEffect(() => {
    if (state.status === "success") onSuccess(state);
    if (state.status === "error") errorRef.current?.focus();
  }, [state, onSuccess]);

  const canSend = ready && items.length > 0 && !pending;

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
        <p
          ref={errorRef}
          className="rounded-lg bg-danger-soft px-4 py-3 text-sm text-danger-soft-foreground outline-none"
          role="alert"
          tabIndex={-1}
        >
          {state.message}
        </p>
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
        <Field isRequired autoComplete="tel" label="Phone" name="phone" placeholder="+267 71 234 567" type="tel" />
      </div>

      <RadioGroup
        isRequired
        name="fulfilment"
        orientation="horizontal"
        value={fulfilment}
        variant="secondary"
        onChange={(value) => setFulfilment(value as Fulfilment)}
      >
        <Label>Delivery or collection</Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FULFILMENT_OPTIONS.map((option) => (
            <Radio
              key={option.value}
              className="rounded-xl border border-separator p-4 data-[selected=true]:border-accent"
              value={option.value}
            >
              <Radio.Content>
                <Radio.Control>
                  <Radio.Indicator />
                </Radio.Control>
                {option.label}
              </Radio.Content>
              <Description>{option.description}</Description>
            </Radio>
          ))}
        </div>
        <FieldError />
      </RadioGroup>

      {/* Only the fields that matter for the chosen option. */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {fulfilment === "delivery" && (
          <>
            <Field
              isRequired
              autoComplete="street-address"
              description="Town or site address."
              label="Delivery location"
              name="deliveryLocation"
            />
            <BranchSelect label="Nearest branch" placeholder="No preference" />
          </>
        )}
        {fulfilment === "collection" && (
          <BranchSelect isRequired label="Collect from" placeholder="Choose a branch" />
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
          {pending ? "Sending…" : `Send request (${items.length} item${items.length === 1 ? "" : "s"})`}
        </Button>
        {!ready && <span className="text-sm text-muted">Checking your list…</span>}
        {ready && items.length === 0 && (
          <span className="text-sm text-warning">Fix the items marked above to send your request.</span>
        )}
      </div>
    </Form>
  );
};
