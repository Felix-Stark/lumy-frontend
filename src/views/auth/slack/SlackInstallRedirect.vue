<template>
<SlackAuthPage 
	text="Deploying bots and aligning stars... almost there!"
	:image="feedyWaiting"
	:loader="true"
/>
</template>

<script setup lang="ts">
import SlackAuthPage from '@/layouts/SlackAuthPage.vue';
import feedyWaiting from '@/assets/images/feedy_waiting.png';
import { onMounted } from 'vue';

onMounted(() => {
	const code = new URL(window.location.href).searchParams.get('code');
	const state = new URL(window.location.href).searchParams.get('state');
	const error = new URL(window.location.href).searchParams.get('error');

	if (code) {
		// Handle the code and state as needed
		console.log('Code:', code);
		console.log('State:', state);
	} else if (error) {
		// Handle the error as needed
		console.error('Error:', error);
	}
});
</script>