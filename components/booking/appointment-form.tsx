"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import {
  CONCERN_OPTIONS,
  appointmentSchema,
  type AppointmentInput,
} from "@/lib/appointment-schema";
import { getDoctor, orderedDoctors, packages } from "@/lib/content";
import { cn, isTodo } from "@/lib/utils";

type Status = "idle" | "submitting" | "sent" | "error";

const field =
  "w-full rounded-sm border border-ink/20 bg-surface px-4 py-3 text-ink " +
  "transition-colors duration-150 placeholder:text-ink-faint/70 " +
  "focus:border-accent focus:outline-none";

export function AppointmentForm() {
  const params = useSearchParams();
  const presetDoctor = params.get("doctor") ?? "";
  const presetPackage = params.get("package") ?? "";

  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const doctors = orderedDoctors().filter((d) => !isTodo(d.name));
  const preset = presetDoctor ? getDoctor(presetDoctor) : undefined;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentInput>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      concern: preset?.specialities[0] ?? "paediatric-care",
      mode: "in-person",
      doctor: presetDoctor,
      packageSlug: presetPackage,
      preferredDate: "",
      message: "",
      website: "",
    },
  });

  const onSubmit = async (values: AppointmentInput) => {
    setStatus("submitting");
    setServerError(null);
    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setServerError(data.error ?? "Something went wrong. Please call us instead.");
        setStatus("error");
        return;
      }
      setStatus("sent");
      reset();
    } catch {
      setServerError(
        "We could not send that. Please call or WhatsApp us and we will book you in.",
      );
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div
        role="status"
        className="rounded-card border border-accent/50 bg-surface-raised p-8"
      >
        <h2 className="font-display text-2xl font-semibold text-ink">
          Thank you — we have your request.
        </h2>
        <p className="mt-4 max-w-[52ch] text-ink-muted">
          Someone from the clinic will call you back during working hours. If it
          is urgent, please phone us rather than waiting.
        </p>
        <PlaceholderBadge
          className="mt-6"
          label="STUB — /api/appointment does not deliver this anywhere yet"
        />
        <Button
          intent="ghost"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          Send another request
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-7">
      {preset && (
        <p className="rounded-card border border-accent/40 bg-primary-tint px-4 py-3 text-sm text-primary">
          Booking with <strong className="font-semibold">{preset.name}</strong>.
        </p>
      )}

      {/* Honeypot. Hidden from people, offered to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <Field label="Your name" id="name" error={errors.name?.message} required>
        <input
          id="name"
          type="text"
          autoComplete="name"
          className={field}
          aria-invalid={!!errors.name}
          {...register("name")}
        />
      </Field>

      <div className="grid gap-7 sm:grid-cols-2">
        <Field label="Phone" id="phone" error={errors.phone?.message} required>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+91"
            className={field}
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
        </Field>

        <Field
          label="Email"
          id="email"
          error={errors.email?.message}
          hint="Optional"
        >
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={field}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </Field>
      </div>

      <Field
        label="Who is this appointment for?"
        id="concern"
        error={errors.concern?.message}
        required
      >
        <select id="concern" className={field} {...register("concern")}>
          {CONCERN_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </Field>

      <fieldset>
        <legend className="label-caps text-accent-ink">
          Consultation <span className="text-danger">*</span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-3">
          {[
            { v: "in-person", l: "In person" },
            { v: "teleconsultation", l: "Teleconsultation" },
            { v: "video-consultation", l: "Video consultation" },
          ].map((o) => (
            <label
              key={o.v}
              className="flex cursor-pointer items-center gap-2.5 rounded-cta border border-ink/20 px-4 py-3 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary-tint"
            >
              <input
                type="radio"
                value={o.v}
                className="accent-[var(--color-primary)]"
                {...register("mode")}
              />
              <span className="text-sm">{o.l}</span>
            </label>
          ))}
        </div>
        {errors.mode && (
          <p className="mt-2 text-sm text-danger">{errors.mode.message}</p>
        )}
      </fieldset>

      <div className="grid gap-7 sm:grid-cols-2">
        <Field label="Preferred doctor" id="doctor" hint="Optional">
          <select id="doctor" className={field} {...register("doctor")}>
            <option value="">No preference</option>
            {doctors.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Preferred date" id="preferredDate" hint="Optional">
          <input id="preferredDate" type="date" className={field} {...register("preferredDate")} />
        </Field>
      </div>

      {presetPackage && (
        <Field label="Programme" id="packageSlug" hint="Pre-selected">
          <select id="packageSlug" className={field} {...register("packageSlug")}>
            <option value="">None</option>
            {packages.items.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </Field>
      )}

      <Field
        label="What is worrying you?"
        id="message"
        error={errors.message?.message}
        hint="Optional — a sentence is enough"
      >
        <textarea id="message" rows={5} className={cn(field, "resize-y")} {...register("message")} />
      </Field>

      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            className="mt-1 accent-[var(--color-primary)]"
            aria-invalid={!!errors.consent}
            {...register("consent")}
          />
          <span className="text-sm text-ink-muted">
            I agree that the clinic may contact me about this enquiry. My details
            will not be used for anything else.{" "}
            <span className="text-danger">*</span>
          </span>
        </label>
        {errors.consent && (
          <p className="mt-2 text-sm text-danger">{errors.consent.message}</p>
        )}
      </div>

      {serverError && (
        <p role="alert" className="rounded-card border border-danger/50 bg-danger/10 px-4 py-3 text-sm text-danger">
          {serverError}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" intent="action" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Request an appointment"}
        </Button>
        <PlaceholderBadge label="STUB ENDPOINT — see app/api/appointment/route.ts" />
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  error,
  hint,
  required,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="label-caps flex items-center gap-2 text-accent-ink">
        {label}
        {required && <span className="text-danger">*</span>}
        {hint && <span className="font-normal normal-case tracking-normal text-ink-faint">({hint})</span>}
      </label>
      <div className="mt-2">{children}</div>
      {error && (
        <p className="mt-2 text-sm text-danger">{error}</p>
      )}
    </div>
  );
}
