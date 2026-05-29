import { getPayload } from "payload";
import config from "@payload-config";
import { Resend } from "resend";
import type { EmailTemplate, Location } from "@/payload-types";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ApplicationData {
  activity: string;
  event: string;
  eventId: string;
  eventDate: string;
  eventAddress: string;
  locationName: string;
  discipline: "Schwimmen" | "Laufen";
  name: string;
  email: string;
  over18: boolean;
}

const renderTemplate = (html: string, vars: Record<string, string>) =>
  Object.entries(vars).reduce(
    (s, [k, v]) =>
      s.replace(new RegExp(`{{${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}}}`, "g"), v),
    html,
  );

export async function POST(req: Request) {
  try {
    const data: ApplicationData = await req.json();

    if (!data.name || !data.email || !data.eventId || data.over18 !== true) {
      return Response.json(
        { error: "Bitte füllen Sie alle erforderlichen Felder aus." },
        { status: 400 },
      );
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!fromEmail || !adminEmail) {
      return Response.json(
        { error: "Es ist ein Fehler bei der Verarbeitung Ihrer Anmeldung aufgetreten. Bitte versuchen Sie es später erneut." },
        { status: 500 },
      );
    }

    const payload = await getPayload({ config });

    const training = await payload.findByID({
      collection: "trainings",
      id: parseInt(data.eventId, 10),
      depth: 2,
    });

    const location = training.location as Location;
    const applicantTemplate = location.confirmationTemplate as EmailTemplate;

    const adminResult = await payload.find({
      collection: "email-templates",
      where: { name: { equals: "trial_registration_notification" } },
      limit: 1,
    });
    const adminTemplate = adminResult.docs[0] as EmailTemplate;

    if (!applicantTemplate || !adminTemplate) {
      throw new Error("Email templates missing from Payload");
    }

    const sharedVars = {
      name: data.name,
      event: data.event,
      date: data.eventDate,
      addresse: data.eventAddress,
    };

    await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: data.email,
        subject: applicantTemplate.subject,
        html: renderTemplate(applicantTemplate.html, sharedVars),
      }),
      resend.emails.send({
        from: fromEmail,
        to: adminEmail,
        subject: renderTemplate(adminTemplate.subject, { ...sharedVars, email: data.email }),
        html: renderTemplate(adminTemplate.html, { ...sharedVars, email: data.email }),
      }),
    ]);

    return Response.json({ success: true });
  } catch (err) {
    console.error("register-trial-training error:", err);
    return Response.json(
      { error: "Es ist ein Fehler bei der Verarbeitung Ihrer Anmeldung aufgetreten. Bitte versuchen Sie es später erneut." },
      { status: 500 },
    );
  }
}
