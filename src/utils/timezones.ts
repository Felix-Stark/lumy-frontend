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
    // Get local time in that timezone
    const date = new Date(now.toLocaleString("en-GB", { timeZone: tz }));
    const offsetMinutes = (date.getTime() - now.getTime()) / 60000;
    const totalMinutes = Math.round(offsetMinutes);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.abs(totalMinutes % 60);
    const sign = totalMinutes >= 0 ? "+" : "-";
    const offsetLabel = `UTC${sign}${String(Math.abs(hours)).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

    if (!groups[offsetLabel]) groups[offsetLabel] = [];
    groups[offsetLabel].push(tz);
  }

  // Convert groups into nice readable labels
  const options = Object.entries(groups)
    .map(([offset, zones]) => {
      // Extract city names (the part after the last slash)
      const cityNames = zones.map((z) => z.split("/").pop()?.replace(/_/g, " ") || z);

      // Take up to 3 unique city names
      const shownCities = Array.from(new Set(cityNames)).slice(0, 3);

      // Build label like: "UTC+01:00 — Stockholm, Berlin, Paris"
      const label = `${offset} — ${shownCities.join(", ")}`;

      return {
        label,
        value: zones[0], // pick the first timezone as representative
        zones,
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label));

  return options;
}

