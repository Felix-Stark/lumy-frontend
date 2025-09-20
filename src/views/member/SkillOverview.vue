<template>
    <section class="flex justify-between items-center mb-6 w-full">
        <h1 class="font-thin text-2xl text-lumy-secondary"><span>{{ formatName(activeSkill.name) }}</span></h1>
        <BaseButton
            :onAction="() => router.push('/feedback/request')"
            btnText="Request Feedback"
        />
    </section>
    <section class="w-full bg-white rounded-lg shadow-md p-6 lg:p-8">
        <p>{{  }}</p>
    </section>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { Skill, SkillSummary, SkillOverview } from '@/types';
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
    );
    const data = skillOv.value?.average_sentiment_over_time.map((item) => item.avg_sentiment);
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