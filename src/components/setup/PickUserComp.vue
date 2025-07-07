<template>
	<div :key="id" class="flex justify-between w-full not-last:border-b-2 border-gray-200">
		<div :class="['flex items-center gap-4 p-2', isActive === true ? '' : 'opacity-50']">
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
		<div class="flex flex-col gap-2 sm:flex-row items-center justify-end sm:gap-6 ">
			<Listbox :model-value="role" @update:model-value="emit('update:role', $event)">
				<div :class="['relative w-[6rem]', isActive === true ? '' : 'opacity-50']">
					<ListboxButton :disabled="!isActive" :class="['border border-gray-300 rounded-md p-2 w-full flex justify-between items-center  bg-white', isActive ? 'cursor-pointer' : 'cursor-not-allowed']">
						<span>{{ role.charAt(0).toUpperCase() + role.slice(1) }}</span>
						<ChevronDown class="ml-2 w-4 h-4" />
					</ListboxButton>
					<ListboxOptions class="absolute mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-10">
						<ListboxOption value="member" class="cursor-pointer select-none px-4 py-2 hover:bg-gray-200">
							Member
						</ListboxOption>
						<ListboxOption value="admin" class="cursor-pointer select-none px-4 py-2 hover:bg-gray-200">
							Admin
						</ListboxOption>
					</ListboxOptions>
				</div>
			</Listbox>
			<button
			:class="['px-4 py-2 text-white cursor-pointer rounded', isActive === true ? 'bg-red-500' : 'bg-green-500 px-8']" 
			@click="emit('update:isActive', !isActive)"
			>
				{{ isActive === true ? 'Remove' : 'Add' }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue';
import { ChevronDown } from 'lucide-vue-next';


defineProps<{
	id: number;
	name?: string;
	email?: string;
	avatarUrl?: string;
	isActive?: boolean;
	title?: string;
	role: string;
}>();
const emit = defineEmits(['update:role', 'update:isActive']);

</script>