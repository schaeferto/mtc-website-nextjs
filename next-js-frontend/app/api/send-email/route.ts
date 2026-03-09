import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, subject, html } = await req.json();

    if (!email || !subject || !html) {
      return Response.json(
        { error: "Missing required fields: email, subject, html" },
        { status: 400 },
      );
    }

    if (!process.env.RESEND_FROM_EMAIL) {
      return Response.json(
        { error: "RESEND_FROM_EMAIL environment variable is not set" },
        { status: 500 },
      );
    }

    const response = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: email,
      subject: subject,
      html: html,
    });

    return Response.json(response, {
      status: response.error ? 400 : 200,
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
