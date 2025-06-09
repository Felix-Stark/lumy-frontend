<template>
	<div :key="id" :class="[
            'flex w-full not-last:border-b-2 border-gray-200'
        ]">
		<div class="flex items-center justify-start w-3/4 gap-4 p-2">
			<!-- Avatar and Name Section -->
			<img
				v-if="avatarUrl"
				:src="avatarUrl"
				alt="User Avatar"
				class="w-12 h-12 rounded-full object-cover"
			/>
			<div v-else class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
				<span class="text-gray-500">No Image</span>
			</div>
			<div class="flex flex-col justify-start h-full">
				<p v-if="name" class="text-lg font-medium text-gray-800">
					{{ name }}
				</p>
				<p v-if="title" class="text-sm font-medium italic text-gray-800">
					{{ title }}
				</p>
			</div>
		</div>
		<div class="flex items-center flex-1 justify-between">
			<slot name="skillSelect" />
		</div>
	</div>
</template>

<script setup lang="ts">


defineProps<{
	id: number;
	name?: string;
	email?: string;
	avatarUrl?: string;
	isActive?: boolean;
	title?: string;
	role?: string;
	btn?: boolean;
}>();


</script>