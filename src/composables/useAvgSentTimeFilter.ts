import { ref } from "vue";
import type { DateRange, FeedbackSubmissionFull, TimeFilter, TimeSeries } from "@/types";

export function useAvgSentTimeFilter() {
    const timeFilter = ref<TimeFilter>('year')
    const activeRange = ref<DateRange | null>(null)
    const activeMonthLabel = ref<string | null>(null)
    const nextMonth = ref<Date>()
    const prevMonth = ref<Date>()

    function setFilter(tf: TimeFilter) {
        timeFilter.value = tf
        activeMonthLabel.value = null

        if (tf === 'month') {
            activeRange.value = getLast30DaysRange()
        }
    }

    function getMonthRange(label: string): DateRange {
        const [monthName, year] = label.split(' ')
        const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth()

        const from = new Date(Number(year), monthIndex, 1)
        from.setHours(0, 0, 0, 0)
        const to = new Date(Number(year), monthIndex + 1, 0, 23, 59, 59)
        const next = new Date(from)
        next.setMonth(next.getMonth() + 1)
        nextMonth.value = next;
        return { from, to }
    }

    function drillDownToMonth(label: string) {
        timeFilter.value = 'month-drilldown'
        activeMonthLabel.value = label
        activeRange.value = getMonthRange(label)
    }

    function goToPrevMonth() {
        if (!activeRange.value) return
        if(timeFilter.value === 'month') {
            prevMonth.value = activeRange.value.to
        } else {
            prevMonth.value = activeRange.value.from
        }
        const prev = prevMonth.value;
        prev.setMonth(prev.getMonth() - 1)
        const label = prev.toLocaleDateString('en-GB', {
            month: 'long',
            year: 'numeric'
        })
        drillDownToMonth(label)
    }

    function goToNextMonth() {
        if (!activeMonthLabel.value) return

        const { from } = getMonthRange(activeMonthLabel.value!)
        const next = new Date(from)
        next.setMonth(next.getMonth() + 1)
        nextMonth.value = next;
        const label = next.toLocaleDateString('en-GB', {
            month: 'long',
            year: 'numeric'
        })

        drillDownToMonth(label)
    }

    function getLast30DaysRange(): DateRange {
        const to = new Date()
        to.setHours(23, 59, 59, 999)

        const from = new Date(to)
        from.setDate(from.getDate() - 29)
        from.setHours(0, 0, 0, 0)
        const next = new Date(from);
        next.setMonth(next.getMonth() +1)
        nextMonth.value = next;
        activeMonthLabel.value = next.toLocaleDateString('en-GB', {
            month: 'long',
            year: 'numeric'
        });
        return { from, to }
    }

    function filterTimeSeries(ts: TimeSeries, tf: TimeFilter): TimeSeries {
        const keys = Object.keys(ts).sort(
            (a, b) => new Date(a + '-01').getTime() - new Date(b + '-01').getTime()
        )

        let numToTake = keys.length
        if (tf === 'month') numToTake = 1
        if (tf === 'quarter') numToTake = 3

        return Object.fromEntries(
            keys.slice(-numToTake).map(k => [k, ts[k]])
        )
    }

    function aggregateSentimentPerDay(
        feedback: FeedbackSubmissionFull[],
        range: DateRange
    ) {
        const buckets = new Map<string, number[]>()

        for (const f of feedback) {
            const date = new Date(f.created_at)
            if (date < range.from || date > range.to) continue

            const key = date.toISOString().slice(0, 10)
            if (!buckets.has(key)) buckets.set(key, [])
            buckets.get(key)!.push(f.sentiment_score)
        }

        const result: { label: string; value: number }[] = []
        const cursor = new Date(range.from)

        while (cursor <= range.to) {
            const key = cursor.toISOString().slice(0, 10)
            const values = buckets.get(key) ?? []

            const avg =
                values.length === 0
                    ? 0
                    : values.reduce((a, b) => a + b, 0) / values.length

            result.push({
                label: cursor.toLocaleDateString('en-GB', {
                    month: 'short',
                    day: '2-digit'
                }),
                value: Number((avg / 10).toFixed(2))
            })

            cursor.setDate(cursor.getDate() + 1)
        }

        return result
    }

    return {
        // state
        timeFilter,
        activeRange,
        activeMonthLabel,
        nextMonth,

        // actions
        setFilter,
        drillDownToMonth,
        goToPrevMonth,
        goToNextMonth,

        // helpers
        filterTimeSeries,
        aggregateSentimentPerDay
    }
}
