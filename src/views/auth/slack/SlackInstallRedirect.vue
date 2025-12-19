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
import router from '@/router'
import SlackFlowComp from '@/components/slackFlow/SlackFlowComp.vue';
import lumyWaiting from '@/assets/images/lumy_connecting.png';
import { onMounted } from 'vue';
import api from '@/services/api';

const authStore = useAuthStore();
const route = useRoute();


onMounted( async () => {
	const code = route.query.code;
	if(!code) {
		router.push('/')
	}
	try {
		const status = await authStore.registerSlackUser(code as string);
		if (status === 200) {
			router.push({name: 'slack-install-success'})
		}
	} catch (err: any) {
		if(err.message === 'NOT_ADMIN') {
			router.push({ name: 'slack-not-admin'})
		} else {
			console.error('Error in SlackInstallRedirect',err);
		}
	}
});
</script>