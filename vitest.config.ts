import { defineConfig } from "vitest/config";

const iGithubActions = process.env.GITHUB_ACTIONS === "true";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],

    // github-actions ger både annoteringar på rätt rad i diffen och en
    // jobbsammanfattning med flaky-detektering. Vitest lägger till den av sig
    // själv bara när inga rapportörer är konfigurerade — så fort junit finns
    // med måste den anges explicit. junit är den portabla artefakten.
    reporters: iGithubActions
      ? ["default", "github-actions", "junit"]
      : ["default"],

    outputFile: {
      junit: "test-results.xml",
    },
  },
});
