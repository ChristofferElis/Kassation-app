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
    const res = await fetch(cfg.FLOW_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Sync fejlede: ' + res.status);
  }

  async function flushQueue() {
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

