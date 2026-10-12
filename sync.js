/* sync.js — sender ventende registreringer til jeres Power Automate-flow.
   Kører automatisk: lige efter siden loader, hver gang netforbindelsen
   kommer tilbage, og desuden hvert minut som sikkerhedsnet. */

(function () {
  const cfg = window.KASSATION_CONFIG || {};
  const UNDO_MS = 4000; // skal være længere end Fortryd-banneret (3500 ms) i index.html

  function configured() {
    return cfg.FLOW_URL && !cfg.FLOW_URL.includes('PASTE-DIN');
  }

  async function sendRecord(record) {
    const headers = { 'Content-Type': 'application/json' };
    if (cfg.API_KEY) headers['x-api-key'] = cfg.API_KEY;
    const { id, synced, ...payload } = record; // id/synced er kun til lokalt brug
    // Send læsbar dansk tekst til SharePoint (fx "Duge", "Misfarvet") i stedet for tekniske nøgler.
    const toDa = window.daLabel || (x => x);
    payload.category = toDa(payload.category);
    payload.reason = toDa(payload.reason);
    // Foto (kun ved "Andet"): send som ren base64 + filnavn, så flowet kan lægge det som vedhæftning på rækken
    payload.comment = payload.comment || '';
    if (payload.photo && payload.photo.startsWith('data:')) {
      payload.photoName = 'andet-' + record.ts + '.jpg';
      payload.photo = payload.photo.split(',')[1];
    } else { payload.photo = ''; payload.photoName = ''; }
    const res = await fetch(cfg.FLOW_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Sync fejlede: ' + res.status);
  }

  // Nulstilling ved go-live: ændrer I RESET_TOKEN i config.js, tømmer hver enhed sine lokale (test)registreringer
  // ÉN gang – før noget sendes. Samme token = ingen nulstilling.
  async function resetIfNeeded() {
    const tok = cfg.RESET_TOKEN;
    if (!tok) return;
    let seen = null;
    try { seen = localStorage.getItem('kass_reset'); } catch (e) {}
    if (seen === tok) return;
    try {
      await window.KassationQueue.clearAll();
      localStorage.setItem('kass_reset', tok);
    } catch (e) { console.error(e); }
  }
  const ready = resetIfNeeded();

  async function flushQueue() {
    await ready; // nulstilling først, derefter evt. afsendelse
    if (!navigator.onLine || !configured()) return;
    const all = await window.KassationQueue.getPending();
    // Nye registreringer venter kort (UNDO_MS), så Fortryd i appen når at fjerne dem, før de sendes.
    const pending = all.filter(r => Date.now() - r.ts >= UNDO_MS);
    for (const rec of pending) {
      try {
        await sendRecord(rec);
        await window.KassationQueue.markSynced(rec.id);
      } catch (e) {
        // Stadig offline eller flow utilgængeligt — prøves igen senere.
        break;
      }
    }
    window.dispatchEvent(new Event('kassation:synced'));
  }

  window.KassationSync = { flushQueue, configured };
  window.addEventListener('online', flushQueue);
  setInterval(flushQueue, 60000);
  document.addEventListener('DOMContentLoaded', () => setTimeout(flushQueue, 1500));
})();
