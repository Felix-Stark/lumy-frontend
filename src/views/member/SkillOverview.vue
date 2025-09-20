<template>
    <section class="flex justify-between items-center mb-6 w-full">
        <h1 class="font-thin text-2xl text-lumy-secondary">Skill: <span class="font-normal">{{ formatName(activeSkill.name) }}</span></h1>
        <BaseButton
            :onAction="() => router.push('/feedback/request')"
            btnText="Request Feedback"
        />
    </section>
    <section class="w-full p-8 xl:p-12 flex justify-center items-center bg-lumy-danger rounded-lg shadow-md"><div class="rounded-full border-4 flex justify-center items-center border-white font-bold size-4 text-white text-xl">!</div><p class="text-white">It's been a while since you showed this skill some love — go request some fresh feedback!</p></section>
    <section class="w-full bg-white p-8 xl:p-12 text-gray-800 rounded-lg shadow-md">
        <p class="text-xl font-gray-600">{{ skillOv?.skill_definition }}</p>
    </section>
    <section class="flex flex-col items-center w-full bg-white text-gray-800 p-8 xl:p-12 rounded-lg shadow-md">
        <h2 class="text-xl self-start mb-8">Average total sentiment over time</h2>
        <div class="w-full">
            <Line :data="avgSentChart" :options="avgSentOptions" />
        </div>
    </section>
    <section class="flex items-center w-full bg-white p-8 xl:p-12 rounded-lg shadow-md">
        <div class="w-full h-12">
            <Bar :data="sentOvData" :options="sentOvOptions" />
        </div>
        <div class="flex">
            <div class="flex flex-col items-center mx-4">
                <p class="font-thin">
                    Negative
                </p>
                <div class="flex">
                    <Frown :class="['text-lumy-danger-light size-6']" />
                    <p class="font-bold text-lg text-gray-800">{{ skillSent.negSent }}</p>
                </div>
            </div>
            <div class="flex flex-col items-center mx-4">
                <p class="font-thin">
                    Neutral
                </p>
                <div class="flex">
                    <Annoyed :class="['text-lumy-neutral-light size-6']" />
                    <p class="font-bold text-lg text-gray-800">{{ skillSent.neuSent }}</p>
                </div>
            </div>
            <div class="flex flex-col items-center mx-4">
                <p class="font-thin">
                    Positive
                </p>
                <div class="flex">
                    <Smile :class="['text-lumy-green-light size-6']" />
                    <p class="font-bold text-lg text-gray-800">{{ skillSent.posSent }}</p>
                </div>
            </div>
            <div class="flex flex-col items-center mx-4">
                <p class="font-thin">
                    Total
                </p>
                <p class="font-bold text-lg text-gray-800">{{ skillSent.posSent }}</p>
            </div>
            
        </div>
    </section>
    <section class="flex flex-col lg:flex-row lg:flex-wrap justify-between w-full gap-8 space-y-8">
        <div v-if="feedbackList?.length === 0" class="text-gray-500">No feedback available.</div>
        <div v-else v-for="feedback in feedbackList" :key="feedback.id" class="flex flex-col justify-evenly bg-white shadow-md rounded-lg p-8 w-full gap-8 lg:max-w-[48%] min-h-60 xl:p-12 ">
            <p class="text-gray-800">{{ feedback.content }}</p>
            <div class=" flex flex-col w-full gap-8">
                <p class="text-gray-600 italic">{{ feedback.feedback_request?.recipient.name ? '-'+formatName(feedback.feedback_request?.recipient.name) : '' }}</p>
                <div class="flex align-center gap-4">
                    <p class="font-thin text-gray-600">{{ feedback.feedback_request?.skill.skill }}</p>
                    <p class="font-thin text-sm ml-6">{{ formatFeedbackDate(feedback.created_at, { relative: true }) }}</p>
                    <span>
                        <template v-if="feedback.sentiment === 'positive'">
                            <Smile class="inline size-6 text-green-600"
                                @mouseenter="(e: MouseEvent) => handleMouseEnter(e, 'Positive sentiment')"
                                @mouseleave="handleMouseLeave"
                                />
                        </template>
                        <template v-else-if="feedback.sentiment === 'negative'">
                            <Frown class="inline size-6 text-red-600"
                            @mouseenter="(e: MouseEvent) => handleMouseEnter(e, 'Negative sentiment')"
                            @mouseleave="handleMouseLeave"
                            />
                        </template>
                        <template v-else>
                            <Annoyed class="inline size-6 text-yellow-600"
                            @mouseenter="(e: MouseEvent) => handleMouseEnter(e, 'Neutral sentiment')"
                            @mouseleave="handleMouseLeave"
                            />
                        </template>
                    </span>
                </div>
            </div>
        </div>
    </section>
    <Tooltip
    :text="tooltipText"
    :x="tooltipX"
    :y="tooltipY"
    :visible="showTooltip"
    />
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import Tooltip from '@/components/base/Tooltip.vue';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Skill, SkillSummary, SkillOverview, FeedbackSubmission } from '@/types';
import { Line, Bar } from 'vue-chartjs';
import { Chart, registerables, type ChartOptions } from 'chart.js'
import { useRouter } from 'vue-router';
import { formatName } from '@/composables/formatName';
import api from '@/services/api';
import { Annoyed, Frown, Smile } from 'lucide-vue-next';
import { useDateFormat } from '@/composables/useDateFormat';
const { formatFeedbackDate } = useDateFormat();
Chart.register(...registerables);
const router = useRouter();

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


const activeSkill = computed<SkillSummary>(() => {
    return JSON.parse(sessionStorage.getItem('selectedSkill') || '{}');
});
const feedbackList = ref<FeedbackSubmission[]>();

const skillOv = ref<SkillOverview | null>(null);

onMounted(async() => {
   try {
        if (activeSkill.value && activeSkill.value.skill_id) {
            const response = await api.get(`/me/skill/${activeSkill.value.skill_id}`);
            if (response.status === 200) {
                skillOv.value = response.data;
                feedbackList.value = response.data.feedback_received;
            } else {
                router.push('/member/overview');
            }
        } else {
            router.push('/member/overview');
        }
    } catch (error) {
        console.error('Error fetching skill overview:', error);
        router.push('/member/overview');
    }
    console.log('skill overview: ', skillOv.value);
});

const skillSent = computed(() => {
    const negSent = skillOv.value?.submission_counts.by_sentiment.negative || 0;
    const neuSent = skillOv.value?.submission_counts.by_sentiment.neutral || 0;
    const posSent = skillOv.value?.submission_counts.by_sentiment.positive || 0;
    return { negSent, neuSent, posSent, total: skillOv.value?.submission_counts.total };
})

const sentOvData = computed(() => {
    

    return {
        labels: ["Sentiments"],
        datasets: [
            {
                label: 'Negative',
                backgroundColor: 'rgba(252, 92, 101, 1)',
                data: [skillSent.value.total ? (skillSent.value.negSent / skillSent.value.total) * 100 : 0],
                borderRadius: 5
            },
            {
                label: 'Neutral',
                backgroundColor: 'rgba(255, 195, 110, 1)',
                data: [skillSent.value.total ? (skillSent.value.neuSent / skillSent.value.total) * 100 : 0],
                borderRadius: 5
            },
            {
                label: 'Positive',
                backgroundColor: 'rgba(127, 228, 126, 1)',
                data: [skillSent.value.total ? (skillSent.value.posSent / skillSent.value.total) * 100 : 0],
                borderRadius: 5
            }
        ]
    }
});

const sentOvOptions: ChartOptions<"bar"> = {
    indexAxis: "y" as const, // horizontal
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }, // hide default legend
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.raw as number}%`,
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      display: false, // hide axis
      min:0,
      max:100,
    },
    y: {
      stacked: true,
      display: false, // hide axis
      ticks: {
        callback: (val: string | number) => `${val}%`,
      },
    },
  },
}

const avgSentChart = computed(() => {
    const avgSent = skillOv.value?.avg_sentiment || {};
	return {
		labels: Object.keys(avgSent), // e.g. ["2025-07", "2025-08", ...]
		datasets: [
			{
				label: 'Average Sentiment',
				data: Object.values(avgSent), // e.g. [0.8, 0.85, ...]
				fill: false,
				borderColor: 'rgba(150, 45, 255, 1)',
				borderDash: [ 5, 5 ],
				tension: 0.4
			}
		]
	};
})

const avgSentOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    title: { display: false }
  },
  scales: {
    y: {
      min: 0,
      max: 100+'%',
      ticks: { stepSize: 20 }
    }
  }
};

</script>