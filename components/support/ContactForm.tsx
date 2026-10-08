"use client";

import { ChevronDown, Mail } from "lucide-react";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/docs/CopyButton";
import { cn } from "@/lib/utils";

export const contactTopics = [
  "Technical support",
  "License activation",
  "Buy a Professional license",
  "Billing and invoices",
  "Bug report",
  "Feature request",
  "Other",
] as const;

const platformOptions = ["Windows", "macOS", "Ubuntu", "Not applicable"] as const;

type Values = { name: string; email: string; topic: string; platform: string; message: string };
type FieldName = keyof Values;
type Errors = Partial<Record<FieldName, string>>;

const MESSAGE_MIN = 20;
const MESSAGE_MAX = 1500;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(v: Values): Errors {
  const errors: Errors = {};
  if (!v.name.trim()) errors.name = "Enter your name.";
  if (!v.email.trim()) errors.email = "Enter your email address.";
  else if (!EMAIL.test(v.email.trim())) errors.email = "Enter a valid email address, for example name@company.com.";
  if (!v.topic) errors.topic = "Choose the topic that fits best.";
  if (v.message.trim().length < MESSAGE_MIN)
    errors.message = `Describe your request in at least ${MESSAGE_MIN} characters so we can help on the first reply.`;
  return errors;
}

function compose(v: Values) {
  const subject = `[${v.topic}] ${v.name.trim()}`;
  const body = [
    `Name: ${v.name.trim()}`,
    `Email: ${v.email.trim()}`,
    `Topic: ${v.topic}`,
    v.platform ? `Platform: ${v.platform}` : null,
    "",
    v.message.trim(),
  ]
    .filter((line) => line !== null)
    .join("\n");
  return { subject, body };
}

const fieldOrder: FieldName[] = ["name", "email", "topic", "message"];

const controlClass =
  "w-full rounded-[10px] border border-line-strong bg-surface-1 px-3.5 text-[15px] text-fg placeholder:text-subtle transition-[border-color,box-shadow] duration-200 hover:border-white/20 focus:border-accent/70 focus:shadow-[0_0_0_3px_rgb(47_123_255/0.2)] focus-visible:outline-none aria-[invalid=true]:border-axis-x/60";

function Field({
  id,
  label,
  optional,
  hint,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  optional?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-sm font-medium text-fg">
        {label}
        {optional ? <span className="text-xs font-normal text-subtle">Optional</span> : null}
      </label>
      <div className="mt-2">{children}</div>
      {hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] text-axis-x">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Contact form without a backend: validates on the client, then opens the
 * visitor's email client with a pre-filled message to the support address.
 */
export function ContactForm({ email }: { email: string }) {
  const uid = useId();
  const ids = {
    name: `${uid}-name`,
    email: `${uid}-email`,
    topic: `${uid}-topic`,
    platform: `${uid}-platform`,
    message: `${uid}-message`,
  } satisfies Record<FieldName, string>;

  const [values, setValues] = useState<Values>({ name: "", email: "", topic: "", platform: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [attempted, setAttempted] = useState(false);
  const [composed, setComposed] = useState<{ subject: string; body: string } | null>(null);

  function update(name: FieldName, value: string) {
    const next = { ...values, [name]: value };
    setValues(next);
    // After the first submit, re-validate as the visitor corrects fields.
    if (attempted) setErrors(validate(next));
    if (composed) setComposed(null);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAttempted(true);
    const found = validate(values);
    setErrors(found);
    const firstInvalid = fieldOrder.find((f) => found[f]);
    if (firstInvalid) {
      document.getElementById(ids[firstInvalid])?.focus();
      return;
    }
    const message = compose(values);
    setComposed(message);
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(message.subject)}&body=${encodeURIComponent(message.body)}`;
  }

  const describedBy = (name: FieldName, hint = false) =>
    [hint ? `${ids[name]}-hint` : null, errors[name] ? `${ids[name]}-error` : null].filter(Boolean).join(" ") || undefined;

  const errorCount = Object.keys(errors).length;

  return (
    <form noValidate onSubmit={onSubmit} aria-describedby={`${uid}-note`} className="flex flex-col gap-5">
      <div role="alert">
        {attempted && errorCount > 0 ? (
          <p className="rounded-[10px] border border-axis-x/30 bg-axis-x/[0.07] px-4 py-3 text-sm text-fg">
            {errorCount === 1 ? "One field needs attention." : `${errorCount} fields need attention.`}
          </p>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={ids.name} label="Name" error={errors.name}>
          <input
            id={ids.name}
            name="name"
            type="text"
            autoComplete="name"
            required
            maxLength={80}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
            className={cn(controlClass, "h-12")}
          />
        </Field>
        <Field id={ids.email} label="Email" error={errors.email}>
          <input
            id={ids.email}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            maxLength={120}
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
            className={cn(controlClass, "h-12")}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={ids.topic} label="Topic" error={errors.topic}>
          <div className="relative">
            <select
              id={ids.topic}
              name="topic"
              required
              value={values.topic}
              onChange={(e) => update("topic", e.target.value)}
              aria-invalid={errors.topic ? true : undefined}
              aria-describedby={describedBy("topic")}
              className={cn(controlClass, "h-12 appearance-none pr-10", !values.topic && "text-muted")}
            >
              <option value="" disabled>
                Choose a topic
              </option>
              {contactTopics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          </div>
        </Field>
        <Field id={ids.platform} label="Platform" optional>
          <div className="relative">
            <select
              id={ids.platform}
              name="platform"
              value={values.platform}
              onChange={(e) => update("platform", e.target.value)}
              className={cn(controlClass, "h-12 appearance-none pr-10", !values.platform && "text-muted")}
            >
              <option value="">Select platform</option>
              {platformOptions.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
          </div>
        </Field>
      </div>

      <Field
        id={ids.message}
        label="Message"
        error={errors.message}
        hint={`Include your KufCad version and the steps that lead to the problem. ${values.message.length}/${MESSAGE_MAX}`}
      >
        <textarea
          id={ids.message}
          name="message"
          required
          rows={6}
          minLength={MESSAGE_MIN}
          maxLength={MESSAGE_MAX}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy("message", true)}
          className={cn(controlClass, "min-h-36 resize-y py-3 leading-relaxed")}
        />
      </Field>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id={`${uid}-note`} className="text-[13px] leading-relaxed text-muted sm:max-w-[300px]">
          Submitting opens your email client with the message filled in. Nothing is sent from this page.
        </p>
        <Button type="submit" size="lg" icon={<Mail aria-hidden className="size-4" />} className="w-full sm:w-auto">
          Open in email client
        </Button>
      </div>

      <div role="status" aria-live="polite">
        {composed ? (
          <div className="rounded-[12px] border border-accent/30 bg-accent-soft/60 p-4 sm:p-5">
            <p className="text-sm font-medium text-fg">Your email client should now be open.</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
              Review the message and press send. If no window appeared, copy the message and email it to{" "}
              <a href={`mailto:${email}`} className="text-accent-hover underline decoration-accent-hover/40 underline-offset-[3px]">
                {email}
              </a>
              .
            </p>
            <CopyButton
              value={`Subject: ${composed.subject}\n\n${composed.body}`}
              label="Copy message"
              className="-ml-2 mt-2"
            />
          </div>
        ) : null}
      </div>
    </form>
  );
}
