export const ALL_FILTER_VALUE = "all";

export function getCountry(location: string): string {
  return location.split(",").at(-1)?.trim() || location;
}

export function formatCategory(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function getCategoryHue(category: string): number {
  return [...category].reduce((hash, character) => (hash * 17 + character.charCodeAt(0)) % 360, 0);
}

export function getWorkModeHue(workMode: string): number {
  const hues: Record<string, number> = {
    remote: 205,
    hybrid: 275,
    "on-site": 145,
  };
  return hues[workMode] ?? 210;
}

export function formatPublishedDate(value: string): string {
  const date = new Date(`${value.replace(" ", "T")}Z`);

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
