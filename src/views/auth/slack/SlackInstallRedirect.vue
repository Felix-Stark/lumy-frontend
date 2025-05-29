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
		const data = await authStore.registerSlackUser(code as string);
		if (data) {
			router.push({ name: 'setup-framework' });
		}
	}
});
</script>