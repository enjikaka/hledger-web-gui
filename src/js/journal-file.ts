import { parseJournalFile } from "./parse-journal-file.ts";
import * as Signals from "./signals.ts";

const JOURNAL_FILE_TYPES = [
  {
    description: "hledger journal",
    accept: { "text/plain": [".journal", ".hledger", ".j"] },
  },
];

/** Läser in en fil och ersätter allt state (öppna = börja om, inte addera). */
export async function parseFileIntoSignals(file: File): Promise<void> {
  const accounts: typeof Signals.accounts.value = [];
  const aliases: typeof Signals.aliases.value = [];
  const transactions: typeof Signals.transactions.value = [];
  let header = "";

  for await (const item of parseJournalFile(file)) {
    switch (item.type) {
      case "account":
        accounts.push(item.data);
        break;
      case "alias":
        aliases.push(item.data);
        break;
      case "transaction":
        transactions.push(item.data);
        break;
      case "header":
        header = item.data;
        break;
    }
  }

  Signals.accounts.value = accounts;
  Signals.aliases.value = aliases;
  Signals.transactions.value = transactions;
  Signals.journalHeader.value = header;
  Signals.fileName.value = file.name;
}

export function supportsFileSystemAccess(): boolean {
  return "showOpenFilePicker" in window;
}

/** Öppna via filväljaren och kom ihåg handtaget för nästa besök. */
export async function openJournal(): Promise<void> {
  const [handle] = await window.showOpenFilePicker({
    types: JOURNAL_FILE_TYPES,
  });

  await parseFileIntoSignals(await handle.getFile());
  Signals.fileHandle.value = handle;
  await storeHandle(handle);
}

/** Öppna filen från förra besöket (kräver klick — behörighetsfrågan
 *  måste ske i en användargest). Returnerar false om det inte gick. */
export async function reopenLastJournal(): Promise<boolean> {
  const handle = await loadStoredHandle();

  if (!handle) {
    return false;
  }

  const permission = await handle.requestPermission({ mode: "readwrite" });

  if (permission !== "granted") {
    return false;
  }

  await parseFileIntoSignals(await handle.getFile());
  Signals.fileHandle.value = handle;
  return true;
}

/** Namnet på senast öppnade filen, om ett handtag finns sparat. */
export async function storedFileName(): Promise<string | null> {
  const handle = await loadStoredHandle();
  return handle?.name ?? null;
}

/** Skriver journalen till disk, eller laddar ner den som fallback. */
export async function saveJournal(): Promise<"saved" | "downloaded"> {
  const handle = Signals.fileHandle.value;
  const content = Signals.hledgerOutput.value;

  if (handle) {
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
    return "saved";
  }

  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = Signals.fileName.value || "journal.journal";
  link.click();
  URL.revokeObjectURL(link.href);
  return "downloaded";
}

// --- IndexedDB-lagring av filhandtaget (överlever omladdning) ---

const DB_NAME = "hledger-swe-gui";
const STORE_NAME = "file-handles";
const HANDLE_KEY = "journal";

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function storeHandle(handle: FileSystemFileHandle): Promise<void> {
  const db = await openDatabase();

  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(handle, HANDLE_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function loadStoredHandle(): Promise<FileSystemFileHandle | null> {
  try {
    const db = await openDatabase();

    return await new Promise((resolve, reject) => {
      const request = db
        .transaction(STORE_NAME, "readonly")
        .objectStore(STORE_NAME)
        .get(HANDLE_KEY);

      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error);
    });
  } catch {
    return null;
  }
}
