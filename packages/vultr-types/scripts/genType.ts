import fs from "fs";
import path from "path";
import prettier from "prettier";

interface OS {
  id: number;
  name: string;
  arch: string;
  family: string;
}

interface Region {
  id: string;
  city: string;
  country: string;
  continent: string;
  options: string[];
}

const __dirname = import.meta.dirname;

export async function generateTypings() {
  try {
    const osResponse = await fetch("https://api.vultr.com/v2/os");
    const osData: { os: OS[] } = await osResponse.json();
    const { os } = osData;

    const regionResponse = await fetch("https://api.vultr.com/v2/regions");
    const regionData: { regions: Region[] } = await regionResponse.json();
    const { regions } = regionData;

    const typingContent = `
export const os = ${JSON.stringify(os, null, 2)} as const;
export type OS = typeof os[number];

export const regions = ${JSON.stringify(regions, null, 2)} as const;
export type Region = typeof regions[number];
`;

    const formattedTypingContent = await prettier.format(typingContent, {
      parser: "typescript",
      singleQuote: true,
      trailingComma: "all",
      printWidth: 80,
    });

    fs.writeFileSync(
      path.join(__dirname, "../src/index.ts"),
      formattedTypingContent,
    );
    console.log("TypeScript typings and data generated successfully!");
  } catch (error) {
    console.error("Error generating TypeScript typings:", error);
  }
}
