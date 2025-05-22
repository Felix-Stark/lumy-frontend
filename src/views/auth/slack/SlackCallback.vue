<template>
	<div class="flex flex-col items-center justify-center min-h-screen bg-slate-50">
		<div>
			<img :src="feedyWaiting" alt="">
		</div>
		<div class="w-12 h-12 border-4 border-slate-200 border-t-[#4a154b] rounded-full animate-spin mb-4"></div>
		<p class="text-gray-700">Just a sec - compiling your awesomeness..</p>
	</div>
</template>

<script setup lang="ts">
// You can add logic here if needed, e.g., handling the callback
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { onMounted } from 'vue';
import feedyWaiting from '@/assets/images/feedy_waiting.png';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const code = route.query.code;
const state = route.query.state;
const error = route.query.error;

onMounted( async () => {
	if(code) {
		const status = await authStore.loginSlack(code as string);
		console.log('Status:', status);
		console.log('Code:', code);
		console.log('State:', state);
	}
});

</script>
