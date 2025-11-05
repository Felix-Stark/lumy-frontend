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
	try {
		if(code) {
		await authStore.loginSlack(code as string);
		if (authStore.session?.user?.role === 'member') {
			router.replace('/member/overview')
		} else {
			router.replace('/admin/overview')
		}
		if(route.query.error === 'access_denied') {
			router.push({ name: 'slack-login' });
		}
	}
	} catch (error: any) {
		console.error('Error during Slack callback: ', error);
		router.push({ name: 'error' });
	}
});

</script>
