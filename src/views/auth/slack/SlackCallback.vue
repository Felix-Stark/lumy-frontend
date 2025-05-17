<template>
	<div class="flex flex-col items-center justify-center min-h-screen bg-slate-50">
		<div class="w-12 h-12 border-4 border-slate-200 border-t-[#4a154b] rounded-full animate-spin mb-4"></div>
		<p class="text-gray-700">Connecting to Slack, please wait...</p>
	</div>
</template>

<script setup>
// You can add logic here if needed, e.g., handling the callback
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useSlackStore } from '@/stores/slack';
import { onMounted } from 'vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const slackStore = useSlackStore();
const code = route.query.code;
const state = route.query.state;
const error = route.query.error;

onMounted(() => {
	if (error) {
		authStore.setError('Slack authentication failed');
		router.push({ name: 'auth.login' });
		return;
	}

	if (!code || !state) {
		authStore.setError('Invalid Slack callback');
		router.push({ name: 'auth.login' });
		return;
	}

	slackStore
		.handleSlackCallback(code, state)
		.then(() => {
			router.push({ name: 'home' });
		})
		.catch((err) => {
			authStore.setError(err.message);
			router.push({ name: 'auth.login' });
		});
});

</script>
