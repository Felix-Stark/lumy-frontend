<template>
	<div class="flex w-full ">
		<div>
			<img
				v-if="avatarUrl"
				:src="avatarUrl"
				alt="User Avatar"
				class="w-12 h-12 rounded-full object-cover"
			/>
			<div v-else class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
				<span class="text-gray-500">No Image</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
	id: string;
	name: string;
	email?: string;
	avatarUrl?: string;
	isActive?: boolean;
	isAdmin?: boolean;
}>();
</script>