import type { FeedbackSubmissionFull, TimeSeries } from "@/types";

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

export function getLastMonthRange() {
  const end = new Date()
  end.setHours(23, 59, 59, 999 );
  const start = new Date(end)
  start.setDate(start.getDate() - 29)
  start.setHours(0,0,0,0)

  return { start, end }
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

export function aggregateSentimentPerDay(feedback: FeedbackSubmissionFull[]) {
  const map = new Map<string, { sum: number; count: number }>()

  feedback.forEach(f => {
    const day = new Date(f.created_at).toISOString().slice(0, 10) // YYYY-MM-DD
    console.log('day in timeFilter: ', day)
    const entry = map.get(day) ?? { sum: 0, count: 0 }
    entry.sum += f.sentiment_score
    entry.count += 1

    map.set(day, entry)
  })
  
  return Array.from(map.entries()).map(([date, { sum, count }]) => ({
    date,
    sentiment: Number((sum / count).toFixed(2))
  }))
}
