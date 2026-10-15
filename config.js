/* config.js — det eneste, I behøver at ændre for at sætte appen op.
   1) Indsæt jeres Power Automate HTTP-URL mellem citationstegnene.
   2) Hvis I har sat en delt nøgle op i flowet (anbefales), indsæt den i API_KEY.
      Ellers lad den stå som tom tekst: "" */

window.KASSATION_CONFIG = {
  FLOW_URL: "https://default7b3c007331d44dfd8d4d122bd10aab.6b.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/16/workflows/a7ee6ab4765a4a49b9ffa031083484af/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=txwXQqMnd50DKE9dBnCDdtCpRgplzGp6zcdDG35pbv8",
  API_KEY: "JMbMRsaJTpRFlMaq9suwbcWmVgPJBchd",
  // Adgangskode: lav en hash på siden .../index.html#makepin og indsæt den her.
  // Tom tekst = ingen adgangskode.
  PIN_HASH: "02271a368d7b3ad06dabf18c1767d26c183fe29fb4e2fc4456ab0dc51ec0d5ec",
  // Nulstilling ved go-live: skriv en vilkårlig tekst, fx "golive-1". Næste gang hver enhed åbner appen,
  // tømmes dens lokale testdata én gang, før noget sendes. Skift IKKE teksten senere, medmindre alt skal nulstilles.
  RESET_TOKEN: "golive1",
    // Afdelinger der er LIVE. Står der noget her, behandles alle andre afdelinger som TEST: de kan registrere som normalt
  // (med et orange TEST-mærke), men registreringerne sendes aldrig til flowet/SharePoint. Tom liste = alle afdelinger er live.
  // Afdelingsnøgler: plant_hil (Hillerød), plant_var (Varde), plant_hol (Holbæk), plant_ish (Ishøj), plant_karl (Karlslunde) osv.
  LIVE_DEPTS: ["plant_hil"],
     // Lyd og vibration ved gennemført registrering. Sæt til false for at slå fra. (Vibration virker på Android, ikke på iPad.)
  LYD: true,
  VIBRATION: true,
   MAX_ANTAL: 10000,
SEND_ANTAL_FELT: true,
    // Support-knap på forsiden. Udfyld mindst én af linjerne (tom = ingen knap). Kollegerne kan kontakte jer med e-mailen,
  // også selv om tabletten ikke har en mailapp (adressen vises som tekst og kan kopieres).
  SUPPORT_NAME: "Christoffer Christensen",
  SUPPORT_EMAIL: "Christoffer.Christensen@Elis.com",
   THEME: ""
};
