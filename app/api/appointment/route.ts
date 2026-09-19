import { NextResponse } from "next/server";

import { appointmentSchema } from "@/lib/appointment-schema";

/**
 * ── STUB ─────────────────────────────────────────────────────────────────
 *
 * Validates the submission and returns success. It does not yet deliver the
 * enquiry anywhere.
 *
 * TODO: WIRE UP THE REAL ENDPOINT BEFORE LAUNCH.
 * Until this is done, a patient can complete the form, see a confirmation,
 * and nobody at the clinic will ever hear about it. That is worse than having
 * no form at all, so this must not ship as-is.
 *
 * Whatever it is wired to needs to handle:
 *   1. Delivery — email to the clinic inbox, a CRM, or the practice management
 *      system. Confirm to the patient only after delivery actually succeeds.
 *   2. Storage — this is patient health enquiry data. Decide where it is kept,
 *      who can read it, and how long it is retained, before collecting it.
 *   3. Rate limiting — the honeypot below stops naive bots and nothing else.
 *   4. Notification — the clinic needs to know within working hours, not
 *      whenever somebody next checks an inbox.
 *
 * Note this route is incompatible with `output: "export"`. If the site is
 * deployed as a static export, point the form at a hosted form service or a
 * serverless function instead and delete this file.
 */

/** The single success payload. Bots and people must receive the same bytes. */
const SUCCESS = {
  ok: true,
  stub: true,
  message:
    "Received. This endpoint is a stub and has not delivered the enquiry anywhere yet.",
} as const;

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed request." },
      { status: 400 },
    );
  }

  const parsed = appointmentSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please check the highlighted fields.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  // Honeypot: a filled `website` field means a bot. Drop the submission and
  // return the exact success payload a person would get — a distinguishable
  // response is a signal a bot can learn from.
  if (parsed.data.website) {
    return NextResponse.json(SUCCESS);
  }

  // Never log the submission body — it contains a name, a phone number and a
  // description of somebody's health concern.
  if (process.env.NODE_ENV !== "production") {
    console.info("[appointment] validated submission received (body not logged)");
  }

  // TODO: replace with real delivery, and only respond ok once it succeeded.
  return NextResponse.json(SUCCESS);
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Method not allowed." },
    { status: 405 },
  );
}
