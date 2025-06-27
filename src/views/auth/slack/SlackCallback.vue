<template>
	<div class="flex flex-col items-center justify-center max-w-3xl w-full rounded-2xl shadow-md h-[80vh] bg-white">
		<div class="relative">
			<img :src="lumyWaiting" alt="" class="w-64 h-auto mb-4" />
			<div class="w-12 h-12 absolute left-22 bottom-7 border-4 border-slate-200 border-t-lumy-purple border-b-lumy-purple rounded-full animate-spin mb-4"></div>
		</div>
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
