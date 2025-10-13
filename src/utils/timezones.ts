// utils/timezones.ts
export interface TZOption { label: string; value: string; }

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

function offsetMinutesFor(timeZone: string, when = new Date()): number {
  const pTz = partsFor(when, timeZone);
  const pUtc = partsFor(when, "UTC");

  const tzMs = Date.UTC(
    Number(pTz.year),
    Number(pTz.month) - 1,
    Number(pTz.day),
    Number(pTz.hour),
    Number(pTz.minute),
    Number(pTz.second)
  );

  const utcMs = Date.UTC(
    Number(pUtc.year),
    Number(pUtc.month) - 1,
    Number(pUtc.day),
    Number(pUtc.hour),
    Number(pUtc.minute),
    Number(pUtc.second)
  );

  // offset in minutes (tz minus UTC). e.g. Stockholm => 120
  const diffMinutes = Math.round((tzMs - utcMs) / 60000);
  return diffMinutes;
}

function formatOffsetLabel(mins: number) {
  const sign = mins >= 0 ? "+" : "-";
  const abs = Math.abs(mins);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  return `(UTC${sign}${hh}:${mm})`;
}

export function buildTimezoneOptions(timeZones: string[]): TZOption[] {
  const now = new Date();
  const options = timeZones.map((tz) => {
    const mins = offsetMinutesFor(tz, now);
    const city = tz.split("/").pop()?.replace("_", " ") ?? tz;
    const label = `${formatOffsetLabel(mins)} ${city}`;
    return { label, value: tz };
  }).sort((a, b) => a.label.localeCompare(b.label));
  return options;
}
