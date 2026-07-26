// Minimal typning av webacts funktionskomponent-kontext (`this`),
// tills webact exporterar en egen typ för den.
export type WebactThis = {
  html: (strings: TemplateStringsArray, ...values: unknown[]) => void;
  css: (strings: TemplateStringsArray, ...values: unknown[]) => void;
  // webacts $ returnerar olika elementtyper beroende på selektor
  // biome-ignore lint/suspicious/noExplicitAny: se ovan
  $: (selector?: string) => any;
  postRender: (callback: () => void | Promise<void>) => void;
  props: Record<string, string>;
};
