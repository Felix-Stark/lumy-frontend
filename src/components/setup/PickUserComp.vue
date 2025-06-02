<template>
	<div :key="id" :class="[
            'flex w-full not-last:border-b-2 border-gray-200',
            isActive === false ? 'opacity-50' : ''
        ]">
		<div class="flex items-center justify-start w-full gap-4 p-2">
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
		<div class="flex items-center gap-6 w-1/4">
			<select :value="role" 
			@change="onRoleChange" class="border border-gray-300 rounded-md p-2 cursor-pointer w-[8rem]">
            	<option selected value="member">Member</option>
            	<option value="admin">Admin</option>
          	</select>
			<button @click="emit('update:isActive', !isActive)" class=" text-red-500 ">
				<UserMinus v-if="isActive === true" class="w-6 h-6 cursor-pointer" />
				<UserPlus v-else class="w-6 h-6 text-green-500 opacity-100 cursor-pointer" />
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { UserMinus, UserPlus } from 'lucide-vue-next';

const props = defineProps<{
	id: string;
	name?: string;
	email?: string;
	avatarUrl?: string;
	isActive?: boolean;
	title?: string;
	role: string;
}>();
const emit = defineEmits(['update:role', 'update:isActive']);


function onRoleChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    emit('update:role', target.value);
}
</script>