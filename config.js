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
  RESET_TOKEN: ""
};
