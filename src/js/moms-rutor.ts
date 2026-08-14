/**
 * Kontomappning för momsdeklarationen (SKV 4700).
 *
 * Vilket BAS-konto som hör till vilken ruta är hämtat från accounted
 * (gnubok, Copyright (C) 2025-2026 Jakob Wennberg, AGPL-3.0),
 * lib/vat/moms-box-mapping.ts, som i sin tur följer Skatteverkets blankett.
 */

export type MomsRuta =
  | "05"
  | "06"
  | "07"
  | "08"
  | "10"
  | "11"
  | "12"
  | "20"
  | "21"
  | "22"
  | "23"
  | "24"
  | "30"
  | "31"
  | "32"
  | "35"
  | "36"
  | "37"
  | "38"
  | "39"
  | "40"
  | "41"
  | "42"
  | "48"
  | "50"
  | "60"
  | "61"
  | "62";

export const RUTA_BESKRIVNING: Record<MomsRuta, string> = {
  "05": "Momspliktig försäljning",
  "06": "Momspliktiga uttag",
  "07": "Beskattningsunderlag vid vinstmarginalbeskattning",
  "08": "Hyresinkomster vid frivillig skattskyldighet",
  "10": "Utgående moms 25 %",
  "11": "Utgående moms 12 %",
  "12": "Utgående moms 6 %",
  "20": "Inköp av varor från annat EU-land",
  "21": "Inköp av tjänster från annat EU-land",
  "22": "Inköp av tjänster från land utanför EU",
  "23": "Inköp av varor i Sverige, omvänd skattskyldighet",
  "24": "Övriga inköp av tjänster, omvänd skattskyldighet",
  "30": "Utgående moms 25 % på inköp i ruta 20–24",
  "31": "Utgående moms 12 % på inköp i ruta 20–24",
  "32": "Utgående moms 6 % på inköp i ruta 20–24",
  "35": "Försäljning av varor till annat EU-land",
  "36": "Försäljning av varor utanför EU",
  "37": "Mellanmans inköp vid trepartshandel",
  "38": "Mellanmans försäljning vid trepartshandel",
  "39": "Försäljning av tjänster till näringsidkare i annat EU-land",
  "40": "Övrig försäljning av tjänster omsatta utomlands",
  "41": "Försäljning när köparen är skattskyldig i Sverige",
  "42": "Övrig försäljning m.m.",
  "48": "Ingående moms att dra av",
  "50": "Beskattningsunderlag vid import",
  "60": "Utgående moms 25 % på import",
  "61": "Utgående moms 12 % på import",
  "62": "Utgående moms 6 % på import",
};

/**
 * Kreditnormala rutor (intäkter och utgående moms) bokförs i kredit och
 * summeras med omvänt tecken. Debetnormala (inköpsunderlag och ingående
 * moms) tas som de bokförs.
 */
const KREDITNORMALA_RUTOR = new Set<MomsRuta>([
  "05",
  "06",
  "07",
  "08",
  "10",
  "11",
  "12",
  "30",
  "31",
  "32",
  "35",
  "36",
  "37",
  "38",
  "39",
  "40",
  "41",
  "42",
  "60",
  "61",
  "62",
]);

export const arKreditnormal = (ruta: MomsRuta) => KREDITNORMALA_RUTOR.has(ruta);

/**
 * Rutor som inte går att räkna fram ur kontosaldon och därför måste fyllas i
 * för hand i deklarationen:
 *  - 07 är marginalen vid vinstmarginalbeskattning, inte ett kontosaldo,
 *  - 08 går inte att skilja från annan försäljning på kontonivå.
 */
export const MANUELLA_RUTOR = new Set<MomsRuta>(["07", "08"]);

export const KONTO_RUTA: Record<number, MomsRuta> = {
  // Momspliktig försäljning inom Sverige
  3000: "05",
  3001: "05",
  3002: "05",
  3003: "05",
  // Momspliktiga uttag
  3401: "06",
  3402: "06",
  3403: "06",
  // Varuförsäljning till annat EU-land
  3108: "35",
  3521: "35",
  // Varuexport utanför EU
  3105: "36",
  3522: "36",
  // Trepartshandel
  3109: "38",
  // Tjänsteförsäljning EU (huvudregeln)
  3308: "39",
  // Tjänsteförsäljning utanför EU
  3305: "40",
  // Omvänd skattskyldighet i Sverige, säljarens sida
  3231: "41",
  3232: "41",
  3233: "41",
  // Momsfri försäljning
  3004: "42",
  3100: "42",
  3404: "42",
  3980: "42",
  3994: "42",

  // Utgående moms 25 %
  2610: "10",
  2611: "10",
  2612: "10",
  2613: "10",
  2616: "10",
  2618: "10",
  // Utgående moms 12 %
  2620: "11",
  2621: "11",
  2622: "11",
  2623: "11",
  2626: "11",
  2628: "11",
  // Utgående moms 6 %
  2630: "12",
  2631: "12",
  2632: "12",
  2633: "12",
  2636: "12",
  2638: "12",
  // Beräknad utgående moms på förvärv (omvänd skattskyldighet)
  2614: "30",
  2624: "31",
  2634: "32",
  // Importmoms
  2615: "60",
  2625: "61",
  2635: "62",

  // Ingående moms
  2640: "48",
  2641: "48",
  2642: "48",
  2645: "48",
  2646: "48",
  2647: "48",
  2648: "48",
  2649: "48",

  // Underlag för förvärv med omvänd skattskyldighet
  4515: "20",
  4516: "20",
  4517: "20",
  4535: "21",
  4536: "21",
  4537: "21",
  4531: "22",
  4532: "22",
  4533: "22",
  4415: "23",
  4416: "23",
  4417: "23",
  4425: "24",
  4426: "24",
  4427: "24",
  // Underlag vid import
  4545: "50",
  4546: "50",
  4547: "50",
};

/** Rutor med utgående moms — det som ska betalas in. */
export const UTGAENDE_RUTOR: Array<MomsRuta> = [
  "10",
  "11",
  "12",
  "30",
  "31",
  "32",
  "60",
  "61",
  "62",
];

/** Rutor med ingående moms — det som får dras av. */
export const INGAENDE_RUTOR: Array<MomsRuta> = ["48"];

const kontonForRutor = (rutor: Array<MomsRuta>) =>
  Object.entries(KONTO_RUTA)
    .filter(([, ruta]) => rutor.includes(ruta))
    .map(([konto]) => Number(konto));

/** Alla momskonton som momsomföringen ska nolla. */
export const MOMSKONTON = [
  ...kontonForRutor(UTGAENDE_RUTOR),
  ...kontonForRutor(INGAENDE_RUTOR),
].sort((a, b) => a - b);

/** Blankettens avsnitt, i samma ordning som Skatteverkets blankett. */
export const RUTGRUPPER: Array<{
  rubrik: string;
  rutor: Array<MomsRuta>;
  /** Visas även när alla belopp är noll. */
  alltid?: boolean;
}> = [
  {
    rubrik: "A. Momspliktig försäljning eller uttag",
    rutor: ["05", "06", "07", "08"],
    alltid: true,
  },
  {
    rubrik: "B. Utgående moms på försäljning i A",
    rutor: ["10", "11", "12"],
    alltid: true,
  },
  { rubrik: "C. Momspliktiga inköp", rutor: ["20", "21", "22", "23", "24"] },
  { rubrik: "D. Utgående moms på inköp i C", rutor: ["30", "31", "32"] },
  {
    rubrik: "E. Försäljning m.m. som är undantagen från moms",
    rutor: ["35", "36", "37", "38", "39", "40", "41", "42"],
  },
  { rubrik: "F. Import", rutor: ["50", "60", "61", "62"] },
  { rubrik: "G. Ingående moms", rutor: ["48"], alltid: true },
];
