<template>
	<div class="absolute top-0 right-0 flex items-center gap-1 m-4">
		<button @click="onAction" class="rounded-full p-2 bg-white hover:bg-gray-100 transition duration-200 ease-in-out">
			<Search class="text-gray-500 size-5" />
		</button>
		<button @click="onAction" class="rounded-full p-2 bg-white hover:bg-gray-100 transition duration-200 ease-in-out">
			<Activity class="text-gray-500 size-5" />
		</button>
		<button @click="onAction" class="rounded-full p-2 bg-white hover:bg-gray-100 transition duration-200 ease-in-out">
			<Settings class="text-gray-500 size-5" />
		</button>
	</div>
</template>
<script setup lang="ts">
import { Search, Activity, Settings } from 'lucide-vue-next';

defineProps<{
  onAction?: () => void
}>();
</script>