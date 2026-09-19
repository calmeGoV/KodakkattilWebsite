"use client";

import { useMemo, useState } from "react";

import { DoctorCard } from "@/components/doctors/doctor-card";
import { Reveal } from "@/components/ui/reveal";
import type { ConsultationMode, Doctor, Speciality } from "@/types/content";
import { cn } from "@/lib/utils";

const MODES: { id: ConsultationMode; label: string }[] = [
  { id: "in-person", label: "In person" },
  { id: "teleconsultation", label: "Teleconsultation" },
];

/**
 * Filter by speciality and by consultation mode.
 *
 * Filters are plain toggle buttons in a labelled group rather than a custom
 * listbox — nothing here needs a popup, and a native button is the control a
 * screen reader and a thumb both handle best. The result count is announced
 * politely so a filter change is not silent for anyone.
 */
export function DoctorFilters({
  doctors,
  specialities,
}: {
  doctors: Doctor[];
  specialities: Speciality[];
}) {
  const [speciality, setSpeciality] = useState<string | null>(null);
  const [mode, setMode] = useState<ConsultationMode | null>(null);

  const filtered = useMemo(
    () =>
      doctors.filter((d) => {
        const bySpeciality =
          !speciality || d.specialities.includes(speciality as never);
        const byMode = !mode || d.consultationModes.includes(mode);
        return bySpeciality && byMode;
      }),
    [doctors, speciality, mode],
  );

  return (
    <div>
      <div className="grid gap-6 border-b border-accent/30 pb-8 lg:grid-cols-12">
        <fieldset className="lg:col-span-8">
          <legend className="label-caps text-accent-ink">Speciality</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            <FilterChip
              active={speciality === null}
              onClick={() => setSpeciality(null)}
            >
              All
            </FilterChip>
            {specialities.map((s) => (
              <FilterChip
                key={s.slug}
                active={speciality === s.slug}
                onClick={() => setSpeciality(s.slug)}
              >
                {s.name}
              </FilterChip>
            ))}
          </div>
        </fieldset>

        <fieldset className="lg:col-span-4">
          <legend className="label-caps text-accent-ink">Consultation</legend>
          <div className="mt-4 flex flex-wrap gap-2">
            <FilterChip active={mode === null} onClick={() => setMode(null)}>
              Any
            </FilterChip>
            {MODES.map((m) => (
              <FilterChip
                key={m.id}
                active={mode === m.id}
                onClick={() => setMode(m.id)}
              >
                {m.label}
              </FilterChip>
            ))}
          </div>
        </fieldset>
      </div>

      <p aria-live="polite" className="mt-6 text-sm text-ink-faint">
        {filtered.length} {filtered.length === 1 ? "doctor" : "doctors"}
        {speciality || mode ? " matching your filters" : ""}
      </p>

      {filtered.length > 0 ? (
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((d, i) => (
            <Reveal as="li" key={d.slug} index={i % 4} className="flex">
              <DoctorCard
                doctor={d}
                className="w-full"
                sizes="(max-width: 640px) 90vw, 22vw"
              />
            </Reveal>
          ))}
        </ul>
      ) : (
        <p className="mt-10 rounded-card border border-dashed border-accent/50 p-8 text-ink-muted">
          No doctor matches that combination. Try clearing one of the filters, or
          call us and we will point you to the right person.
        </p>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-cta border px-3.5 py-2 text-sm transition-colors duration-150",
        active
          ? "border-primary bg-primary text-surface"
          : "border-ink/20 text-ink-muted hover:border-accent hover:text-accent-ink",
      )}
    >
      {children}
    </button>
  );
}
