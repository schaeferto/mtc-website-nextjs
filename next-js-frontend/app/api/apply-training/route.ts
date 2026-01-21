import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ApplicationData {
  activity: string;
  event: string;
  eventId: string;
  name: string;
  email: string;
  age: string;
}

export async function POST(req: Request) {
  try {
    const data: ApplicationData = await req.json();

    // Validate required fields
    if (!data.name || !data.email || !data.age || !data.eventId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
    const strapiToken = process.env.STRAPI_API_TOKEN;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!strapiUrl || !strapiToken || !fromEmail || !adminEmail) {
      return Response.json(
        { error: "Server not properly configured" },
        { status: 500 },
      );
    }

    // Fetch email templates from Strapi
    const templatesResponse = await fetch(
      `${strapiUrl}/api/email-templates`,
      {
        headers: { Authorization: `Bearer ${strapiToken}` },
      },
    );

    if (!templatesResponse.ok) {
      throw new Error("Failed to fetch email templates from Strapi");
    }

    const templatesData = await templatesResponse.json();
    const templates = templatesData.data.reduce((acc: any, t: any) => {
      acc[t.name] = t;
      return acc;
    }, {});

    const applicantTemplate = templates.applicant_confirmation;
    const adminTemplate = templates.admin_notification;

    if (!applicantTemplate || !adminTemplate) {
      throw new Error("Email templates not found in Strapi");
    }

    // Helper function to render template with variables
    const renderTemplate = (
      html: string,
      variables: Record<string, string>,
    ) => {
      return Object.entries(variables).reduce((acc, [key, value]) => {
        return acc.replace(new RegExp(`{{${key}}}`, "g"), value);
      }, html);
    };

    const applicantHtml = renderTemplate(applicantTemplate.html, {
      name: data.name,
      event: data.event,
    });

    const adminHtml = renderTemplate(adminTemplate.html, {
      name: data.name,
      email: data.email,
      age: data.age,
      event: data.event,
      date: new Date().toLocaleString("de-DE"),
    });

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
      subject: adminTemplate.subject,
      html: adminHtml,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error processing application:", error);
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process application",
      },
      { status: 500 },
    );
  }
}
