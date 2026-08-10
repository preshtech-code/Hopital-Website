import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const projectRoot = resolve(import.meta.dirname, "..");
const sitesOutput = resolve(projectRoot, "dist");
const serverEntrypoint = resolve(sitesOutput, "server", "index.js");

if (!existsSync(serverEntrypoint)) {
  throw new Error("Vinext did not generate dist/server/index.js.");
}

mkdirSync(resolve(sitesOutput, ".openai"), { recursive: true });
cpSync(resolve(projectRoot, ".openai", "hosting.json"), resolve(sitesOutput, ".openai", "hosting.json"));
