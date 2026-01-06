import type { DateRange, FeedbackSubmissionFull, TimeSeries } from "@/types";

export function filtered(ts: TimeSeries, tf: string): TimeSeries {
    const keys = Object.keys(ts).sort((a, b) => new Date(a + '-01').getTime() - new Date(b + '-01').getTime());
    let numToTake: number;
    switch (tf) {
        case 'month':
            numToTake = 1;
            break;
        case 'quarter':
            numToTake = 3;
            break;
        case 'year':
        default:
            numToTake = keys.length;
            break;
    }
    const filteredKeys = keys.slice(-numToTake);
    const filteredTs: TimeSeries = {};
    filteredKeys.forEach(key => {
        filteredTs[key] = ts[key];
    });
    console.log('filteredKeys: ', filteredKeys)
    return filteredTs;
}

export function getMonthRange(label: string): DateRange {
  const [monthName, year] = label.split(' ')
  const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth()

  const from = new Date(Number(year), monthIndex, 1)
  const to = new Date(Number(year), monthIndex + 1, 0, 23, 59, 59)

  return { from, to }
}

export function getLastMonthRange() {
  const to = new Date()
  to.setHours(23, 59, 59, 999 );
  const from = new Date(to)
  from.setDate(from.getDate() - 29)
  from.setHours(0,0,0,0)

  return { from, to }
}

export function filterFeedbackByRange(
	feedback: FeedbackSubmissionFull[],
	start: Date,
	end: Date
) {
  console.log('start: ', start)
  console.log('end: ', end)
	return feedback.filter(f => {
    console.log('feedback in .filter: ', f)
		const created = new Date(f.created_at)
		return created >= start && created <= end
	})
}

export function mapFeedbackToPoints(feedback: FeedbackSubmissionFull[]) {
  console.log('feedback in timeFilter: ', feedback);
  return feedback.map(f => ({
    date: f.created_at, // keep full ISO for precision
    sentiment: f.sentiment_score
  }))
}

export function aggregateSentimentPerDay(
  feedback: FeedbackSubmissionFull[],
  from: Date,
  to: Date): { label: string; value: number }[] {
    console.log('aggregatedSentimentPerDay activated')
  const buckets = new Map<string, number[]>()

  for (const f of feedback) {
    const date = new Date(f.created_at)
    if (date < from || date > to) continue

    const key = date.toISOString().slice(0, 10)

    if (!buckets.has(key)) {
      buckets.set(key, [])
    }
    buckets.get(key)!.push(f.sentiment_score)
  };

  const result: { label: string; value: number }[] = [] 
  const cursor = new Date(from)

  while (cursor <= to) {
    const key = cursor.toISOString().slice(0, 10)
    const values = buckets.get(key) ?? []

    const avg = values.length === 0 ? 0 : values.reduce((a, b) => a + b, 0) / values.length
    
    result.push({
      label: cursor.toLocaleDateString('en-GB', {
        month: 'short',
        day: '2-digit'
      }),
      value: Number(avg.toFixed(2)) / 10,
    })

    cursor.setDate(cursor.getDate() + 1)
  }
  console.log('result aggSent: ', result);
  return result;
};
