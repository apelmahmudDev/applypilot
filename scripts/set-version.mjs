import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const version = process.argv[2]?.trim();

if (!version) {
	console.error("Usage: pnpm version:set -- <version>");
	process.exit(1);
}

const packageJsonPath = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"../package.json",
);

const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
packageJson.version = version;

await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, "\t")}\n`);

console.log(`Updated extension version to ${version}`);
