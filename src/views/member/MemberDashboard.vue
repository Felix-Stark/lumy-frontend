<template>
	<DashSkeleton v-if="loading === true" :isOpen="loading" />
	<div v-else class="flex flex-col items-center gap-6 w-full my-12 lg:my-20">
		<div v-if="user" class="absolute top-8 left-8 lg:top-20 lg:left-20 flex items-center mb-8">
			<p class="text-lg flex items-center text-gray-600">{{ formatName(user.name) }}'s overview</p>
		</div>
		<header class="grid grid-cols-2 xl:grid-cols-2 2xl:mx-8 lg:mt-8 w-full items-stretch gap-6">
			<HeadCard
				:title="`${summary?.feedback_received_count ?? 0}`"
				description="Feedback received"
			>
				<Heart
				class="w-12 h-12 text-red-500"
				fill="currentColor"
				/>
			</HeadCard>
			<HeadCard
				:title="`${summary?.feedback_given_count ?? 0}`"
				description="Feedback given"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" class="lucide lucide-message-square-quote-icon lucide-message-square-quote text-blue-500">
					<!-- Outer shape filled blue -->
					<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<!-- Shorter paths (quotes) in white -->
					<path d="M8 12a2 2 0 0 0 2-2V8H8" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
					<path d="M14 12a2 2 0 0 0 2-2V8h-2" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
				</svg>
			</HeadCard>
			<HeadCard
				:title="summary?.top_positive_skill || 'N/A'"
				description="Most mentioned strength"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24" fill="currentColor" stroke="#fff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-award-icon lucide-award text-lumy-purple"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>
			</HeadCard>
			<HeadCard
				:title="`${summary?.positive_sentiment_percentage + '%'}`"
				description="Postive feedback given"
			>
			<svg width="34" height="40" viewBox="0 0 30 36" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M6.08365 3.75183C5.85069 1.22515 8.7026 -0.412123 10.7867 1.05183L16.4032 4.99713L22.7219 2.29921C25.0666 1.29811 27.5138 3.48921 26.7577 5.91252L24.7198 12.4432L29.2528 17.5852C30.9348 19.4931 29.5954 22.4846 27.044 22.5183L20.168 22.6092L16.6508 28.485C15.3457 30.6653 12.0707 30.323 11.25 27.9206L9.03822 21.446L2.33149 19.9356C-0.157125 19.3751 -0.841798 16.1721 1.20241 14.6535L6.71146 10.5612L6.08365 3.75183Z" fill="#7FE47E"/>
			<path d="M24.582 26.6436C24.0866 25.7903 22.9893 25.4979 22.1312 25.9906C21.2731 26.4832 20.979 27.5743 21.4745 28.4276L25.0628 34.6077C25.5582 35.461 26.6555 35.7533 27.5136 35.2607C28.3717 34.768 28.6657 33.6769 28.1703 32.8237L24.582 26.6436Z" fill="#7FE47E"/>
			</svg>
			</HeadCard>
		</header>
		<section class="w-full bg-lumy-purple text-white text-center p-8 rounded-lg">
			<p>{{ summary?.chatgpt_summary.positive != null ? summary?.chatgpt_summary.positive : summary?.chatgpt_summary.improvement }}</p>
		</section>
		<section class="flex flex-col items-center w-full bg-white text-gray-800 p-6 rounded-lg">
			<h2 class="text-xl self-start mb-8">Average total sentiment over time</h2>
			<div class="w-full h-100 items-stretch">
				<Line :data="avgSentChart" :options="avgSentOptions" />
			</div>
		</section>
		<section class="flex flex-col w-full bg-white text-gray-800 p-8 rounded-lg">
			<h2 class="text-xl self-start mb-4">Skills Overview</h2>
			<div class="overflow-x-auto">
				<table class="min-w-full rounded-lg">
					<thead>
						<tr>
						<th class="px-6 py-4 text-left font-thin text-gray-500">Skill</th>
						<th class="px-6 py-4 text-left font-thin text-gray-500">Sentiment</th>
						<th class="px-6 py-4 text-left font-thin text-gray-500"># of feedback</th>
						<th class="px-6 py-4 text-left font-thin text-gray-500">Last feedback received</th>
						</tr>
					</thead>
					<tbody>
						<tr
						v-for="skill in summary?.skills_summary"
						:key="skill.skill_id"
						class="hover:bg-gray-50 cursor-pointer"
						@click="selectedSkill(skill)"
						>
							<td class="px-6 py-4">{{ skill.name }}</td>

							<td v-if="skill.average_sentiment >= 0.60" class="px-6 py-4 text-green-500">
								Strength
							</td>
							<td v-else-if="skill.average_sentiment > 0.40 && skill.average_sentiment < 0.60" class="px-6 py-4 text-yellow-500">
								Average
							</td>
							<td v-else-if="skill.average_sentiment === 0" class="px-6 py-4 text-gray-500">
								No feedback
							</td>
							<td v-else class="px-6 py-4 text-red-500">
								Needs improvement
							</td>

							<td class="px-6 py-4 text-center">{{ skill.feedback_count }}</td>
							<td class="px-6 py-4">
								{{ skill.last_feedback_received ? formatFeedbackDate(skill.last_feedback_received) : 'None' }}
							</td>
							<td class="px-6 py-4 text-right">
								<ChevronRight />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>

		<section class="flex flex-col items-center w-full bg-white text-gray-800 p-8 xl:p-12 rounded-lg">
			<h2 class="text-xl self-start mb-8">Feedback over time</h2>
			<div class="w-full h-100 self-stretch">
				<Line :data="feedbackChart" :options="feedbackChartOptions" />
			</div>
		</section>
	</div>
</template>

<script setup lang="ts">
import DashSkeleton from '@/components/skeletons/DashSkeleton.vue';
import { ChevronRight, Heart } from 'lucide-vue-next';
import { Line } from 'vue-chartjs';
import { Chart, registerables } from 'chart.js'
import type { ChartOptions } from 'chart.js';
import HeadCard from '@/components/dashboard/HeadCard.vue';
import BaseDialog from '@/components/base/BaseDialog.vue';
import { useUserStore } from '@/stores/userStore';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import LumySuccess from '@/assets/images/lumy_cheering.png';
import type { SessionUser, Skill, SkillSummary, UserSummary } from '@/types';
import { useDateFormat } from '@/composables/useDateFormat';
import { useSessionStore } from '@/stores/sessionStore';
import { formatName } from '@/composables/formatName';
import HeroBadge from '@/components/HeroBadge.vue';
const session = useSessionStore();

Chart.register(...registerables);

const { formatFeedbackDate } = useDateFormat();
defineProps<{ lastFeedback: string }>();

const router = useRouter();
const userStore = useUserStore();
const summary = computed<UserSummary | null>(() => userStore.meSummary);
const loading = ref(true);
const user = ref<SessionUser | null>(null)
onMounted(async() => {
	try {
		await userStore.getMeSummary();
		user.value = session.user;
	} catch (err:any) {
		console.error('Error fetching user summary:', err);
	} finally {
		loading.value = false;
	}
});

function selectedSkill(skill: SkillSummary) {
	sessionStorage.setItem('selectedSkill', JSON.stringify(skill));
	router.push({ name: 'member-skill' });
}

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
  maintainAspectRatio: false,
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


const feedbackChart = computed(() => {
  const feedbackRequested = summary.value?.feedback_requested || {};
  const feedbackGiven = summary.value?.feedback_given || {};
  const feedbackReceived = summary.value?.feedback_received || {};

  // union of all keys and sort chronologically (expects YYYY-MM or ISO-like keys)
  const allKeys = Array.from(
    new Set([
      ...Object.keys(feedbackRequested),
      ...Object.keys(feedbackGiven),
      ...Object.keys(feedbackReceived)
    ])
  ).sort((a, b) => new Date(a + '-01').getTime() - new Date(b + '-01').getTime());

  const mapSeries = (series: Record<string, any>) =>
    allKeys.map(k => Number(series[k] ?? 0));

  const valuesRequested = mapSeries(feedbackRequested);
  const valuesGiven = mapSeries(feedbackGiven);
  const valuesReceived = mapSeries(feedbackReceived);

  return {
    labels: allKeys,
    datasets: [
      {
        label: 'Feedback Requested',
        data: valuesRequested,
        fill: false,
        borderColor: 'rgba(75, 123, 236, 1)',
        backgroundColor: 'rgba(75, 123, 236, 1)',
        borderDash: [5, 5],
        tension: 0.4
      },
      {
        label: 'Feedback Given',
        data: valuesGiven,
        fill: false,
        borderColor: 'rgba(32, 191, 107, 1)',
        backgroundColor: 'rgba(32, 191, 107, 1)',
        borderDash: [5, 5],
        tension: 0.4
      },
      {
        label: 'Feedback Received',
        data: valuesReceived,
        fill: false,
        borderColor: 'rgba(164, 74, 255, 1)',
        backgroundColor: 'rgba(164, 74, 255, 1)',
        borderDash: [5, 5],
        tension: 0.4
      }
    ]
  };
});


// dynamic y max based on all dataset values
const feedbackYMax = computed(() => {
  const feedbackRequested = summary.value?.feedback_requested || {};
  const feedbackGiven = summary.value?.feedback_given || {};
  const feedbackReceived = summary.value?.feedback_received || {};

  const all = [
    ...Object.values(feedbackRequested).map(Number),
    ...Object.values(feedbackGiven).map(Number),
    ...Object.values(feedbackReceived).map(Number)
  ].filter(v => !Number.isNaN(v));

  if (!all.length) return 10;
  // find max and round up to nearest sensible step
  const rawMax = Math.max(...all);
  // sensible step choices
  return Math.ceil(rawMax + 10);
});

const feedbackStep = computed(() => {
	switch (true) {
		case feedbackYMax.value >= 10:
			return 2;
		case feedbackYMax.value >= 50:
			return 5;
		default:
			return 1;
	}
})

type LineChartOptions = ChartOptions<'line'>

const feedbackChartOptions = computed<LineChartOptions>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false },
  plugins: {
    legend: {
      display: true,
      position: 'top', // legend above chart
      labels: {
        align: 'end',
        usePointStyle: true,
        pointStyle: 'circle',

      }
    },
    title: { display: false }
  },
  scales: {
    y: {
      min: 0,
      max: feedbackYMax.value,
      ticks: {
        stepSize: feedbackStep.value
      }
    }
  }
}));
</script>