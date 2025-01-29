import newsAllgaeuImage from "@/public/allgaeu_news.jpg";
import newsSchongauImage from "@/public/schongau_news.jpg";
import newsChallengeImage from "@/public/challenge_news.jpg";
import neuseeland from "@/public/neuseeland.jpg";
import news100x100 from "@/public/news_100x100.jpg";
import newsSwimCamp from "@/public/news_swim_camp.jpg";
import { StaticImageData } from "next/image";

type NewsType = {
  image: { src: StaticImageData; width: number; height: number };
  header: string;
  text: string | string[];
  date?: string;
};
export const newsShort: NewsType[] = [
  {
    image: { src: newsAllgaeuImage, height: 2268, width: 3024 },
    header: "Allgäu Triathlon 2024",
    text: "Es war ein Spektakel. Der Allgäu Triathlon 2024. Unsere Biber waren auf der Mitteldistanz und der Olympischen Distanz unterwegs. Was alle gemeinsam hatten: Sie wurden plörre nass. Inklusive der Biber-Fans am Rand. Da half die beste Regenjacke nicht. Am Ende schafften es drei Biber sogar aufs Podium!",
  },
  {
    image: { src: newsSchongauImage, height: 2268, width: 3024 },
    header: "Landesliga Süd Damen Schongau",
    text: "Unsere Biber-Damen haben die Ligasaison eröffnet und am vergangenen Wochenende haben sie sie auch in Schongau beendet. Es war uns ein Fest! Bei strahlendem Sonnenschein und unter stürmischem Biber-Jubel gingen Janet, Lisa, Vicky und Anne an den Start. Die dritte Person im Ziel wurde gewertet, also war eine Team-Strategie gefragt. Wie so oft, musste die flexibel noch einmal angepasst werden. Ins Ziel gekommen sind sie aber alle!",
  },
  {
    image: { src: newsChallengeImage, height: 2268, width: 3024 },
    header: " Challenge Roth 2024",
    text: "Am ersten Juli-Wochenende stand für einige unserer Biber das Saisonhighlight an. Bei der Challenge Roth gingen Valentin, Jens und Anne an den Start. Valentin schaffte seine Bestzeit auf der Langdistanz und Jens feierte in Roth sein Langdistanz-Debüt. Wo ginge das besser, als bei dem weltweit größten Wettkampf auf der Triathlon-Langdistanz.",
  },
  {
    image: { src: neuseeland, height: 2880, width: 3840 },
    header: "Ironman 70.3 World Championships 2024",
    text: [
      "Im Dezember fanden die Ironman 70.3 World Championships in Taupo, Neuseeland statt. Mit (vierfacher) Biberbeteiligung war der späte Saisonabschluss unter der brennenden Sonne ein absolutes Highlightrennen.",
      "Am Samstag startete Anne beim Damenrennen. Holger, Carsten und Valentin folgten ihr am Sonntag beim Herrenrennen. Zwischen den beiden Letzteren entwickelte sich ein spannender Wettkampf. Wer wohl als Erster die Ziellinie überqueren würde? Am Ende lieferten sie sich ein Kopf-an-Kopf-Rennen und überquerten gemeinsam die Ziellinie",
      "Fazit: Es war ein grandioses Rennen! Die atemberaubende Landschaft, die unglaublich freundlichen und hilfsbereiten Volunteers, die großartige Stimmung und natürlich der biberstarke Zusammenhalt unseres Teams haben das Wochenende zu einem unvergesslichen Event gemacht.",
    ],
  },
  {
    image: { src: newsSwimCamp, height: 3331, width: 2499 },
    header: "Schwimmtrainingslager in Oberhaching",
    text: [
      "Beim Schwimmtrainingslager in Oberhaching waren die Biber in ihrem Element. Von Freitag bis Sonntag sind wir geschwommen bis die Arme abgefallen sind. Damit nicht genug, gab es zusätzlich natürlich noch ein bisschen Stabitraining. Rumpf ist Trumpf sozusagen. Zwischendrin gab es dann Videoanalysen, Kickerpartien und jede Menge biberstarke Geselligkeit.",
      "Wir freuen uns auf die anstehende Saison!",
    ],
  },
  {
    image: { src: news100x100, height: 1383, width: 1844 },
    header: "100 x 100 im Olympiabad",
    text: [
      "Einmal ist kein Mal. Zwei Mal ist eine Tradition…",
      "Jedes Jahr im Januar kommt jemand auf die verrückte Idee: „Leute, wer hat Bock auf 100x100 schwimmen?“ Vorher finden es alle geil, währenddessen sind alle am jammern, hinterher finden es alle noch ein bisschen geiler.",
      "Next year again?",
    ],
  },
];
