<template>
	<div class="flex flex-col gap-8 w-[80vw] min-h-screen">
		<NavUtility />
		<header class="flex flex-wrap w-full">
			<HeadCard
				title="30"
				description="Feedbacks received"
				:onAction="() => console.log('Feedbacks')"
			>
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
		<section class="flex flex-col ">

		</section>
	</div>
</template>

<script setup lang="ts">
import NavUtility from '@/components/NavUtility.vue';
import HeadCard from '@/components/dashboard/HeadCard.vue';
import { useAuthStore } from '@/stores/authStore';
</script>