import type { SVGProps } from "react";

/**
 * Drawn to a shared 24px grid at 1.25 stroke, so the four pillars sit at the
 * same optical weight. Deliberately abstract rather than literal, and
 * deliberately not the emoji from the source document. See DESIGN.md §7, row 8.
 */
type IconProps = SVGProps<SVGSVGElement>;

function Frame({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

/** A child held in cupped hands. */
export function PaediatricIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <circle cx="12" cy="6.9" r="3.3" />
      <path d="M6.6 14.6c1.4-1.6 3.3-2.5 5.4-2.5s4 .9 5.4 2.5" />
      <path d="M3.3 16.2c1 3.1 4.5 5.3 8.7 5.3s7.7-2.2 8.7-5.3" />
    </Frame>
  );
}

/** A child carried, held inside a protecting arc. */
export function MaternityIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <circle cx="12.4" cy="13.8" r="6.3" />
      <circle cx="12.4" cy="14.8" r="2.3" />
      <path d="M5.6 7.6A8.6 8.6 0 0 1 13 3.2" />
    </Frame>
  );
}

/** Cycles — the recurring rhythms this speciality actually treats. */
export function WomensIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <circle cx="12" cy="9.4" r="5.1" />
      <path d="M12 14.5v6.9" />
      <path d="M9.2 18.7h5.6" />
    </Frame>
  );
}

/** A mind turning inward. */
export function MentalHealthIcon(props: IconProps) {
  return (
    <Frame {...props}>
      <circle cx="12" cy="12" r="8.3" />
      <path d="M12 16.5a4.5 4.5 0 0 1 0-9 3 3 0 0 1 0 6 1.9 1.9 0 0 1 0-3.8" />
    </Frame>
  );
}

const REGISTRY = {
  paediatric: PaediatricIcon,
  maternity: MaternityIcon,
  womens: WomensIcon,
  "mental-health": MentalHealthIcon,
} as const;

export function SpecialityIcon({
  name,
  ...props
}: IconProps & { name: string }) {
  const Icon = REGISTRY[name as keyof typeof REGISTRY] ?? PaediatricIcon;
  return <Icon {...props} />;
}
