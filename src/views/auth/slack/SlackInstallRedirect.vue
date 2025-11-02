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
import api from '@/services/api';

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();
const code = route.query.code;

onMounted( async () => {
	const status = await authStore.registerSlackUser(code as string);
	if (status === 200) {
		router.push({ name: 'slack-install-success' });
	} else {
		router.push({ name: 'slack-not-admin'})
	}
});
</script>