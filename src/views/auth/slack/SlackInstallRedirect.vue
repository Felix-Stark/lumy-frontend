<template>
<SlackAuthLayout 
	text="Deploying bots and aligning stars... almost there!"
	:image="feedyWaiting"
	:loader="true"
/>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

import SlackAuthLayout from '@/layouts/SlackAuthLayout.vue';
import feedyWaiting from '@/assets/images/feedy_waiting.png';
import { onMounted } from 'vue';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const code = route.query.code;
const state = route.query.state;
const error = route.query.error;
onMounted( async () => {

	if (code) {
		// Handle the code and state as needed
		console.log('Code:', code);
		console.log('State:', state);
		await authStore.registerSlackUser(code as string);	
	}
});
</script>