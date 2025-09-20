<template>
    <section class="flex justify-between items-center mb-6 w-full">
        <h1 class="font-thin text-2xl text-lumy-secondary"><span>{{ formatName(activeSkill.name) }}</span></h1>
        <BaseButton
            :onAction="() => router.push('/feedback/request')"
            btnText="Request Feedback"
        />
    </section>
    <section class="flex flex-col items-center w-full bg-white text-gray-800 p-8 xl:p-12 rounded-lg">
			<h2 class="text-xl self-start mb-8">Average total sentiment over time</h2>
			<div class="w-full">
				<Line :data="avgSentChart" :options="avgSentOptions" />
			</div>
		</section>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Skill, SkillSummary, SkillOverview } from '@/types';
import { Line } from 'vue-chartjs';
import { useRouter } from 'vue-router';
import { formatName } from '@/composables/formatName';
import api from '@/services/api';

const router = useRouter();

const activeSkill = computed<SkillSummary>(() => {
    return JSON.parse(sessionStorage.getItem('selectedSkill') || '{}');
});
const skillOv = ref<SkillOverview | null>(null);

onMounted(async() => {
    const res = await api.get(`/me/skill/${activeSkill.value.skill_id}`);
    if(res.status === 200) {
        console.log('Skill data: ', res.data);
    }
});
onUnmounted(() => {
    sessionStorage.removeItem('selectedSkill');
});

const avgSentChart = computed(() => {
	const labels = skillOv.value?.average_sentiment_over_time.map((item) =>
        new Date(item.month).toLocaleString("default", { month: "short", year: "numeric" })
    ) || ['No data'];
    const data = skillOv.value?.average_sentiment_over_time.map((item) => item.avg_sentiment) || [0];
	return {
		labels, // e.g. ["2025-07", "2025-08", ...]
		datasets: [
			{
				label: 'Average Sentiment',
				data,
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