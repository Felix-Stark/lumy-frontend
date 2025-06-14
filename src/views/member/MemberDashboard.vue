<template>
	<div class="flex flex-col gap-8 w-[80vw] min-h-screen">
		<NavUtility />
		<header class="grid grid-cols-2 grid-rows-2 gap-8 justify-center mt-16 max-w-5xl">
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
				title="Collaboration"
				description="Most mentioned strength"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24" fill="currentColor" stroke="#fff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-award-icon lucide-award text-lumy-purple"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>
			</HeadCard>
			<HeadCard
				:title="`${summary?.positive_sentiment_percentage, '%'}`"
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
			<h2 class="font-400 text-xl self-start mb-4">Skills Overview</h2>
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
							<td v-if="skill.average_sentiment > 0.50" class="px-4 py-2 text-green-500">Positive</td>
							<td v-if="skill.average_sentiment <= 0.50" class="px-4 py-2 text-red-500">Negative</td>
							<td class="px-4 py-2">{{ skill.feedback_count }}</td>
							<td class="px-4 py-2">{{ new Date(skill.last_feedback_received).toLocaleDateString() }}</td>
							<td class="px-4 py-2">
								<button @click="showReq = true" class="bg-lumy-purple text-white font-bold py-2 px-4 rounded-md">
									Request
								</button>
								<ChevronLeft />
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>
		<BaseDialog
		:isOpen="showReq"
		@close="showReq = false"
		title="Request Feedback"
		description="Select a skill and who you want feedback from.">
			<div class="flex flex-col items-center justify-center gap-4">
				<select v-model="reqSkill" class="w-full p-2 border border-gray-300 rounded-md">
					<option value="" disabled selected>Select a skill</option>
					<option v-for="skill in user?.skills" :key="skill.id" :value="skill.id">
						{{ skill.skill }}
					</option>
				</select>
				<select v-model="reqUser" class="w-full p-2 border border-gray-300 rounded-md">
					<option value="" disabled selected>Select a user</option>
					<option v-for="u in userStore.users" :key="u.id" :value="u.id">
						{{ u.name }}
					</option>
				</select>

				<textarea
						name="feedback"
						id="feedback"
						v-model="reqMsg"
						class="w-full h-full p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lumy-purple"
						placeholder="What do you want feedback on? Set the scene so your team mates know where to jump in."
						rows="6"
					></textarea>
				<button @click="() => requestFeedback" class="bg-lumy-purple text-white font-bold py-2 px-4 rounded-md">
					Request Feedback
				</button>
				
			</div>
		</BaseDialog>
		<BaseDialog
			v-if="showSuccess"
			:isOpen="showSuccess"
			@close="showSuccess = false"
			:imgPath="LumySuccess"
			:imgAlt="'Lumy Success'"
			title="Feedback Requested"
			message="Your feedback request has been sent successfully!"
			btnText="Close"
		>
		</BaseDialog>
	</div>
</template>

<script setup lang="ts">
import { ChevronLeft, Heart } from 'lucide-vue-next';
import NavUtility from '@/components/NavUtility.vue';
import HeadCard from '@/components/dashboard/HeadCard.vue';
import BaseDialog from '@/components/base/BaseDialog.vue';
import { useUserStore } from '@/stores/userStore';
import { ref, onMounted } from 'vue';
import LumySuccess from '@/assets/images/lumy_cheering.png';
import type { User, UserSummary } from '@/types';
import api from '@/services/api';
const userStore = useUserStore();
const user = ref<User | null>(null);
const summary = ref<UserSummary | null>(null);
const showReq = ref(false);
const showSuccess = ref(false);
const reqSkill = ref<number | null>(null);
const reqUser = ref<number | null>(null);
const reqMsg = ref<string | null>(null);
const mockUser = ref({
	id: 2,
	name: 'Felix Stark',
	avatar: 'https://avatars.slack-edge.com/2025-05-27/8983175204352_7d413422eec339550eec_192.png',
	skills: [
		{ id: 1, name: 'JavaScript', level: 4 },
		{ id: 2, name: 'Vue.js', level: 5 },
		{ id: 3, name: 'Node.js', level: 3 }
	],
	numberOfFeedbacksGiven: 15,
	numberOfFeedbacksReceived: 30,
	feedbackSentiment: 83
})

onMounted(async() => {

	await userStore.getMe();
	user.value = userStore.me;

	console.log('me: ', userStore.me)

	await userStore.getMeSummary();
	summary.value = userStore.meSummary;
	console.log('Summary:', userStore.meSummary);

})

const requestFeedback = async () => {
	try {
		const res = await api.post('/requests', {
			recipient_id: reqUser.value,
			skill_id: reqSkill.value,
			message: reqMsg.value
		})
		if (res.status === 200) {
			alert('Feedback requested successfully!');
		} else {
			console.error('Error requesting feedback:', res.data);
			alert('Failed to request feedback. Please try again.');
		}
	} catch (error) {
		console.error('Error requesting feedback:', error);
		alert('Failed to request feedback. Please try again.');
	} finally {
		showReq.value = false;
		showSuccess.value = true;
		reqMsg.value = null;
		reqSkill.value = null;
		reqUser.value = null;
	}
}
</script>