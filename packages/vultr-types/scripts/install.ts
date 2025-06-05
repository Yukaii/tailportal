import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import { generateTypings } from "./genType";

const __dirname = dirname(fileURLToPath(import.meta.url));

const indexFile = path.join(__dirname, "../src/index.ts");
if (!fs.existsSync(indexFile)) {
  console.log("Generate vultrTyping for the first time...");
  generateTypings();
}
