<template>
	<div class="flex flex-col gap-8 w-[80vw] min-h-screen">
		<NavUtility />
		<header class="grid grid-cols-2 grid-rows-2 gap-8 justify-center mt-16 w-full max-w-5xl">
			<HeadCard
				class="col-start-1 row-start-1"
				title="30"
				description="Feedbacks received"
				:onAction="() => console.log('Feedbacks')"
			>
				<Heart
				class="w-12 h-12 text-red-500"
				fill="currentColor"
				/>
			</HeadCard>
			<HeadCard
				class="col-start-2 row-start-1"
				title="15"
				description="Feedbacks given"
				:onAction="() => console.log('Projects')"
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
				:onAction="() => console.log('skill')"
			>
			<svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 24 24" fill="currentColor" stroke="#fff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-award-icon lucide-award text-lumy-purple"><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>
			</HeadCard>
			<HeadCard
				title="83%"
				description="Postive feedback given"
				:onAction="() => console.log('weakness')"
			>
			<svg width="34" height="40" viewBox="0 0 30 36" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M6.08365 3.75183C5.85069 1.22515 8.7026 -0.412123 10.7867 1.05183L16.4032 4.99713L22.7219 2.29921C25.0666 1.29811 27.5138 3.48921 26.7577 5.91252L24.7198 12.4432L29.2528 17.5852C30.9348 19.4931 29.5954 22.4846 27.044 22.5183L20.168 22.6092L16.6508 28.485C15.3457 30.6653 12.0707 30.323 11.25 27.9206L9.03822 21.446L2.33149 19.9356C-0.157125 19.3751 -0.841798 16.1721 1.20241 14.6535L6.71146 10.5612L6.08365 3.75183Z" fill="#7FE47E"/>
			<path d="M24.582 26.6436C24.0866 25.7903 22.9893 25.4979 22.1312 25.9906C21.2731 26.4832 20.979 27.5743 21.4745 28.4276L25.0628 34.6077C25.5582 35.461 26.6555 35.7533 27.5136 35.2607C28.3717 34.768 28.6657 33.6769 28.1703 32.8237L24.582 26.6436Z" fill="#7FE47E"/>
			</svg>

			</HeadCard>
		</header>
		<section class="w-full bg-lumy-purple text-white text-center p-8 rounded-lg">
			<p>You're crushing it in collaboration - teammates clearly love working with you!<br/>Want to level it up even more? Try adding a bit more structure to your planning chats.</p>
		</section>
		<section class="flex flex-col w-full bg-white text-gray-800 p-8 rounded-lg">
			<h2 class="font-400 text-xl self-start">Skills Overview</h2>
		</section>
	</div>
</template>

<script setup lang="ts">
import { Heart } from 'lucide-vue-next';
import NavUtility from '@/components/NavUtility.vue';
import HeadCard from '@/components/dashboard/HeadCard.vue';
import { useUserStore } from '@/stores/userStore';
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import type { User } from '@/types';
const userStore = useUserStore();
const user = ref<User | null>(null);
const feedbackGiven = ref(0);
const feedbackReceived = ref(0);
const mockUser = ref({
	id: 2,
	name: 'Felix Stark',
	avatar: 'https://avatars.slack-edge.com/2025-05-27/8983175204352_7d413422eec339550eec_192.png'

})

onMounted(async() => {
	// await userStore.getMe();
	// if (userStore.me) {
	// 	user.value = userStore.me;
	// 	await userStore.getUserSkills(userStore.me.id);
	// 	const res = await api.get('/submissions' + `?user_id=${userStore.me.id}`);
	// 	if (res.status === 200) {
	// 		const data = res.data;
	// 		console.log('feedback given data: ', data);
	// 		feedbackGiven.value = data.length;
	// 	} else {
	// 		console.error('Error fetching feedback data:', res.data);
	// 	}
	// }
})
</script>