<template>
	<div class="flex flex-col gap-8 w-[80vw] min-h-screen">
		<NavUtility />
		<header class="flex flex-wrap gap-8 w-full">
			<HeadCard
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
				title="15"
				description="Feedbacks given"
				:onAction="() => console.log('Projects')"
			>
			</HeadCard>
			<HeadCard
				title="Collaboration"
				description="Most mentioned strength"
				:onAction="() => console.log('skill')"
			>
			</HeadCard>
			<HeadCard
				title="83%"
				description="Postive feedback given"
				:onAction="() => console.log('weakness')"
			>
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
const userStore = useUserStore();
const user = ref(userStore.me);
const mockUser = ref({
	id: 2,
	name: 'Felix Stark',
	avatar: 'https://avatars.slack-edge.com/2025-05-27/8983175204352_7d413422eec339550eec_192.png'

})

onMounted(async() => {
	await userStore.getMe();
	if (userStore.me) {
		user.value = userStore.me;
		await userStore.getUserSkills(userStore.me.id);
	}
})
</script>