<template>
	<SlackFlowComp
	:image="lumyWaiting"
	text="Just a sec - compiling your awesomeness.."
	:loader="true"
	/>
</template>

<script setup lang="ts">
// You can add logic here if needed, e.g., handling the callback
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { onMounted } from 'vue';
import lumyWaiting from '@/assets/images/lumy_waiting.png';
import SlackFlowComp from '@/components/slackFlow/SlackFlowComp.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const code = route.query.code;

onMounted( async () => {
	console.log('slack callback mounted');
	try {
		if(code) {
		const path = await authStore.loginSlack(code as string);
		if (path !== undefined) {
			router.push(path);
		} else {
			console.error('Login failed');
		}
	}
	} catch (error) {
		console.error('Error during Slack callback: ', error);
		router.push({ name: 'SlackError' });
	}
});

</script>
