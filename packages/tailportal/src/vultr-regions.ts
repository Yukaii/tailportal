// Vultr regions data
export const regions = [
  { id: "ewr", city: "New Jersey", country: "US", continent: "North America", options: [] },
  { id: "ord", city: "Chicago", country: "US", continent: "North America", options: [] },
  { id: "dfw", city: "Dallas", country: "US", continent: "North America", options: [] },
  { id: "sea", city: "Seattle", country: "US", continent: "North America", options: [] },
  { id: "lax", city: "Los Angeles", country: "US", continent: "North America", options: [] },
  { id: "atl", city: "Atlanta", country: "US", continent: "North America", options: [] },
  { id: "ams", city: "Amsterdam", country: "NL", continent: "Europe", options: [] },
  { id: "lhr", city: "London", country: "GB", continent: "Europe", options: [] },
  { id: "fra", city: "Frankfurt", country: "DE", continent: "Europe", options: [] },
  { id: "cdg", city: "Paris", country: "FR", continent: "Europe", options: [] },
  { id: "nrt", city: "Tokyo", country: "JP", continent: "Asia", options: [] },
  { id: "icn", city: "Seoul", country: "KR", continent: "Asia", options: [] },
  { id: "sgp", city: "Singapore", country: "SG", continent: "Asia", options: [] },
  { id: "syd", city: "Sydney", country: "AU", continent: "Australia", options: [] }
] as const;

export type Region = typeof regions[number];