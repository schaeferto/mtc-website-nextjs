import { Resend } from "resend";
import { formatDateForEmail } from "../../utils/date-utils";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ApplicationData {
  activity: string;
  event: string;
  eventId: string;
  eventDate: string;
  eventAddress: string;
  locationName: string;
  trainingType: "Schwimmen" | "Laufen";
  name: string;
  email: string;
  over18: boolean;
}

/**
 * Validate that all required training data is available
 */
function validateTrainingData(data: ApplicationData): void {
  const requiredFields: (keyof ApplicationData)[] = [
    "eventDate",
    "eventAddress",
    "locationName",
    "trainingType",
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(
        `Missing required training data: ${field}. Cannot process application.`,
      );
    }
  }
}

export async function POST(req: Request) {
  try {
    const data: ApplicationData = await req.json();

    // Validate required fields
    if (!data.name || !data.email || !data.eventId || data.over18 !== true) {
      return Response.json(
        { error: "Bitte füllen Sie alle erforderlichen Felder aus." },
        { status: 400 },
      );
    }

    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const strapiToken = process.env.STRAPI_API_TOKEN;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!strapiUrl || !strapiToken || !fromEmail || !adminEmail) {
      console.error(
        "Server configuration error: missing environment variables",
      );
      return Response.json(
        {
          error:
            "Es ist ein Fehler bei der Verarbeitung Ihrer Anmeldung aufgetreten. Bitte versuchen Sie es später erneut.",
        },
        { status: 500 },
      );
    }

    // Validate all required training data is available
    validateTrainingData(data);

    // Format the date for email display
    const formattedDate = formatDateForEmail(data.eventDate);

    // Fetch email templates from Strapi
    const templatesResponse = await fetch(`${strapiUrl}/api/email-templates`, {
      headers: { Authorization: `Bearer ${strapiToken}` },
    });

    if (!templatesResponse.ok) {
      throw new Error("Failed to fetch email templates from Strapi");
    }

    const templatesData = await templatesResponse.json();
    const templates = templatesData.data.reduce((acc: any, t: any) => {
      acc[t.name] = t;
      return acc;
    }, {});

    // Select applicant template based on trainingType and locationName
    let applicantTemplateName = "";
    if (
      data.trainingType === "Schwimmen" &&
      data.locationName.toLowerCase().includes("bogenhausen")
    ) {
      applicantTemplateName =
        "swimming_bogenhausen_trial_registration_confirmation";
    } else if (
      data.trainingType === "Schwimmen" &&
      data.locationName.toLowerCase().includes("moosach")
    ) {
      applicantTemplateName =
        "swimming_moosach_trial_registration_confirmation";
    } else if (data.trainingType === "Laufen") {
      applicantTemplateName =
        "running_olympiapark_trial_registration_confirmation";
    } else {
      throw new Error(
        `No email template configured for training type: ${data.trainingType} at ${data.locationName}`,
      );
    }

    const applicantTemplate = templates[applicantTemplateName];
    const adminTemplate = templates.trial_registration_notification;

    if (!applicantTemplate || !adminTemplate) {
      throw new Error(
        `Email templates not found in Strapi. Looking for: ${applicantTemplateName} and trial_registration_notification`,
      );
    }

    // Helper function to render template with variables
    const renderTemplate = (
      html: string,
      variables: Record<string, string>,
    ) => {
      return Object.entries(variables).reduce((acc, [key, value]) => {
        // Escape special regex characters in the key
        const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        return acc.replace(new RegExp(`{{${escapedKey}}}`, "g"), value);
      }, html);
    };

    // Prepare variables for applicant email
    const applicantVariables = {
      name: data.name,
      event: data.event,
      date: formattedDate,
      addresse: data.eventAddress,
    };

    // Prepare variables for admin notification
    const adminVariables = {
      name: data.name,
      email: data.email,
      event: data.event,
      date: formattedDate,
      addresse: data.eventAddress,
    };

    const applicantHtml = renderTemplate(
      applicantTemplate.html,
      applicantVariables,
    );
    const adminHtml = renderTemplate(adminTemplate.html, adminVariables);
    const adminSubject = renderTemplate(adminTemplate.subject, adminVariables);

    // Send confirmation email to applicant
    await resend.emails.send({
      from: fromEmail,
      to: data.email,
      subject: applicantTemplate.subject,
      html: applicantHtml,
    });

    // Send notification email to admin
    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: adminSubject,
      html: adminHtml,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error processing application:", error);
    return Response.json(
      {
        error:
          "Es ist ein Fehler bei der Verarbeitung Ihrer Anmeldung aufgetreten. Bitte versuchen Sie es später erneut.",
      },
      { status: 500 },
    );
  }
}
