import fs from "fs";
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

async function generateTypings() {
  try {
    const osResponse = await fetch("https://api.vultr.com/v2/os");
    const osData: { os: OS[] } = await osResponse.json();
    const { os } = osData;

    const regionResponse = await fetch("https://api.vultr.com/v2/regions");
    const regionData: { regions: Region[] } = await regionResponse.json();
    const { regions } = regionData;

    const osTypes = os
      .map(
        (item) => `
{
  id: ${item.id},
  name: '${item.name}',
  arch: '${item.arch}',
  family: '${item.family}'
}
`,
      )
      .join(" |\n");

    const regionTypes = regions
      .map(
        (region) => `
{
  id: '${region.id}',
  city: '${region.city}',
  country: '${region.country}',
  continent: '${region.continent}',
  options: [${region.options.map((option) => `'${option}'`).join(", ")}]
}
`,
      )
      .join(" |\n");

    const typingContent = `
export type OS = ${osTypes};

export type Region = ${regionTypes};
`;

    const formattedTypingContent = await prettier.format(typingContent, {
      parser: "typescript",
      singleQuote: true,
      trailingComma: "all",
      printWidth: 80,
    });

    fs.writeFileSync("vultr-typings.d.ts", formattedTypingContent);

    const dataContent = `
export const os = ${JSON.stringify(os, null, 2)};

export const regions = ${JSON.stringify(regions, null, 2)};
`;

    const formattedDataContent = await prettier.format(dataContent, {
      parser: "babel",
      singleQuote: true,
      trailingComma: "all",
      printWidth: 80,
    });

    fs.writeFileSync("vultr-data.js", formattedDataContent);
    console.log("TypeScript typings and data generated successfully!");
  } catch (error) {
    console.error("Error generating TypeScript typings:", error);
  }
}

generateTypings();
