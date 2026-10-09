/* queue.js — gemmer registreringer lokalt i IndexedDB, så appen virker offline.
   Hver registrering gemmes permanent (til historik) med et flag "synced",
   der bliver sat til true, når sync.js har sendt den videre til Power Automate. */

const DB_NAME = 'kassation';
const STORE = 'records';

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        const os = db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
        os.createIndex('synced', 'synced', { unique: false });
        os.createIndex('ts', 'ts', { unique: false });
      }
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = e => reject(e.target.error);
  });
}

async function addRecord(record) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const os = tx.objectStore(STORE);
    const req = os.add({ ...record, synced: false });
    req.onsuccess = () => resolve(req.result); // returnerer det nye id
    req.onerror = () => reject(req.error);
  });
}

async function markSynced(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const os = tx.objectStore(STORE);
    const getReq = os.get(id);
    getReq.onsuccess = () => {
      const rec = getReq.result;
      if (!rec) { resolve(); return; }
      rec.synced = true;
      const putReq = os.put(rec);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

async function getPending() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve((req.result || []).filter(r => !r.synced));
    req.onerror = () => reject(req.error);
  });
}

async function getAllRecords(limit = 200) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => {
      const rows = (req.result || []).sort((a, b) => b.ts - a.ts).slice(0, limit);
      resolve(rows);
    };
    req.onerror = () => reject(req.error);
  });
}

// Sletter en registrering, men KUN hvis den ikke er sendt endnu (bruges af Fortryd). Returnerer true/false.
async function deleteIfPending(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const os = tx.objectStore(STORE);
    const getReq = os.get(id);
    getReq.onsuccess = () => {
      const rec = getReq.result;
      if (!rec || rec.synced) { resolve(false); return; }
      const del = os.delete(id);
      del.onsuccess = () => resolve(true);
      del.onerror = () => reject(del.error);
    };
    getReq.onerror = () => reject(getReq.error);
  });
}

window.KassationQueue = { addRecord, markSynced, getPending, getAllRecords, deleteIfPending };
