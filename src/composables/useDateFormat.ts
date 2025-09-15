// src/composables/useDateFormat.ts
export function useDateFormat() {
  function formatFeedbackDate(
    dateString: string,
    options: { relative?: boolean } = { relative: true }
  ): string {
    const date = new Date(dateString);
    const now = new Date();

    if (options.relative) {
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffMonths =
        now.getMonth() -
        date.getMonth() +
        12 * (now.getFullYear() - date.getFullYear());

      if (diffDays < 1) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffMonths < 1) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
      }
      if (diffMonths <= 3) {
        return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
      }
      // More than 3 months → fall back to absolute
    }

    // Absolute date format: "12 September 2025"
    const day = String(date.getDate()).padStart(2, "0");
    const monthName = date.toLocaleString("default", { month: "long" });
    const year = String(date.getFullYear());
    return `${day} ${monthName} ${year}`;
  }

  return { formatFeedbackDate };
}

// Example usages:
//formatFeedbackDate("2025-09-12T10:00:00Z"); 
// → "Today", "Yesterday", "5 days ago", "2 weeks ago", "2 months ago", or absolute date

// formatFeedbackDate("2025-01-10T10:00:00Z"); 
// → "10 January 2025" (because > 3 months ago)

// formatFeedbackDate("2025-09-12T10:00:00Z", { relative: false }); 
// → "12 September 2025" (absolute, even if today)