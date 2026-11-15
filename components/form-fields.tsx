import { Description, FieldError, Input, Label, ListBox, Select, TextArea, TextField } from "@heroui/react";

// The one field system for every form on the site (contact and RFQ, CI-85):
// HeroUI "secondary" fields, always-visible sentence-case labels, 44px
// controls, and the library's own placeholder contrast.

type FieldProps = {
  name: string;
  label: string;
  isRequired?: boolean;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  description?: string;
};

export const Field = ({ name, label, isRequired, type = "text", autoComplete, placeholder, description }: FieldProps) => (
  <TextField fullWidth isRequired={isRequired} name={name} type={type} variant="secondary">
    <Label>{label}</Label>
    <Input autoComplete={autoComplete} className="h-11" placeholder={placeholder} />
    {description && <Description>{description}</Description>}
    <FieldError />
  </TextField>
);

type TextAreaFieldProps = {
  name: string;
  label: string;
  isRequired?: boolean;
  placeholder?: string;
  defaultValue?: string;
  rows?: number;
};

export const TextAreaField = ({ name, label, isRequired, placeholder, defaultValue, rows = 6 }: TextAreaFieldProps) => (
  <TextField fullWidth defaultValue={defaultValue} isRequired={isRequired} name={name} variant="secondary">
    <Label>{label}</Label>
    <TextArea placeholder={placeholder} rows={rows} />
    <FieldError />
  </TextField>
);

type SelectFieldProps = {
  name: string;
  label: string;
  placeholder: string;
  options: { id: string; label: string }[];
  isRequired?: boolean;
  defaultSelectedKey?: string;
};

export const SelectField = ({ name, label, placeholder, options, isRequired, defaultSelectedKey }: SelectFieldProps) => (
  <Select
    fullWidth
    defaultSelectedKey={defaultSelectedKey || undefined}
    isRequired={isRequired}
    name={name}
    placeholder={placeholder}
    variant="secondary"
  >
    <Label>{label}</Label>
    <Select.Trigger className="h-11 min-h-11">
      <Select.Value />
      <Select.Indicator />
    </Select.Trigger>
    <FieldError />
    <Select.Popover>
      <ListBox>
        {options.map((option) => (
          <ListBox.Item key={option.id} id={option.id} textValue={option.label}>
            {option.label}
            <ListBox.ItemIndicator />
          </ListBox.Item>
        ))}
      </ListBox>
    </Select.Popover>
  </Select>
);

/**
 * "Who you are": full name, company, email and one phone number, in the same
 * order, wording and rules on every form (CI-85). Field names match
 * `identityShape` in lib/forms/identity.ts.
 */
export const IdentityFields = () => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
    <Field isRequired autoComplete="name" label="Full name" name="fullName" placeholder="John Smith" />
    <Field isRequired autoComplete="organization" label="Company" name="company" placeholder="Acme Ltd." />
    <Field
      isRequired
      autoComplete="email"
      label="Email"
      name="email"
      placeholder="john@example.com"
      type="email"
    />
    <Field isRequired autoComplete="tel" label="Phone" name="phone" placeholder="+267 71 234 567" type="tel" />
  </div>
);
