<template>
	<div class="flex flex-col items-center justify-center min-h-screen bg-slate-50">
		<div>
			<img :src="LumyConcerned" alt="Lumy Logo" class="w-40 h-40 mb-4" />
		</div>
		<h1 class="text-4xl font-bold text-lumy-purple mb-4">Oh no!</h1>
		<p class="text-lg text-gray-700 mb-8">Something went wrong.</p>
		<p class="text-sm text-gray-500 mb-4">Error: {{ errorStore.error?.code }} {{ errorStore.error?.detail }}</p>
		<p class="text-sm text-gray-500 mb-4">Please try again later or contact support.</p>
		
	</div>
</template>

<script setup lang="ts">
import { useErrorStore } from '@/stores/errorStore';
import { onMounted } from 'vue';
import LumyConcerned from '@/assets/images/lumy_concerned.png';
const errorStore = useErrorStore();
</script>