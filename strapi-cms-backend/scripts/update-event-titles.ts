
/**
 * Script to update existing event titles
 * Run with: ts-node -r dotenv/config scripts/update-event-titles.ts
 */

const STRAPI_URL_LOCAL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_ADMIN_TOKEN_LOCAL = process.env.STRAPI_ADMIN_TOKEN || "";

async function updateEventTitles() {
    try {
        console.log("Fetching events...");
        const res = await fetch(`${STRAPI_URL_LOCAL}/api/events?populate=training`, {
            headers: {
                Authorization: `Bearer ${STRAPI_ADMIN_TOKEN_LOCAL}`,
            },
        });

        const json = (await res.json()) as any;
        const events = json.data;

        if (!events) {
            console.log("No events found or error in response:", json);
            return;
        }

        console.log(`Found ${events.length} events...`);

        for (const event of events) {
            if (!event.training) {
                console.log(`Skipping event ${event.id}: No training linked`);
                continue;
            }

            const date = new Date(event.date);
            const formattedDate = date.toLocaleDateString('de-DE', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
            });

            const title = `${event.training.title} - ${formattedDate}`;

            console.log(`Updating event ${event.id} with title: ${title}`);

            const updateRes = await fetch(`${STRAPI_URL_LOCAL}/api/events/${event.documentId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${STRAPI_ADMIN_TOKEN_LOCAL}`,
                },
                body: JSON.stringify({
                    data: {
                        title: title,
                    },
                }),
            });

            if (updateRes.ok) {
                console.log(`✓ Updated event ${event.id}`);
            } else {
                const error = await updateRes.json();
                console.error(`✗ Failed to update event ${event.id}:`, error);
            }
        }

        console.log("Migration complete!");
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

updateEventTitles();

export { };
