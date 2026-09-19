import { z } from "zod";

export const CONSULTATION_MODES = ["in-person", "teleconsultation", "video-consultation"] as const;

export const CONCERN_OPTIONS = [
  { value: "paediatric-care", label: "My child" },
  { value: "maternity-care", label: "Pregnancy or after birth" },
  { value: "womens-care", label: "My own health" },
  { value: "mental-health", label: "Mental wellbeing" },
  { value: "other", label: "Something else" },
] as const;

/**
 * Kept deliberately short. Every additional required field on a medical
 * booking form is a reason for a worried parent to give up — the clinic can
 * ask for the rest on the phone.
 */
export const appointmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please tell us your name.")
    .max(120, "That name is too long."),

  phone: z
    .string()
    .trim()
    .min(7, "Please give a phone number we can reach you on.")
    .max(20, "That number looks too long.")
    .regex(/^[+0-9][0-9\s()-]*$/, "Please use digits, spaces, + or -."),

  email: z
    .union([z.string().trim().email("That email address does not look right."), z.literal("")])
    .optional(),

  concern: z.enum(
    CONCERN_OPTIONS.map((o) => o.value) as [string, ...string[]],
    { errorMap: () => ({ message: "Please choose what this is about." }) },
  ),

  mode: z.enum(CONSULTATION_MODES, {
    errorMap: () => ({ message: "Please choose in person, teleconsultation, or video consultation." }),
  }),

  doctor: z.string().trim().max(80).optional(),
  packageSlug: z.string().trim().max(80).optional(),

  preferredDate: z.string().trim().max(40).optional(),

  message: z
    .string()
    .trim()
    .max(1200, "Please keep this under 1200 characters.")
    .optional(),

  consent: z.literal(true, {
    errorMap: () => ({
      message: "Please confirm we may contact you about this enquiry.",
    }),
  }),

  /**
   * Honeypot. Bots fill it; people never see it.
   *
   * Deliberately NOT constrained to empty here. If the schema rejected it, the
   * 422 response would name the field in its error list and hand a bot the
   * exact thing to leave blank next time. Validation lets it through and the
   * route discards the submission with a normal-looking success instead.
   */
  website: z.string().optional(),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
