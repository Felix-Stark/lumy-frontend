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

onMounted( async () => {
	try {
		const res = await api.post("/slack/account", { code });
      	console.log("register data: ", res.data);
		if (res.status === 200) {
			authStore.setupAccount = await res.data; //store this in sessionStorage
			sessionStorage.setItem("LumySetupAccount", JSON.stringify(res.data));
		}
	} catch (err: any) {
		console.error('Error in Register: ', err);
		router.push({name: 'slack-not-admin'});
	}
});
</script>