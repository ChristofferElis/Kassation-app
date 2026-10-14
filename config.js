/* config.js — det eneste, I behøver at ændre for at sætte appen op.
   1) Indsæt jeres Power Automate HTTP-URL mellem citationstegnene.
   2) Hvis I har sat en delt nøgle op i flowet (anbefales), indsæt den i API_KEY.
      Ellers lad den stå som tom tekst: "" */

window.KASSATION_CONFIG = {
  FLOW_URL: "PASTE-DIN-POWER-AUTOMATE-URL-HER",
  API_KEY: "JMbMRsaJTpRFlMaq9suwbcWmVgPJBchd",
  // Adgangskode: lav en hash på siden .../index.html#makepin og indsæt den her.
  // Tom tekst = ingen adgangskode.
  PIN_HASH: "02271a368d7b3ad06dabf18c1767d26c183fe29fb4e2fc4456ab0dc51ec0d5ec",
  // Nulstilling ved go-live: skriv en vilkårlig tekst, fx "golive-1". Næste gang hver enhed åbner appen,
  // tømmes dens lokale testdata én gang, før noget sendes. Skift IKKE teksten senere, medmindre alt skal nulstilles.
  RESET_TOKEN: "",
    // Afdelinger der er LIVE. Står der noget her, behandles alle andre afdelinger som TEST: de kan registrere som normalt
  // (med et orange TEST-mærke), men registreringerne sendes aldrig til flowet/SharePoint. Tom liste = alle afdelinger er live.
  // Afdelingsnøgler: plant_hil (Hillerød), plant_var (Varde), plant_hol (Holbæk), plant_ish (Ishøj), plant_karl (Karlslunde) osv.
  LIVE_DEPTS: ["ingen"],
     // Lyd og vibration ved gennemført registrering. Sæt til false for at slå fra. (Vibration virker på Android, ikke på iPad.)
  LYD: true,
  VIBRATION: true,
    // Support-knap på forsiden. Udfyld mindst én af linjerne (tom = ingen knap). Kollegerne kan kontakte jer med e-mailen,
  // også selv om tabletten ikke har en mailapp (adressen vises som tekst og kan kopieres).
  SUPPORT_NAME: "Christoffer Christensen",
  SUPPORT_EMAIL: "Christoffer.Christensen@Elis.com",
   THEME: ""
};
