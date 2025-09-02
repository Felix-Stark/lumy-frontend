<template>
		<header class="grid grid-cols-2 xl:grid-cols-4 2xl:mx-8 w-full items-stretch gap-6">
			<HeadCard
				class="col-start-1 row-start-1"
				:title="`${summary?.feedback_received_count ?? 0}`"
				description="Feedbacks received"
			>
				<Heart
				class="w-12 h-12 text-red-500"
				fill="currentColor"
				/>
			</HeadCard>
			<HeadCard
				class="col-start-2 row-start-1"
				:title="`${summary?.feedback_given_count ?? 0}`"
				description="Feedbacks given"
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
				class="col-start-1 row-start-2 xl:col-start-3 xl:row-start-1"
				:title="summary?.top_positive_skill || 'N/A'"
				description="Most mentioned strength"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24" fill="currentColor" stroke="#fff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-award-icon lucide-award text-lumy-purple"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>
			</HeadCard>
			<HeadCard
				class="col-start-2 row-start-2 xl:col-start-4 xl:row-start-1"
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
		<section class="flex flex-col w-full bg-white text-gray-800 p-8 rounded-lg">
			<h2 class="text-xl self-start mb-4">Average sentiment over time</h2>
			<Line :data="avgSentChart" :options="avgSentOptions" />
		</section>
		<section class="flex flex-col w-full bg-white text-gray-800 p-8 rounded-lg">
			<h2 class="text-xl self-start mb-4">Skills Overview</h2>
			<div class="overflow-x-auto">
				<table class="min-w-full border border-gray-200 rounded-lg">
					<thead>
						<tr class="bg-gray-100">
							<th class="px-4 py-2 text-left font-thin text-gray-500">Skill</th>
							<th class="px-4 py-2 text-left font-thin text-gray-500">Sentiment</th>
							<th class="px-4 py-2 text-left font-thin text-gray-500"># of feedback</th>
							<th class="px-4 py-2 text-left font-thin text-gray-500">Last feedback received</th>
							<th class="px-4 py-2"></th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="skill in summary?.skills_summary"
							:key="skill.skill_id"
							class="border-b last:border-b-0"
						>
							<td class="px-4 py-2">{{ skill.name }}</td>
							<td v-if="skill.average_sentiment >= 0.60" class="px-4 py-2 text-green-500">Strength</td>
							<td v-if="skill.average_sentiment > 0.40 && skill.average_sentiment < 0.60" class="px-4 py-2 text-yellow-500">Average</td>
							<td v-if="skill.average_sentiment === 0" class="px-4 py-2 text-gray-500">No feedback</td>
							<td v-if="skill.average_sentiment <= 0.40 && skill.average_sentiment > 0" class="px-4 py-2 text-red-500">Needs improvement</td>
							<td class="px-4 py-2 text-center">{{ skill.feedback_count }}</td>
							<td class="px-4 py-2">{{ skill.last_feedback_received ?  formatFeedbackDate(skill.last_feedback_received) : 'None' }}</td>
							<!-- <td class="px-4 py-2 flex justify-between items-center">
								<button @click="selectedSkill(skill)" class=" bg-lumy-purple text-white font-bold py-2 px-4 rounded-md cursor-pointer">
									Request
								</button>
								<ChevronRight />
							</td> -->
						</tr>
					</tbody>
				</table>
			</div>
		</section>
		<BaseDialog
			v-if="showSuccess"
			:isOpen="showSuccess"
			@close="showSuccess = false"
			:imgPath="LumySuccess"
			:imgAlt="'Lumy Success'"
			title="Feedback Requested"
			message="Your feedback request has been sent successfully!"
			btnText="OK"
		>
		</BaseDialog>
</template>

<script setup lang="ts">
import { ChevronRight, Heart } from 'lucide-vue-next';
import { Line } from 'vue-chartjs';
import { Chart, registerables } from 'chart.js'
import NavUtility from '@/components/NavUtility.vue';
import HeadCard from '@/components/dashboard/HeadCard.vue';
import BaseDialog from '@/components/base/BaseDialog.vue';
import { useUserStore } from '@/stores/userStore';
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import LumySuccess from '@/assets/images/lumy_cheering.png';
import type { Skill, SkillSummary, User, UserSummary } from '@/types';
import { useDateFormat } from '@/composables/useDateFormat';

Chart.register(...registerables);

const { formatFeedbackDate } = useDateFormat();
defineProps<{ lastFeedback: string }>();

const router = useRouter();
const userStore = useUserStore();
const summary = ref<UserSummary | null>();
const showSuccess = ref(false);

onMounted(async() => {
	await userStore.getUsers();
	await userStore.getMeSummary();
	summary.value = userStore.meSummary;
	console.log('users: ', userStore.users);
	console.log('meSummary: ', userStore.meSummary);
})

// function selectedSkill(skill: SkillSummary) {
// 	sessionStorage.setItem('selectedSkill', JSON.stringify(skill));
// 	router.push('/feedback/request');
// }

const avgSentChart = computed(() => {
	const avgSent = summary.value?.avg_sentiment || {};
	return {
		labels: Object.keys(avgSent), // e.g. ["2025-07", "2025-08", ...]
		datasets: [
			{
				label: 'Average Sentiment',
				data: Object.values({
					"2024-09": 7.2,
					"2024-10": 8.8,
					"2024-11": 6.5,
					"2024-12": 7.0,
					"2025-01": 8.5,
					"2025-02": 7.8,
					"2025-03": 8.3,
					"2025-04": 9.0,
					"2025-05": 7.1,
					"2025-06": 6.9,
					"2025-07": 8.4,
					"2025-08": 8.6
  }), // e.g. [0.8, 0.85, ...]
				fill: false,
				borderColor: 'rgba(150, 45, 255, 1)',
				tension: 0.1
			}
		]
	};
})
const avgSentOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: false }
  },
  scales: {
	x: {
		display: true,
		title: {
			display: true,
			text: 'Month'
		}
	},
    y: {
      min: 0,
      max: 10,
      ticks: { stepSize: 2 }
    }
  }
};

const avgSentMonths = summary.value?.avg_sentiment || {};
const avgSentChartLabels = Object.keys(avgSentMonths); // e.g. ["2025-07", "2025-08", ...]
const avgSentChartData = Object.values(avgSentMonths); // e.g. [0.8, 0.85, ...]


</script>