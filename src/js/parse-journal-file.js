// parseJournalFile.js (ESM)

/**
 * @typedef {Object} Account
 * @property {string} name
 *
 * @typedef {Object} Alias
 * @property {number} id
 * @property {string} to
 *
 * @typedef {Object} Posting
 * @property {string} account
 * @property {number} amount
 * @property {string} currency
 *
 * @typedef {Object} Transaction
 * @property {string} date
 * @property {string} description
 * @property {Posting[]} postings
 */

/**
 * Async generator to parse an hledger journal file
 * @param {File} file
 * @returns {AsyncGenerator<{ type: 'account' | 'alias' | 'transaction', data: Account | Alias | Transaction }>}
 */
export async function* parseJournalFile(file) {
    const decoder = new TextDecoder("utf-8");
    const reader = file.stream().getReader();
    let { value: chunk, done } = await reader.read();
    let buffer = "";
  
    let transactionBuffer = null; // for accumulating transactions
  
    while (!done) {
      buffer += decoder.decode(chunk, { stream: true });
      let lines = buffer.split("\n");
      buffer = lines.pop();
  
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
            if (tx) yield { type: 'transaction', data: tx };
            transactionBuffer = null;
          }
        }
  
        if (trimmed.startsWith("account ")) {
          yield {
            type: "account",
            data: { name: trimmed.substring(8).trim() },
          };
        } else if (trimmed.startsWith("alias ")) {
          const match = trimmed.substring(6).trim().match(/^(\d+)\s*=\s*(.+)$/);
          if (match) {
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
            if (tx) yield { type: 'transaction', data: tx };
            transactionBuffer = null;
          }
        }
        if (!transactionBuffer && /^\d{4}-\d{2}-\d{2}/.test(line.trim())) {
          transactionBuffer = [line];
        }
      }
      if (transactionBuffer) {
        const tx = parseTransaction(transactionBuffer);
        if (tx) yield { type: 'transaction', data: tx };
      }
    }
  }
  
  function parseTransaction(lines) {
    const [header, ...postings] = lines;
    const match = header.match(/^(\d{4}-\d{2}-\d{2})\s+(.+)$/);
    if (!match) return null;
  
    const date = match[1];
    const description = match[2].trim();
  
    const parsedPostings = postings
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
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
      .filter(Boolean);
  
    return {
      date,
      description,
      postings: parsedPostings,
    };
  }
  