<template>
<SlackFlowComp 
	text="Deploying bots and aligning stars... almost there!"
	:image="lumyWaiting"
	:loader="true"
/>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

import SlackFlowComp from '@/components/slackFlow/SlackFlowComp.vue';
import lumyWaiting from '@/assets/images/lumy_connecting.png';
import { onMounted } from 'vue';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const code = route.query.code;
const state = route.query.state;
const error = route.query.error;
onMounted( async () => {
	if (code) {
		const data = await authStore.registerSlackUser(code as string);
		if (data) {
			router.push({ name: 'setup-frameworks' });
		}
	}
});
</script>