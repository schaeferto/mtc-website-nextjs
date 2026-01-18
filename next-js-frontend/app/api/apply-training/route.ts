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

    // TODO Store Application in Strapi
    // // Save to Strapi
    // const applicationRes = await fetch(
    //   `${strapiUrl}/api/training-applications`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${strapiToken}`,
    //     },
    //     body: JSON.stringify({
    //       data: {
    //         name: data.name,
    //         email: data.email,
    //         age: parseInt(data.age),
    //         training: data.activity,
    //         event: data.eventId,
    //         applicationDate: new Date().toISOString(),
    //         status: "pending",
    //       },
    //     }),
    //   },
    // );

    // if (!applicationRes.ok) {
    //   const error = await applicationRes.json();
    //   console.error("Strapi error:", error);
    //   throw new Error("Failed to save application");
    // }

    // Send confirmation email to applicant
    await resend.emails.send({
      from: fromEmail,
      to: data.email,
      subject: "Probetraining Anmeldung bestätigt",
      html: `
        <h1>Hallo ${data.name},</h1>
        <p>vielen Dank für deine Anmeldung zum Probetraining im Bereich <strong>${data.event}</strong>!</p>
        <p>Wir freuen uns auf dich und werden dich in Kürze mit weiteren Informationen kontaktieren.</p>
        <p>Viele Grüße,<br/>Dein MTC Triathlon Team</p>
      `,
    });

    // Send notification email to admin
    await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: "Neue Probetraining Anmeldung",
      html: `
        <h1>Neue Anmeldung</h1>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>E-Mail:</strong> ${data.email}</p>
        <p><strong>Alter:</strong> ${data.age}</p>
        <p><strong>Sportart:</strong> ${data.event}</p>
        <p><strong>Datum:</strong> ${new Date().toLocaleString("de-DE")}</p>
      `,
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
