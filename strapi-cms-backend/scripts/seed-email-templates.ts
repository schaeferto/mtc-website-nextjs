/**
 * Seed script to create default email templates
 * Run with: npm run seed:templates
 */


const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN || "";

const emailTemplates = [
  {
    name: "applicant_confirmation",
    subject: "Probetraining Anmeldung bestätigt",
    html: `<h1>Hallo {{name}},</h1>
<p>vielen Dank für deine Anmeldung zum Probetraining im Bereich <strong>{{event}}</strong>!</p>
<p>Wir freuen uns auf dich und werden dich in Kürze mit weiteren Informationen kontaktieren.</p>
<p>Viele Grüße,<br/>Dein MTC Triathlon Team</p>`,
  },
  {
    name: "admin_notification",
    subject: "Neue Probetraining Anmeldung",
    html: `<h1>Neue Anmeldung</h1>
<p><strong>Name:</strong> {{name}}</p>
<p><strong>E-Mail:</strong> {{email}}</p>
<p><strong>Alter:</strong> {{age}}</p>
<p><strong>Sportart:</strong> {{event}}</p>
<p><strong>Datum:</strong> {{date}}</p>`,
  },
];

async function seedEmailTemplates() {
  try {
    console.log("Starting email template seeding...");

    for (const template of emailTemplates) {
      try {
        // Check if template already exists
        const checkResponse = await fetch(
          `${STRAPI_URL}/api/email-templates?filters[name][$eq]=${template.name}`,
          {
            headers: {
              Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}`,
            },
          },
        );

        const existing: any = await checkResponse.json();

        if (existing.data && existing.data.length > 0) {
          console.log(`✓ Template "${template.name}" already exists`);
          continue;
        }

        // Create template
        const createResponse = await fetch(
          `${STRAPI_URL}/api/email-templates`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}`,
            },
            body: JSON.stringify({
              data: {
                name: template.name,
                subject: template.subject,
                html: template.html,
                publishedAt: new Date().toISOString(),
              },
            }),
          },
        );

        if (createResponse.ok) {
          console.log(`✓ Created template: "${template.name}"`);
        } else {
          const error = await createResponse.json();
          console.error(
            `✗ Failed to create template "${template.name}":`,
            error,
          );
        }
      } catch (error) {
        console.error(`✗ Error processing template "${template.name}":`, error);
      }
    }

    console.log("Email template seeding complete!");
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedEmailTemplates();
