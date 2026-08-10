import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const openNextOutput = resolve(projectRoot, ".open-next");
const sitesOutput = resolve(projectRoot, "dist");

if (!existsSync(openNextOutput)) {
  throw new Error("OpenNext output was not generated.");
}

rmSync(sitesOutput, { recursive: true, force: true });
mkdirSync(resolve(sitesOutput, ".open-next"), { recursive: true });
cpSync(openNextOutput, resolve(sitesOutput, ".open-next"), { recursive: true });
mkdirSync(resolve(sitesOutput, ".openai"), { recursive: true });
cpSync(resolve(projectRoot, ".openai", "hosting.json"), resolve(sitesOutput, ".openai", "hosting.json"));
cpSync(resolve(projectRoot, "wrangler.jsonc"), resolve(sitesOutput, "wrangler.jsonc"));
