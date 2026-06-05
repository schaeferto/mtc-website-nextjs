/**
 * Import all static news articles into the Payload `articles` collection.
 *
 * Run from next-js-frontend/:
 *   pnpm import:news
 *
 * Idempotent: re-running skips articles whose header already exists.
 * Images are uploaded to the `news-media` collection under the `news/` R2 prefix.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getPayload } from "payload";
import config from "@payload-config";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, "../public");

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };
  return map[ext] ?? "application/octet-stream";
}

async function uploadNewsMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  relPath: string,
  altText: string,
): Promise<number | null> {
  const imagePath = path.join(PUBLIC_DIR, relPath);
  if (!fs.existsSync(imagePath)) {
    console.warn(`  ⚠ Image not found: ${imagePath} — skipping`);
    return null;
  }

  const filename = path.basename(relPath);

  const existing = await payload.find({
    collection: "news-media",
    where: { filename: { equals: filename } },
    limit: 1,
  });
  if (existing.docs[0]) {
    console.log(`  news-media "${filename}" already exists (id ${existing.docs[0].id})`);
    return existing.docs[0].id;
  }

  const fileBuffer = fs.readFileSync(imagePath);
  const doc = await payload.create({
    collection: "news-media",
    data: { alt: altText },
    file: {
      data: fileBuffer,
      mimetype: getMimeType(filename),
      name: filename,
      size: fileBuffer.length,
    },
  });
  console.log(`  ✓ Uploaded news-media "${filename}" (id ${doc.id})`);
  return doc.id;
}

function toISODate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00.000Z").toISOString();
}

function textToLexical(paragraphs: string[]): SerializedEditorState {
  return {
    root: {
      type: "root",
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
      children: paragraphs.map((text) => ({
        type: "paragraph",
        format: "" as const,
        indent: 0,
        version: 1,
        direction: "ltr" as const,
        textFormat: 0,
        textStyle: "",
        children: [
          {
            mode: "normal" as const,
            text,
            type: "text",
            format: 0 as const,
            detail: 0,
            style: "",
            version: 1,
          },
        ],
      })),
    },
  };
}

// ---------------------------------------------------------------------------
// Source data — mirrors the static article files
// ---------------------------------------------------------------------------

type ArticleRecord = {
  header: string;
  text: string[];
  date?: string;
  releaseDate?: string;
  imageFile: string;
  extraImages?: string[];
};

const articles: ArticleRecord[] = [
  {
    header: "Schwimmtrainingslager in Oberhaching",
    date: "2024-01-10",
    imageFile: "news_swim_camp.jpg",
    text: [
      "Beim Schwimmtrainingslager in Oberhaching waren die Biber in ihrem Element. Von Freitag bis Sonntag sind wir geschwommen bis die Arme abgefallen sind. Damit nicht genug, gab es zusätzlich natürlich noch ein bisschen Stabitraining. Rumpf ist Trumpf sozusagen. Zwischendrin gab es dann Videoanalysen, Kickerpartien und jede Menge biberstarke Geselligkeit.",
      "Wir freuen uns auf die anstehende Saison!",
    ],
  },
  {
    header: "100 x 100 im Olympiabad",
    date: "2024-01-24",
    imageFile: "news_100x100.jpg",
    text: [
      "Einmal ist kein Mal. Zwei Mal ist eine Tradition…",
      "Jedes Jahr im Januar kommt jemand auf die verrückte Idee: „Leute, wer hat Bock auf 100x100 schwimmen?\" Vorher finden es alle geil, währenddessen sind alle am jammern, hinterher finden es alle noch ein bisschen geiler.",
      "Next year again?",
    ],
  },
  {
    header: "Challenge Roth 2024",
    date: "2024-07-07",
    imageFile: "challenge_news.jpg",
    text: [
      "Am ersten Juli-Wochenende stand für einige unserer Biber das Saisonhighlight an. Bei der Challenge Roth gingen Valentin, Jens und Anne an den Start. Valentin schaffte seine Bestzeit auf der Langdistanz und Jens feierte in Roth sein Langdistanz-Debüt. Wo ginge das besser, als bei dem weltweit größten Wettkampf auf der Triathlon-Langdistanz.",
    ],
  },
  {
    header: "Landesliga Süd Damen Schongau",
    date: "2024-07-21",
    imageFile: "schongau_news.jpg",
    text: [
      "Unsere Biber-Damen haben die Ligasaison eröffnet und am vergangenen Wochenende haben sie sie auch in Schongau beendet. Es war uns ein Fest! Bei strahlendem Sonnenschein und unter stürmischem Biber-Jubel gingen Janet, Lisa, Vicky und Anne an den Start. Die dritte Person im Ziel wurde gewertet, also war eine Team-Strategie gefragt. Wie so oft, musste die flexibel noch einmal angepasst werden. Ins Ziel gekommen sind sie aber alle!",
    ],
  },
  {
    header: "Allgäu Triathlon 2024",
    date: "2024-08-18",
    imageFile: "allgaeu_news.jpg",
    text: [
      "Es war ein Spektakel. Der Allgäu Triathlon 2024. Unsere Biber waren auf der Mitteldistanz und der Olympischen Distanz unterwegs. Was alle gemeinsam hatten: Sie wurden plörre nass. Inklusive der Biber-Fans am Rand. Da half die beste Regenjacke nicht. Am Ende schafften es drei Biber sogar aufs Podium!",
    ],
  },
  {
    header: "Ironman 70.3 World Championships 2024",
    date: "2024-12-14",
    imageFile: "neuseeland.jpg",
    text: [
      "Im Dezember fanden die Ironman 70.3 World Championships in Taupo, Neuseeland statt. Mit (vierfacher) Biberbeteiligung war der späte Saisonabschluss unter der brennenden Sonne ein absolutes Highlightrennen.",
      "Am Samstag startete Anne beim Damenrennen. Holger, Carsten und Valentin folgten ihr am Sonntag beim Herrenrennen. Zwischen den beiden Letzteren entwickelte sich ein spannender Wettkampf. Wer wohl als Erster die Ziellinie überqueren würde? Am Ende lieferten sie sich ein Kopf-an-Kopf-Rennen und überquerten gemeinsam die Ziellinie",
      "Fazit: Es war ein grandioses Rennen! Die atemberaubende Landschaft, die unglaublich freundlichen und hilfsbereiten Volunteers, die großartige Stimmung und natürlich der biberstarke Zusammenhalt unseres Teams haben das Wochenende zu einem unvergesslichen Event gemacht.",
    ],
  },
  {
    header: "Trainingslager Toskana 2025",
    date: "2025-04-06",
    releaseDate: "2025-10-26",
    imageFile: "news_toskana.jpg",
    text: [
      "Eine Woche Sommer. Eine Woche Training. Eine Woche biberstarke Zeit. 🤩  Für 18 unserer Biber ging es letzte Woche in die Toskana. Es wurde geradelt bis die Beine abgefallen sind und geschlemmt was Bella Italia zu bieten hatte. 😋 Was für ein starker erster Trainingslager-Auftakt, der unbedingt nach Wiederholung schreit. 🤩",
    ],
  },
  {
    header: "Liga Auftakt",
    date: "2025-05-10",
    releaseDate: "2025-10-26",
    imageFile: "liga_auftakt.jpg",
    text: [
      "Vergangenes Wochenende fand der Liga-Auftakt in Weiden statt. 🤩 Diesmal ging es sowohl für die Herren als auch die Damen in der Bayernliga an den Start.",
      "Bei strahlendem Sonnenschein gab es in der Früh ein Einzelrennen, aus der daraus resultierenden Mannschaftswertung dann am Nachmittag das Verfolgungs-Rennen. Supersprint, also 400m schwimmen, 9km Rad fahren und 1,7km am Morgen sowie 3,4 km am Nachmittag laufen. Kurz gesagt: Eine richtige Laktatparty. 🫣",
      "Unsere frisch aufgestiegenen Männer konnten den 4. Platz behaupten, während die Damen sich Platz 1 erkämpften und den Saisonstart perfekt machten🥇😎 Was für ein Auftakt! 💪🏻",
    ],
  },
  {
    header: "Raceday bei der Landesliga Oberschleißheim",
    date: "2025-05-25",
    releaseDate: "2025-10-26",
    imageFile: "news_liga_h_oberschleissheim.jpg",
    text: [
      "Die Biber-Herren bei der Landesliga Süd an der Ruderregatta in Oberschleißheim. 💪🏻 Das Wetter hätte besser sein können 🌧, aber das hat dem Racefieber keinen Abbruch getan. 🤩",
      "Am Ende schafften wir es auf Platz 3. Starke Leistung Jungs!",
    ],
  },
  {
    header: "Raceday bei der Landesliga am Ammersee",
    date: "2025-07-12",
    releaseDate: "2025-10-26",
    imageFile: "news_liga_h_ammersee.jpg",
    text: [
      "Während die Bayernliga in Hof im Regen stand, konnte die Landesliga Herren am Ammersee bei strahlendem Sonnenschein an den Start gehen. ☀ Glück gehabt. Weniger anstrengend war es deshalb aber nicht. Am Ende konnten sich die Jungs Platz 3 sichern. 🤩",
    ],
  },
  {
    header: "Raceday bei der Bayernliga in Hof",
    date: "2025-07-13",
    releaseDate: "2025-10-26",
    imageFile: "news_liga_mixed_hof.jpg",
    text: [
      "2 Tage geballte Biber-Power in Hof 🤫💥 Während in München strahlender Sonnenschein war, mussten unsere Liga Damen und Herren in Hof sich bei Regen und Kälte selbst einheizen. Samstag ging es für je drei Teammitglieder über die Staffel-Supersprint-Distanz. Nacheinander 200m schwimmen, 5km Rad fahren und 1,5km laufen. Laktatparty pur 😎 Nach diesem kleinen ‚Warmup' folgte dann am Sonntag die Kurzdistanz. 💪🏻",
      "Abgeliefert wurde dann sogar an beiden Tagen. 🤩Unsere Damen konnten erfolgreich jeweils Platz 1 sichern und die Herren jeweils Platz 2. 🥇🥈 Und weil das noch nicht reichte, gewann Jasper gleich auch noch das Rennen Overall in der Bayernliga Herren und Katrin sicherte Platz 3 bei den Damen. 🤩",
    ],
  },
  {
    header: "Raceday bei der Bayernliga in Schongau",
    date: "2025-07-27",
    releaseDate: "2025-10-26",
    imageFile: "news_liga_mixed_schongau.jpg",
    text: [
      "Grande Finale 😎 Für die Biberdamen und -herren der Bayernliga ging es heute in Schongau zum letzten Mal für diese Saison an den Start. 🤗 Die Vorraussetzungen waren nicht gerade rosig. Duathlon statt Traithlon, Verletzungen, fehlendes Fahrrad, Regenaussichten… doch dann wurde es wieder grandios! 😃 Das Wetter spielte zur richtigen Zeit mit und das Podium wurde auch wieder erklommen. Für die Damen war es Sieg 4 von 4 🤩 Die Herren landeten auf Platz 2. Damit hieß es  für beide Mannschaften: Saisonsieg! 🤩",
    ],
  },
  {
    header: "Raceday im Allgäu",
    date: "2025-08-17",
    releaseDate: "2025-10-26",
    imageFile: "news_allgaeu.jpg",
    text: [
      "Viele Biber sind dieses Jahr beim Allgäu Triathlon an den Start gegangen. Sowohl auf der Classic, als auch der Olympischen Distanz. 🤩 Der anfängliche Regen 🌧 ließ zum Glück schnell nach und so konnte bei bestem Wetter geracet werden. Bis auf einen Sturz, der zum Glück im Großen und Ganzen glimpflich ausgegangen ist, sind alle zufrieden ins Ziel gekommen. 🤩 Drei Podiumsplätze gab es schließlich auch noch. Herzlichen Glückwunsch an alle Raceraketen! 🤩",
    ],
  },
  {
    header: "Raceday in Südkärnten",
    date: "2025-09-14",
    releaseDate: "2025-10-26",
    imageFile: "news_suedkaernten.jpg",
    text: [
      "Als eines der letzten Saisonhighlights ging es für einige unserer Biber nach Österreich, zum Südkärntner Triathlon. 🚀 Das Wetter zeigte sich noch einmal von seiner besten Seite und so konnten Einzelstarter als auch eine Biber-Staffel alles geben. 🤩 Mit Erfolg! Trotz harter Strecke und ein paar Schwimm-Turbulenzen in der Staffel, gab es nochmal Podiumsplätze zu feiern. Herzlichen Glückwunsch! 🤩",
    ],
  },
  {
    header: "Wasserstand Marathon München",
    date: "2025-10-12",
    releaseDate: "2025-11-05",
    imageFile: "news/news_munich_marathon_2025-10-12.jpg",
    text: [
      "Alle Jahre wieder… 🥳 Letztes Jahr war es der Colastand, dieses Jahr der Wasserstand. So oder so haben wir den Läufer*innen beim Marathon München wieder ordentlich eingeheizt und sie auf den letzten Kilometern zum Ziel mit Wasser versorgt. 💦 Sport, gute Stimmung und am Ende sogar noch Trinkgeld einkassiert… hätte nicht besser laufen können. 😎😂",
      "Herzlichen Glückwunsch an alle Finisher! 🥳",
    ],
  },
  {
    header: "Social Night",
    date: "2025-10-27",
    releaseDate: "2025-10-29",
    imageFile: "news/news_pizza_2025-10-27.jpg",
    text: [
      "Anfang der Woche stand wieder eine Social Night bei uns auf dem Programm. 🤗 Viele Biber sind jetzt in der wohl verdienten Off-Season. Kein Grund, nicht weiter Carboloading zu betreiben. 🍕😋",
      "Die perfekte Gelegenheit, um das sportliche Jahr noch einmal Revue passieren zu lassen. 🥳",
      "Vielen Dank an unsere Sponsoren P.A.C., Running Point und DSTR für die Unterstützung! Ohne euch wäre das Jahr in dieser Form nicht möglich gewesen. 🙏🏻",
    ],
  },
  {
    header: "Ironman 70.3 World Championship",
    date: "2025-11-08",
    releaseDate: "2025-11-21",
    imageFile: "news/2025-11-21_news_marbella.jpg",
    text: [
      "Herzlichen Glückwunsch an unsere zwei Biber-Damen, die bei den Ironman 70.3 World Championship in Marbella teilgenommen haben. 🥳",
      "Ein krönender Saisonabschluss im November! Noch einmal Sonne tanken, noch einmal Vollgas geben. Jetzt werden die Beine hochgelegt, bevor das Training für die neue Saison startet. 😎",
    ],
  },
  {
    header: "Hüttenwanderung im Schnee",
    date: "2025-11-23",
    releaseDate: "2025-11-30",
    imageFile: "2025-11-23_news_huettenwanderung.jpg",
    text: [
      "Off-Season heißt Beine hochlegen und nichts tun? Weit verfehlt. Biber machen keinen Winterschlaf! 😏",
      "Vollgepackt mit gutem Essen ging es vor einer Woche zusammen hoch auf die Probstalm. Für viele Biber der erste Schnee der Saison. ❄ Ca. 3 Stunden Aufstieg - 12 KM und 700 Höhenmeter. 🏔 Angemessen zackiges Tempo - wir sind ja TriathletInnen... Ein tolles Wochenende, mit einer mal etwas anderen Aktivität. 🤗",
    ],
  },
  {
    header: "Schwimm-Trainingslager 2026",
    date: "2026-02-20",
    releaseDate: "2026-03-01",
    imageFile: "news/2026-02-swim-training-camp-2026.jpeg",
    text: [
      "Drei intensive Tage liegen hinter uns: Beim alljährlichen Schwimmtrainingslager in Oberhaching haben unsere Biber von Freitag bis Sonntag ordentlich Meter gesammelt. 😎 Technik und Ausdauer wurden verbessert, die eigenen Grenzen in Angriff genommen. Aber nicht nur im Wasser, sondern auch an Land wurde trainiert: Mit gezielten Stabilisationsübungen stärkten wir unsere Rumpfmuskulatur – die Basis für einen kraftvollen und effizienten Schwimmstil. 💪🏻 Zwischen den sportlichen Einheiten sorgten Videoanalysen für wertvolle Erkenntnisse. Natürlich blieb neben dem ganzen Sport auch Zeit für viel Austausch, sowohl zu Triathlon- als auch anderen Themen.",
      "Mit viel Motivation und einem starken Teamgefühl starten wir nun in die Saison 2026 – wir Sind bereit! 🏊🏻‍♂️",
    ],
  },
  {
    header: "MTC in Weiden: Ankommen in der Regionalliga",
    date: "2026-05-10",
    releaseDate: "2026-05-11",
    imageFile: "2026-05-11-liga-weiden.jpeg",
    text: [
      "Beim Liga-Rennen in Weiden waren drei der vier MTC-Mannschaften am Start – ein wichtiger Schritt für den Verein, der sich gerade in der Regionalliga etabliert.",
      "Die Landesliga Damen sammelten in ihrem ersten Start in der neugeründeten Liga wichtige Erfahrungen und belegten Platz 7 von 14. Die Regionalliga Damen musste sich mit kurzfristigen Ausfällen arrangieren und kämpfte sich auf Platz 11 von 11 – ein Wochenende, das gezeigt hat, wie wichtig Zusammenhalt ist. Die Regionalliga Männer landete in der Teamverfolgung auf Platz 10 von 14. Die Ergebnisse zeigen: Die Bayerische RL ist hochwertig und anspruchsvoll.",
      "Diese Saison ist für unsere Damen und Männer die Chance, im höchsten Spielniveau Bayerns anzukommen. Gemeinsam wachsen, die nächste Herausforderung anpacken und dabei den Spaß nicht vergessen – das ist der MTC.",
      "#biberfieber",
    ],
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const payload = await getPayload({ config });

console.log("\nImporting news articles → Payload\n");

let created = 0;
let skipped = 0;

for (const article of articles) {
  const existing = await payload.find({
    collection: "news",
    where: { header: { equals: article.header } },
    limit: 1,
  });

  if (existing.docs[0]) {
    console.log(`  skipped "${article.header}" (already exists)`);
    skipped++;
    continue;
  }

  const coverId = await uploadNewsMedia(payload, article.imageFile, article.header);
  if (coverId === null) {
    console.warn(`  ⚠ Skipping article "${article.header}" — cover image missing`);
    skipped++;
    continue;
  }

  const extraIds: number[] = [];
  for (const extraFile of article.extraImages ?? []) {
    const id = await uploadNewsMedia(payload, extraFile, article.header);
    if (id !== null) extraIds.push(id);
  }

  await payload.create({
    collection: "news",
    data: {
      header: article.header,
      content: textToLexical(article.text) as never,
      ...(article.date ? { date: toISODate(article.date) } : {}),
      ...(article.releaseDate ? { releaseDate: toISODate(article.releaseDate) } : {}),
      published: true,
      images: [
        { image: coverId, isCover: true },
        ...extraIds.map((id) => ({ image: id, isCover: false })),
      ],
    },
  });

  console.log(`  ✓ Created article "${article.header}"`);
  created++;
}

console.log("\n--- Summary ---");
console.log(`  Articles: ${created} created, ${skipped} skipped`);
console.log("\nImport complete ✓");
process.exit(0);
