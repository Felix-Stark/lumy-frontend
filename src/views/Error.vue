<template>
	<div class="flex flex-col items-center justify-center h-60vh p-8 bg-white shadow-md rounded-2xl">
		<div>
			<img :src="LumyConcerned" alt="Lumy Logo" class="w-48 h-48 mb-4" />
		</div>
		<h1 class="text-4xl font-bold text-lumy-purple mb-4">Oh no!</h1>
		<p class="text-lg text-gray-700 mb-8">Something went wrong.</p>
		<p class="text-sm text-gray-500 mb-4">Error: {{ errorStore.error?.code }} {{ errorStore.error?.message ?? 'Unexpected error has occurred' }}</p>
		<p class="text-sm text-gray-500 mb-4">Please try again later or contact support.</p>
		<BaseButton 
		:onAction="() => backToHome()"
		btnText="Back to Login"
		/>
	</div>
</template>

<script setup lang="ts">
import { useErrorStore } from '@/stores/errorStore';
import { onMounted } from 'vue';
import LumyConcerned from '@/assets/images/lumy_concerned.png';
import BaseButton from '@/components/base/BaseButton.vue';
const errorStore = useErrorStore();
onMounted(() => {
	console.log('Error:', errorStore.error);
})

function backToHome() {
	errorStore.clearError();
	window.location.href = '/';
}
</script>