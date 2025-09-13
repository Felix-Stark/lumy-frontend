<template>
    <div class="flex flex-col items-center h-full w-full p-4 md:p-8 lg:w-4/5 xl:w-3/4 2xl:w-2/3 mx-auto">
        <section class="flex flex-col md:flex-row w-full gap-6">
            <div class="bg-white shadow-md rounded-lg p-6 w-full flex justify-center items-center">
                

            </div>
            <div class="bg-white shadow-md rounded-lg p-6 w-full">
                <p>{{ positiveSentiments }}</p>
                <button @click="() => console.log('positive sentiment: ', positiveSentiments)">CLICK IT!</button>

            </div>
        </section>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import { Doughnut } from 'vue-chartjs';
import { useUserStore } from '@/stores/userStore';
import { useFeedbackStore } from '@/stores/feedbackStore';
import type { UserSummary, SkillSummary, FeedbackSubmission } from '@/types.ts';

Chart.register(...registerables);
const userStore = useUserStore();
const feedbackStore = useFeedbackStore();
const summary = ref<UserSummary | null>();
const feedbackList = ref<FeedbackSubmission[]>([]);
const positiveSentiments = computed(() => {
    const positive = feedbackList.value.map((fb) => {
        if(fb.sentiment === 'positive') {
            return fb.sentiment_score
        }
    });
    return ((positive.length / feedbackList.value.length) * 100 || 0);
})

onMounted(async() => {
    if(!summary.value) {
        await userStore.getMeSummary();
        summary.value = userStore.meSummary;
    }
    if(feedbackStore.submissions.length === 0) {
        await feedbackStore.fetchSubmissions();
        feedbackList.value = feedbackStore.submissions;
    }
    console.log('Feedback List:', feedbackList.value);
    console.log('summary: ', summary.value);

});

const avgSentChart = computed(() => {
	const avgSent = summary.value?.avg_sentiment || {};
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
      max: 10,
      ticks: { stepSize: 2 }
    }
  }
};
</script>