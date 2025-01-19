import newsAllgaeuImage from "@/public/allgaeu_news.jpg";
import newsSchongauImage from "@/public/schongau_news.jpg";
import newsChallengeImage from "@/public/challenge_news.jpg";
import neuseeland from "@/public/neuseeland.jpg";
import { StaticImageData } from "next/image";

type NewsType = {
  image: StaticImageData;
  header: string;
  text: string | string[];
};
export const newsShort: NewsType[] = [
  {
    image: newsAllgaeuImage,
    header: "Allgäu Triathlon 2024",
    text: "Es war ein Spektakel. Der Allgäu Triathlon 2024. Unsere Biber waren auf der Mitteldistanz und der Olympischen Distanz unterwegs. Was alle gemeinsam hatten: Sie wurden plörre nass. Inklusive der Biber-Fans am Rand. Da half die beste Regenjacke nicht. Am Ende schafften es drei Biber sogar aufs Podium!",
  },
  {
    image: newsSchongauImage,
    header: "Landesliga Süd Damen Schongau",
    text: "Unsere Biber-Damen haben die Ligasaison eröffnet und am vergangenen Wochenende haben sie sie auch in Schongau beendet. Es war uns ein Fest! Bei strahlendem Sonnenschein und unter stürmischem Biber-Jubel gingen Janet, Lisa, Vicky und Anne an den Start. Die dritte Person im Ziel wurde gewertet, also war eine Team-Strategie gefragt. Wie so oft, musste die flexibel noch einmal angepasst werden. Ins Ziel gekommen sind sie aber alle!",
  },
  {
    image: newsChallengeImage,
    header: " Challenge Roth 2024",
    text: "Am ersten Juli-Wochenende stand für einige unserer Biber das Saisonhighlight an. Bei der Challenge Roth gingen Valentin, Jens und Anne an den Start. Valentin schaffte seine Bestzeit auf der Langdistanz und Jens feierte in Roth sein Langdistanz-Debüt. Wo ginge das besser, als bei dem weltweit größten Wettkampf auf der Triathlon-Langdistanz.",
  },
  {
    image: neuseeland,
    header: "Ironman 70.3 World Championships 2024",
    text: [
      "Im Dezember fanden die Ironman 70.3 World Championships in Taupo, Neuseeland statt. Mit (vierfacher) Biberbeteiligung war der späte Saisonabschluss unter der brennenden Sonne ein absolutes Highlightrennen.",
      "Am Samstag startete Anne beim Damenrennen. Holger, Carsten und Valentin folgten ihr am Sonntag beim Herrenrennen. Zwischen den beiden Letzteren entwickelte sich ein spannender Wettkampf. Wer wohl als Erster die Ziellinie überqueren würde? Am Ende lieferten sie sich ein Kopf-an-Kopf-Rennen und überquerten gemeinsam die Ziellinie",
      "Fazit: Es war ein grandioses Rennen! Die atemberaubende Landschaft, die unglaublich freundlichen und hilfsbereiten Volunteers, die großartige Stimmung und natürlich der biberstarke Zusammenhalt unseres Teams haben das Wochenende zu einem unvergesslichen Event gemacht.",
    ],
  },
];
