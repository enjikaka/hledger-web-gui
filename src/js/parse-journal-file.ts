export type Account = {
  name: string;
};

export type Alias = {
  id: number;
  to: string;
};

export type Posting = {
  account: number;
  amount: number;
  currency: string;
};

export type Transaction = {
  uuid: string;
  date: string;
  /** Verifikationsnummer, t.ex. "A12". Skrivs i hledgers kodfält —
   *  `2025-03-01 (A12) Beskrivning` — som är avsett för just detta. */
  code?: string;
  description: string;
  postings: Array<Posting>;
};

// Proper discriminated union types
export type JournalItem =
  | { type: "account"; data: Account }
  | { type: "alias"; data: Alias }
  | { type: "transaction"; data: Transaction }
  /** Råtexten före första transaktionen (kontodefinitioner, kommentarer m.m.),
   *  bevaras ordagrant så att en sparad fil inte tappar kommentarer. */
  | { type: "header"; data: string };

export async function* parseJournalFile(
  file: File,
): AsyncGenerator<JournalItem> {
  const decoder = new TextDecoder("utf-8");
  const reader = file.stream().getReader();

  let buffer = "";
  let transactionBuffer: Array<string> | null = null;
  const headerLines: Array<string> = [];
  let headerDone = false;

  /** Tolkar en rad. Både strömmens rader och filens sista rad utan
   *  radbrytning går genom den här, så inget kan tappas bort på slutet. */
  function* hanteraRad(line: string): Generator<JournalItem> {
    const trimmed = line.trim();

    if (!headerDone) {
      if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
        headerDone = true;
        yield { type: "header", data: headerLines.join("\n") };
      } else {
        headerLines.push(line);
      }
    }

    if (!trimmed || trimmed.startsWith(";")) return; // skip empty/comments

    if (transactionBuffer) {
      if (/^\s/.test(line)) {
        transactionBuffer.push(line);
        return;
      }

      // flush previous transaction
      const tx = parseTransaction(transactionBuffer);
      if (tx) yield { type: "transaction", data: tx };
      transactionBuffer = null;
    }

    if (trimmed.startsWith("account ")) {
      yield {
        type: "account",
        data: { name: trimmed.substring(8).trim() },
      };
    } else if (trimmed.startsWith("alias ")) {
      const match = trimmed
        .substring(6)
        .trim()
        .match(/^(\d+)\s*=\s*(.+)$/);
      if (match?.[2]) {
        yield {
          type: "alias",
          data: {
            id: parseInt(match[1], 10),
            to: match[2].trim(),
          },
        };
      }
    } else if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) {
      transactionBuffer = [line];
    }
  }

  let { value: chunk, done } = await reader.read();

  while (!done) {
    buffer += decoder.decode(chunk, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      yield* hanteraRad(line);
    }

    ({ value: chunk, done } = await reader.read());
  }

  buffer += decoder.decode();

  // Sista raden ligger kvar i bufferten när filen saknar avslutande
  // radbrytning — utan den här rundan tappas den helt.
  if (buffer) {
    for (const line of buffer.split("\n")) {
      yield* hanteraRad(line);
    }
  }

  // Always process any remaining transaction buffer
  if (transactionBuffer) {
    const tx = parseTransaction(transactionBuffer);
    if (tx) yield { type: "transaction", data: tx };
  }

  // Fil helt utan transaktioner: hela innehållet är header
  if (!headerDone) {
    yield { type: "header", data: headerLines.join("\n") };
  }
}

function parseTransaction(lines: string[]): Transaction | null {
  const [header, ...postings] = lines;
  // Kodfältet är valfritt: `2025-03-01 (A12) Beskrivning`
  const match = header.match(/^(\d{4}-\d{2}-\d{2})\s+(?:\(([^)]*)\)\s*)?(.+)$/);
  if (!match) return null;

  const date = match[1];
  const code = match[2]?.trim();
  const description = match[3].trim();

  const parsedPostings = postings
    .map((line: string) => line.trim())
    .filter(Boolean)
    .map((line: string) => {
      const parts = line.split(/\s{2,}/); // separate account and amount by 2+ spaces
      const account = parts[0].trim();
      const amountPart = parts[1]?.trim() || "";
      const amountMatch = amountPart.match(/^(-?\d+(\.\d+)?)\s*(\w+)?$/);
      if (!amountMatch) return null;

      return {
        account: parseInt(account, 10),
        amount: parseFloat(amountMatch[1]),
        currency: amountMatch[3] || "",
      };
    })
    .filter((posting): posting is Posting => posting !== null);

  return {
    uuid: crypto.randomUUID(),
    date,
    ...(code ? { code } : {}),
    description,
    postings: parsedPostings,
  };
}
