<template>
	<div class="flex flex-col items-center justify-center min-h-screen bg-slate-50">
		<div>
			<img :src="lumyWaiting" alt="" class="w-64 h-auto mb-4" />
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
import lumyWaiting from '@/assets/images/lumy_waiting.png';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const code = route.query.code;

onMounted( async () => {
	console.log('slack callback mounted');
	if(code) {
		const path = await authStore.loginSlack(code as string);
		if (path !== undefined) {
			router.push(path);
		} else {
			console.error('Login failed');
		}
	}
});

</script>
