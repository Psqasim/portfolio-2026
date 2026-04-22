"use client";

import { useState, type FormEvent } from "react";
import { Github, Linkedin, Mail, MapPin, Send, Twitter } from "lucide-react";
import { personal } from "@/data/personal";
import { FadeInSection } from "@/components/motion/FadeInSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlowCard } from "@/components/ui/GlowCard";
import { useToast } from "@/components/ui/Toast";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 100;
const MAX_MESSAGE = 4000;
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
const SUBMIT_TIMEOUT_MS = 8000;

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

function platformIcon(platform: string) {
  switch (platform) {
    case "github":
      return Github;
    case "linkedin":
      return Linkedin;
    case "x":
      return Twitter;
    case "email":
      return Mail;
    default:
      return Mail;
  }
}

export function Contact() {
  const { push } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const iconSocials = personal.socials.filter((s) => s.platform !== "email");

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "Name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!EMAIL_REGEX.test(email.trim())) next.email = "Please enter a valid email";
    if (!message.trim()) next.message = "Message is required";
    return next;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;
    const honeypot = (form.elements.namedItem("honeypot") as HTMLInputElement | null)?.value;
    if (honeypot) return;

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS);

    try {
      const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";
      const data = new FormData();
      data.append("access_key", accessKey);
      data.append("name", name.trim());
      data.append("email", email.trim());
      data.append("message", message.trim());
      data.append("from_name", "portfolio-2026");
      data.append("subject", `Portfolio contact: ${name.trim()}`);

      const res = await fetch(WEB3FORMS_ENDPOINT, {
        method: "POST",
        body: data,
        signal: controller.signal,
      });
      const body = (await res.json().catch(() => ({ success: false }))) as {
        success?: boolean;
        message?: string;
      };

      if (body.success === true) {
        push("success", "Thanks — your message is on its way.");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        const msg = body.message || "Something went wrong. Please try again.";
        if (typeof window !== "undefined" && typeof console !== "undefined") {
          console.warn("[contact] web3forms rejected:", msg);
        }
        push("error", msg);
      }
    } catch {
      push("error", "Network trouble — please retry.");
    } finally {
      window.clearTimeout(timeout);
      setSubmitting(false);
    }
  }

  return (
    <FadeInSection className="py-24">
      <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
        <SectionHeader title="Let's Build Something" id="contact" />
        <p className="mb-10 max-w-2xl text-[var(--color-text-muted)]">
          Looking for an AI engineer? Want to collaborate on an agent project? Just want to say
          salam? Drop a message.
        </p>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <GlowCard className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-[var(--color-accent-cyan)]" aria-hidden />
              <a
                href={`mailto:${personal.email}`}
                className="text-[var(--color-text)] hover:text-[var(--color-accent-pink)]"
              >
                {personal.email}
              </a>
            </GlowCard>
            <GlowCard className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-[var(--color-accent-purple)]" aria-hidden />
              <span>{personal.location}</span>
            </GlowCard>
            <div className="flex gap-3">
              {iconSocials.map((s) => {
                const Icon = platformIcon(s.platform);
                const isPlaceholder = s.href === "#";
                return (
                  <a
                    key={s.platform}
                    href={s.href}
                    target={isPlaceholder ? undefined : "_blank"}
                    rel={isPlaceholder ? undefined : "noopener noreferrer"}
                    aria-disabled={isPlaceholder || undefined}
                    data-placeholder={isPlaceholder ? "true" : undefined}
                    title={isPlaceholder ? "Coming soon" : s.label}
                    className={
                      "inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--color-border)] " +
                      (isPlaceholder
                        ? "cursor-not-allowed text-[var(--color-text-muted)] opacity-60"
                        : "text-[var(--color-text)] hover:border-[var(--color-accent-pink)] hover:text-[var(--color-accent-pink)]")
                    }
                    onClick={(event) => {
                      if (isPlaceholder) event.preventDefault();
                    }}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                    <span className="sr-only">{s.label}</span>
                  </a>
                );
              })}
            </div>
          </div>

          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
            <input
              type="text"
              name="honeypot"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute left-[-9999px] h-0 w-0 opacity-0"
            />
            <Field
              id="contact-name"
              label="Name"
              value={name}
              onChange={setName}
              maxLength={MAX_NAME}
              error={errors.name}
              autoComplete="name"
            />
            <Field
              id="contact-email"
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              error={errors.email}
              autoComplete="email"
            />
            <Field
              id="contact-message"
              label="Message"
              as="textarea"
              value={message}
              onChange={setMessage}
              maxLength={MAX_MESSAGE}
              counter
              error={errors.message}
            />
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 self-start rounded-md border border-[var(--color-accent-pink)]/50 bg-[var(--color-accent-pink)]/15 px-4 py-2 text-sm font-medium text-[var(--color-accent-pink)] hover:bg-[var(--color-accent-pink)]/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Send className="h-4 w-4" aria-hidden />
              {submitting ? "Sending…" : "Send"}
            </button>
          </form>
        </div>
      </div>
    </FadeInSection>
  );
}

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  error?: string;
  autoComplete?: string;
  counter?: boolean;
} & ({ as?: "input"; type?: string } | { as: "textarea"; type?: never });

function Field(props: FieldProps) {
  const { id, label, value, onChange, maxLength, error, autoComplete, counter } = props;
  const describedBy = error ? `${id}-error` : undefined;
  const base =
    "w-full rounded-md border bg-[var(--color-card)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-cyan)] " +
    (error
      ? "border-[color-mix(in_oklab,#ef4444_60%,transparent)]"
      : "border-[var(--color-border)]");
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
        {label}
      </label>
      {"as" in props && props.as === "textarea" ? (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          rows={5}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={base}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={"type" in props && props.type ? props.type : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={base}
        />
      )}
      <div className="flex items-center justify-between text-[11px]">
        {error ? (
          <span id={`${id}-error`} className="text-[color-mix(in_oklab,#ef4444_80%,white)]">
            {error}
          </span>
        ) : (
          <span />
        )}
        {counter && maxLength ? (
          <span className="text-[var(--color-text-muted)]">
            {value.length}/{maxLength}
          </span>
        ) : null}
      </div>
    </div>
  );
}
