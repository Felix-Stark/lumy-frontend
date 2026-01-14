import { computed, ref } from "vue";
import type { DateRange, FeedbackSubmissionFull, TimeFilter, TimeSeries } from "@/types";

export function useAvgSentTimeFilter() {
    const timeFilter = ref<TimeFilter>('year')
    const activeRange = ref<DateRange | null>(null)
    const activeMonthLabel = computed(() => {
        if(!activeRange.value) return;
        return getLabel(activeRange.value.from)
    })
    const nextMonth = ref<Date>()
    const prevMonth = ref<Date>()

    function setFilter(tf: TimeFilter) {
        timeFilter.value = tf
        if(!activeMonthLabel.value && tf === 'month-drilldown') {
            const now = new Date();

            drillDownToMonth(now)
        }
    }

    function getLabel(from: Date): string {
        const label = from.toLocaleDateString('en-GB', {
            month: 'long',
            year: 'numeric'
        });
        return label;
    }

    function drillDownToMonth(date: Date) {
        timeFilter.value = 'month-drilldown'
        activeRange.value = getMonthRange(date)
    }

    function getMonthRange(date: Date): DateRange {
        const year = date.getFullYear();
        const month = date.getMonth();
        const from = new Date(year, month, 1);
        from.setHours(0, 0, 0, 0);

        const to = new Date(year, month + 1, 0);
        to.setHours(23, 59, 59, 999);

        const next = new Date(from);
        next.setMonth(next.getMonth() + 1);
        nextMonth.value = next;
        return { from, to };
    }

    function goToPrevMonth() {
        if (!activeRange.value) return
        
        const prev = activeRange.value.from;
        prev.setMonth(prev.getMonth() - 1)
        const label = getLabel(prev)

        drillDownToMonth(prev)
    }

    function goToNextMonth() {
        if (!activeRange.value) return
        
        const next = new Date(activeRange.value.from)
        next.setMonth(next.getMonth() + 1)
        nextMonth.value = next;

        drillDownToMonth(next)
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
