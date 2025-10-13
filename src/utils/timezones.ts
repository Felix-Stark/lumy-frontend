// utils/timezones.ts
export interface TZOption { label: string; value: string; zones: string[] }

function partsFor(date: Date, timeZone: string) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  const parts = fmt.formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = p.value;
  }
  return map;
}

export function buildTimezoneOptions() {
  const now = new Date();
  const timezones = Intl.supportedValuesOf("timeZone");
  const groups: Record<string, string[]> = {};

  for (const tz of timezones) {
    // Use Intl.DateTimeFormat to get the timezone offset reliably
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      timeZoneName: "shortOffset",
    });
    const parts = fmt.formatToParts(now);
    const offsetPart = parts.find(p => p.type === "timeZoneName")?.value || "";

    // Parse offset (e.g. "GMT+2", "UTC-05:00", etc.)
    const match = offsetPart.match(/([+-]\d{1,2})(?::?(\d{2}))?/);
    const hours = match ? parseInt(match[1], 10) : 0;
    const minutes = match ? parseInt(match[2] || "0", 10) : 0;
    const sign = hours >= 0 ? "+" : "-";
    const offsetLabel = `UTC${sign}${String(Math.abs(hours)).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

    if (!groups[offsetLabel]) groups[offsetLabel] = [];
    groups[offsetLabel].push(tz);
  }

  const options = Object.entries(groups)
    .map(([offset, zones]) => {
      const cityNames = zones.map((z) => z.split("/").pop()?.replace(/_/g, " ") || z);
      const shownCities = Array.from(new Set(cityNames)).slice(0, 3);
      const label = `${offset} — ${shownCities.join(", ")}`;

      return {
        label,
        value: zones[0],
        zones,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  return options;
}
