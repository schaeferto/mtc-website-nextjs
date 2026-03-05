import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ApplicationData {
  activity: string;
  event: string;
  eventId: string;
  name: string;
  email: string;
  over18: boolean;
}

interface TrainingData {
  date: string;
  address: string;
  locationName: string;
  imageName?: string;
  trainingType: "swimming" | "running";
}

/**
 * Convert training type to German
 */
function getGermanTrainingType(trainingType: string): string {
  const trainingMap: Record<string, string> = {
    swimming: "Schwimmen",
    running: "Laufen",
  };
  return trainingMap[trainingType.toLowerCase()] || trainingType;
}

/**
 * Format date string to German format (dd.mm.yyyy HH:mm)
 */
function formatDateToGerman(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

/**
 * Validate that all required training data is available
 */
function validateTrainingData(training: TrainingData): void {
  const requiredFields: (keyof TrainingData)[] = [
    "date",
    "address",
    "locationName",
    "trainingType",
  ];

  for (const field of requiredFields) {
    if (!training[field]) {
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

    // Fetch training data from Strapi using eventId
    const trainingResponse = await fetch(
      `${strapiUrl}/api/trainings/${data.eventId}`,
      {
        headers: { Authorization: `Bearer ${strapiToken}` },
      },
    );

    if (!trainingResponse.ok) {
      throw new Error("Failed to fetch training data from Strapi");
    }

    const trainingData = await trainingResponse.json();
    const training = trainingData.data as TrainingData;

    if (!training) {
      throw new Error("Training not found in Strapi");
    }

    // Validate all required training data is available
    validateTrainingData(training);

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
      training.trainingType === "swimming" &&
      training.locationName.toLowerCase().includes("bogenhausen")
    ) {
      applicantTemplateName =
        "swimming_bogenhausen_trial_registration_confirmation";
    } else if (
      training.trainingType === "swimming" &&
      training.locationName.toLowerCase().includes("moosach")
    ) {
      applicantTemplateName =
        "swimming_moosach_trial_registration_confirmation";
    } else if (training.trainingType === "running") {
      applicantTemplateName =
        "running_olympiapark_trial_registration_confirmation";
    } else {
      throw new Error(
        `No email template configured for training type: ${training.trainingType} at ${training.locationName}`,
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

    // Format date to German format (yyyy-mm-dd HH:mm)
    const trainingDate = formatDateToGerman(training.date);
    const germanEventName = getGermanTrainingType(data.event);

    // Prepare variables for applicant email
    const applicantVariables = {
      "local.userName": data.name,
      "local.event": germanEventName,
      "strapi.date": trainingDate,
      "strapi.address": training.address,
    };

    // Prepare variables for admin notification
    const adminVariables = {
      "local.userName": data.name,
      "local.email": data.email,
      "local.event": germanEventName,
      "strapi.date": trainingDate,
      "strapi.address": training.address,
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
