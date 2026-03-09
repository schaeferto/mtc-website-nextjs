/**
 * Seed script to create default email templates
 * Run with: npm run import:templates [--prod]
 * --prod uses PROD_STRAPI_URL and PROD_STRAPI_ADMIN_TOKEN environment variables
 */

// Check for --prod flag
const isProd = process.argv.includes("--prod");
const envPrefix = isProd ? "PROD_" : "";
const environment = isProd ? "production" : "local development";

const STRAPI_URL =
  process.env[`${envPrefix}STRAPI_URL`] || "http://localhost:1337";
const STRAPI_ADMIN_TOKEN = process.env[`${envPrefix}STRAPI_ADMIN_TOKEN`] || "";

if (!STRAPI_ADMIN_TOKEN) {
  console.error(
    `Error: ${envPrefix}STRAPI_ADMIN_TOKEN environment variable is required.`,
  );
  process.exit(1);
}

console.log(`Running in ${environment} mode using ${STRAPI_URL}`);

const emailTemplates = [
  {
    name: "swimming_bogenhausen_trial_registration_confirmation",
    subject: "Probetraining zum Schwimmen in Bogenhausen",
    html: `<h1>Hi {{name}},</h1>
<p>schön, dass du auf uns aufmerksam geworden bist. 
Hiermit bestätige ich deine Anmeldung zum Probetraining fürs <strong>{{event}}</strong> am <strong>{{date}}</strong>!</p>
<p>Wir schwimmen im Schulschwimmbad in der Ruth-Drexel-Straße 21 (das ist der Seiteneingang der Grundschule dort. Achtung: Google Maps will einen immer zum Haupteingang Nr. 27 leiten). Wir treffen uns um 20:15 Uhr alle vor dem Tor dort und gehen um ca. 20:20 gemeinsam rein. </p>
<p>Bitte bring Pull Boye und Paddles mit, falls du hast.</p>
<p>Voraussetzung ist, dass du 400m am Stück in 10 Minuten kraulen kannst.</p>
Falls das nicht der Fall ist oder du doch nicht am Probetraining teilnehmen kannst, gib uns zur Stornierung deiner Anmeldung bitte per Mail an munichtriathlonclub@gmail.com Bescheid. Bei weiteren Fragen kannst du dich auch gerne melden.</p>
<p>Wir freuen uns auf dich!</p>
<p>Viele Grüße,<br/>dein MTC Team</p>`,
  },
  {
    name: "swimming_moosach_trial_registration_confirmation",
    subject: "Probetraining zum Schwimmen in Moosach",
    html: `<h1>Hi {{name}},</h1>
<p>schön, dass du auf uns aufmerksam geworden bist. 
Hiermit bestätige ich deine Anmeldung zum Probetraining fürs <strong>{{event}}</strong> am <strong>{{date}}</strong>!</p>
<p>Wir schwimmen im Schulschwimmbad (Amphionbad/Welzenbachbad) in der Templestraße 20 (der Zugang zur Schwimmhalle erfolgt über die Templestraße, ums Eck vom Haupteingang der Grundschule in der Welzenbachstraße 12). Wir treffen uns um 19:15 Uhr alle vor dem Bad und gehen um ca. 19:20 gemeinsam rein.</p>
<p>Bitte bring Pull Boye und Paddles mit, falls du hast.</p>
<p>Voraussetzung ist, dass du 400m in 10 Minuten am Stück kraulen kannst.</p>
Falls das nicht der Fall ist oder du doch nicht am Probetraining teilnehmen kannst, gib uns zur Stornierung deiner Anmeldung bitte per Mail an munichtriathlonclub@gmail.com Bescheid. Bei weiteren Fragen kannst du dich auch gerne melden.</p>
<p>Wir freuen uns auf dich!</p>
<p>Viele Grüße,<br/>dein MTC Team</p>`,
  },
  {
    name: "running_olympiapark_trial_registration_confirmation",
    subject: "Probetraining zum Laufen im Olympiapark",
    html: `<h1>Hi {{name}},</h1>
<p>schön, dass du auf uns aufmerksam geworden bist. 
Hiermit bestätige ich deine Anmeldung zum Probetraining fürs <strong>{{event}}</strong> am <strong>{{date}}</strong>!</p>
<p>Wir treffen uns um 18:15 Uhr bei gutem Wetter vor und bei schlechtem/kalten Wetter in der BMW Welt Richtung Brundegaplatz/U-Bahn. Unten bei den Schließfächern in der BMW Welt kannst du auch etwas einsperren. Um 18:30 laufen wir gemeinsam los und laufen uns ein, danach folgt ein Lauf-ABC und im Anschluss die Intervalle.</p>
<p>Falls du doch nicht am Probetraining teilnehmen kannst, gib uns zur Stornierung deiner Anmeldung bitte per Mail an munichtriathlonclub@gmail.com Bescheid. Bei weiteren Fragen kannst du dich auch gerne melden.</p>
<p>Wir freuen uns auf dich!</p>
<p>Viele Grüße,<br/>dein MTC Team</p>`,
  },
  {
    name: "trial_registration_notification",
    subject: "Neue Anmeldung zum Probetraining: {{event}} am {{date}}",
    html: `<h1>Neue Anmeldung zum Probetraining</h1>
<p><strong>Training:</strong> {{event}}</p>
<p><strong>Adresse:</strong> {{addresse}}</p>
<p><strong>Datum:</strong> {{date}}</p>
<p><strong>Name:</strong> {{name}}</p>
<p><strong>E-Mail:</strong> {{email}}</p>`,
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
