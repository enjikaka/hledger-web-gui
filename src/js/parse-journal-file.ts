export type Account = {
  name: string;
};

export type Alias = {
  id: number;
  to: string;
};

export type Posting = {
  account: string;
  amount: number;
  currency: string;
};

export type Transaction = {
  date: string;
  description: string;
  postings: Array<Posting>;
};

// Proper discriminated union types
export type JournalItem =
  | { type: "account"; data: Account }
  | { type: "alias"; data: Alias }
  | { type: "transaction"; data: Transaction };

export async function* parseJournalFile(
  file: File,
): AsyncGenerator<JournalItem> {
  const decoder = new TextDecoder("utf-8");
  const reader = file.stream().getReader();
  let { value: chunk, done } = await reader.read();
  let buffer = "";

  let transactionBuffer = null; // for accumulating transactions

  while (!done) {
    buffer += decoder.decode(chunk, { stream: true });
    let lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (let line of lines) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith(";")) continue; // skip empty/comments

      if (transactionBuffer) {
        if (/^\s/.test(line)) {
          transactionBuffer.push(line);
          continue;
        } else {
          // flush previous transaction
          const tx = parseTransaction(transactionBuffer);
          if (tx) yield { type: "transaction", data: tx };
          transactionBuffer = null;
        }
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
        if (match && match[2]) {
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

    ({ value: chunk, done } = await reader.read());
  }

  buffer += decoder.decode();
  if (buffer) {
    const remainingLines = buffer.split("\n");
    for (let line of remainingLines) {
      if (!line.trim()) continue;
      if (transactionBuffer) {
        if (/^\s/.test(line)) {
          transactionBuffer.push(line);
        } else {
          const tx = parseTransaction(transactionBuffer);
          if (tx) yield { type: "transaction", data: tx };
          transactionBuffer = null;
        }
      }
      if (!transactionBuffer && /^\d{4}-\d{2}-\d{2}/.test(line.trim())) {
        transactionBuffer = [line];
      }
    }
  }

  // Always process any remaining transaction buffer
  if (transactionBuffer) {
    const tx = parseTransaction(transactionBuffer);
    if (tx) yield { type: "transaction", data: tx };
  }
}

function parseTransaction(lines: string[]): Transaction | null {
  const [header, ...postings] = lines;
  const match = header.match(/^(\d{4}-\d{2}-\d{2})\s+(.+)$/);
  if (!match) return null;

  const date = match[1];
  const description = match[2].trim();

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
        account,
        amount: parseFloat(amountMatch[1]),
        currency: amountMatch[3] || "",
      };
    })
    .filter((posting): posting is Posting => posting !== null);

  return {
    date,
    description,
    postings: parsedPostings,
  };
}
