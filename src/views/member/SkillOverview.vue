<template>
    <section class="flex justify-between items-center mb-6 w-full">
        <h1 class="font-thin text-2xl text-lumy-secondary">Skill: <span class="font-normal">{{ formatName(activeSkill.name) }}</span></h1>
        <BaseButton
            :onAction="() => router.push('/feedback/request')"
            btnText="Request Feedback"
        />
    </section>
    <section class="w-full p-8 xl:p-12 flex justify-center bg-lumy-danger"><span class="rounded-full border border-white font-bold text-2xl">!</span> It’s been a while since you showed this skill some love — go request some fresh feedback!</section>
    <section class="w-full bg-white p-8 xl:p-12 text-gray-800">
        <p class="text-xl font-gray-600">{{ skillOv?.skill_definition }}</p>
    </section>
    <section class="flex flex-col items-center w-full bg-white text-gray-800 p-8 xl:p-12 rounded-lg">
        <h2 class="text-xl self-start mb-8">Average total sentiment over time</h2>
        <div class="w-full">
            <Line :data="avgSentChart" :options="avgSentOptions" />
        </div>
    </section>
    <section class="flex items-center w-full bg-white p-8 xl:p-12 rounded-lg">
        <div class="w-full">
            <Bar :data="sentOvData" :options="sentOvOptions" />
        </div>
        <div class="flex">
            <div class="flex flex-col items-center mx-4">
                <p class="font-thin">
                    Negative
                </p>
                <div class="flex">
                    <Frown :class="['text-lumy-danger-light size-4']" />
                    <p class="font-bold text-lg">{{ skillSent.negSent }}</p>
                </div>
            </div>
            <div class="flex flex-col items-center mx-4">
                <p class="font-thin">
                    Neutral
                </p>
                <div class="flex">
                    <Annoyed :class="['text-lumy-neutral-light size-4']" />
                    <p class="font-bold text-lg">{{ skillSent.neuSent }}</p>
                </div>
            </div>
            <div class="flex flex-col items-center mx-4">
                <p class="font-thin">
                    Positive
                </p>
                <div class="flex">
                    <Smile :class="['text-lumy-green-light size-4']" />
                    <p class="font-bold text-lg">{{ skillSent.posSent }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Skill, SkillSummary, SkillOverview } from '@/types';
import { Line, Bar } from 'vue-chartjs';
import { Chart, registerables } from 'chart.js'
import { useRouter } from 'vue-router';
import { formatName } from '@/composables/formatName';
import api from '@/services/api';
import { Annoyed, Frown, Smile } from 'lucide-vue-next';

Chart.register(...registerables);
const router = useRouter();

const activeSkill = computed<SkillSummary>(() => {
    return JSON.parse(sessionStorage.getItem('selectedSkill') || '{}');
});
const skillOv = ref<SkillOverview | null>(null);

onMounted(async() => {
   try {
        if (activeSkill.value && activeSkill.value.skill_id) {
            const response = await api.get(`/me/skill/${activeSkill.value.skill_id}`);
            if (response.status === 200) {
                skillOv.value = response.data;
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
onUnmounted(() => {
    sessionStorage.removeItem('selectedSkill');
});

const skillSent = computed(() => {
    const negSent = skillOv.value?.submission_counts.by_sentiment.negative || 0;
    const neuSent = skillOv.value?.submission_counts.by_sentiment.neutral || 0;
    const posSent = skillOv.value?.submission_counts.by_sentiment.positive || 0;
    return { negSent, neuSent, posSent, total: skillOv.value?.submission_counts.total };
})

// const skillSentiments = computed(() => {
//     const negSent = skillOv.value?.feedback_received?.filter(fb => fb.sentiment === 'negative').length || 0;
//     const neuSent = skillOv.value?.feedback_received?.filter(fb => fb.sentiment === 'neutral').length || 0;
//     const posSent = skillOv.value?.feedback_received?.filter(fb => fb.sentiment === 'positive').length || 0;
//     return { negSent, neuSent, posSent };
// })

const sentOvData = computed(() => {
    const negSent = skillOv.value?.submission_counts.by_sentiment.negative || 0;
    const neuSent = skillOv.value?.submission_counts.by_sentiment.neutral || 0;
    const posSent = skillOv.value?.submission_counts.by_sentiment.positive || 0;
    const total = skillOv.value?.submission_counts.total || 1; // avoid division by zero
    return {
        labels: ["Sentiments"],
        datasets: [
            {
                label: 'Negative',
                backgroundColor: 'rgba(252, 92, 101, 1)',
                data: [negSent]
            },
            {
                label: 'Neutral',
                backgroundColor: 'rgba(255, 195, 110, 1)',
                data: [neuSent]
            },
            {
                label: 'Positive',
                backgroundColor: 'rgba(127, 228, 126, 1)',
                data: [posSent]
            }
        ]
    }
});

const sentOvOptions = {
    indexAxis: "y" as const, // horizontal
  responsive: true,
  plugins: {
    legend: { display: false }, // hide default legend
  },
  scales: {
    x: {
      stacked: true,
      display: false, // hide axis
    },
    y: {
      stacked: true,
      display: false, // hide axis
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