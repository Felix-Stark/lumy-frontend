<template>
    <section class="flex flex-col items-center w-full bg-white text-gray-800 p-6 rounded-lg">
        <h2 class="text-xl mb-8 self-start">{{ avgSentTitle }}</h2>
        <div class="w-full flex items-center justify-between mb-4">
            <div v-if="activeRange" class="flex items-center gap-4">
                <button @click="goToPrevMonth" @mouseenter="(e: MouseEvent) => handleMouseEnter(e, 'Previous month')"
                    @mouseleave="handleMouseLeave" class="px-4 py-2 rounded-lg shadow-md bg-white cursor-pointer">
                    <ChevronLeft />
                </button>
                <button :disabled="isNextDisabled" @click="goToNextMonth"
                    @mouseenter="(e: MouseEvent) => handleMouseEnter(e, 'Next month')" @mouseleave="handleMouseLeave"
                    class="px-4 py-2 rounded-lg shadow-md bg-white cursor-pointer disabled:cursor-not-allowed">
                    <ChevronRight />
                </button>
            </div>
            <section class="w-full flex justify-end">
                <div class="flex items-center gap-6 py-2 px-4">
                    <button v-for="filter in filters" :key="filter.value"
                        @click=" setFilter(filter.value as TimeFilter)" :class="[
                            'rounded-lg shadow-md px-4 py-2 cursor-pointer',
                            timeFilter === filter.value ? 'bg-lumy-secondary text-white' : 'bg-white text-lumy-secondary'
                        ]">
                        {{ filter.label }}
                    </button>
                </div>
            </section>
        </div>
        <div class="w-full h-100 items-stretch">
            <Line ref="chartRef" :data="chartData" :options="avgSentOptions" />
        </div>
    </section>
    <Tooltip :text="tooltipText" :visible="showTooltip" :x="tooltipX" :y="tooltipY" />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, elements, registerables } from 'chart.js';
import type { ActiveElement, ChartEvent } from 'chart.js';
import type { FeedbackSubmissionFull, TimeFilter, TimeSeries } from '@/types';
import { useAvgSentTimeFilter } from '@/composables/useAvgSentTimeFilter';
import Tooltip from '@/components/base/Tooltip.vue';

const filters = [
    { value: 'month', label: '30 days' },
    { value: 'quarter', label: 'Quarter' },
    { value: 'year', label: 'Year' }
];
ChartJS.register(...registerables);
const showTooltip = ref(false)
const tooltipText = ref('')
const tooltipX = ref(0)
const tooltipY = ref(0)

function handleMouseEnter(event: MouseEvent, text: string) {
    tooltipText.value = text
    tooltipX.value = event.clientX - 12 // offset for better positioning
    tooltipY.value = event.clientY + 12
    showTooltip.value = true
}
function handleMouseLeave() {
    showTooltip.value = false
}
const props = defineProps<{
    drilldown: boolean;
    monthlySeries: TimeSeries;
    feedback?: FeedbackSubmissionFull[] | null;
}>()
const emit = defineEmits<{
    (e: 'update:drilldown', value: boolean): void;
}>();

const {
    timeFilter,
    activeRange,
    setFilter,
    goToNextMonth,
    goToPrevMonth,
    drillDownToMonth,
    aggregateSentimentPerDay,
    filterTimeSeries
} = useAvgSentTimeFilter();
const loading = ref(true);
const isNextDisabled = computed(() => {
    if (!activeRange.value) return;
    return activeRange.value.to < new Date();
});

const avgSentTitle = computed(() => {
    switch (timeFilter.value) {
        case 'month':
            emit('update:drilldown', true)
            return 'Average sentiment last 30 days';
        case 'quarter':
            activeRange.value = null
            emit('update:drilldown', false)
            return 'Average sentiment last quarter';
        case 'month-drilldown':
            return `Average sentiment ${activeRange.value?.from.toLocaleDateString('en-GB', {
                month: 'long',
                year: 'numeric'
            })}`
        case 'year':
        default:
            activeRange.value = null
            emit('update:drilldown', false)
            return 'Average sentiment last year'
    }
})


const chartData = computed(() => {
    if ((timeFilter.value === 'month' || timeFilter.value === 'month-drilldown')
        && activeRange.value && props.feedback) {
        const points = aggregateSentimentPerDay(
            props.feedback,
            activeRange.value
        )
        console.log(points)
        return {
            labels: points.map(p => p.label),
            datasets: [
                {
                    label: 'Average sentiment last month',
                    data: points.map(p => p.value),
                    fill: false,
                    borderColor: 'rgba(150, 45, 255, 1)',
                    borderDash: [5, 5],
                    tension: 0.3
                }
            ]
        }
    }
    const entries = filterTimeSeries(props.monthlySeries, timeFilter.value)

    return {
        labels: Object.keys(entries), // e.g. ["2025-07", "2025-08", ...]
        datasets: [
            {
                label: 'Average Sentiment',
                data: Object.values(entries), // e.g. [0.8, 0.85, ...]
                fill: false,
                borderColor: 'rgba(150, 45, 255, 1)',
                borderDash: [5, 5],
                tension: 0.3
            }
        ]
    };
})
const avgSentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { intersect: false },

    plugins: {
        legend: { display: false },
        title: { display: false }
    },
    scales: {
        y: {
            min: 0,
            max: 10,
            ticks: { stepSize: 2 }
        }
    },
    elements: {
        point: {
            radius: 4,
            hoverRadius: 7
        }
    },
    onHover: (event: ChartEvent, elements: ActiveElement[],) => {
        const target = event.native?.target as HTMLCanvasElement
        if (!target) return

        target.style.cursor = elements.length && activeRange ? 'pointer' : 'default'
    },
    onClick: (
        event: ChartEvent,
        elements: ActiveElement[],
        chart: any
    ) => {
        if (!elements.length) return;
        if (timeFilter.value.includes('month')) return;

        const index = elements[0].index;
        const label = chart.data.labels[index];
        emit('update:drilldown', true)
        console.log('Clicked month:', label);
        drillDownToMonth(label);
    },

};

</script>