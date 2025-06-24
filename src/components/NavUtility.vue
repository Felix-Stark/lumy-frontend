<template>
	<div class="absolute top-0 right-0 flex items-center gap-1 m-4">
		<!-- <router-link @click="onAction" class="rounded-full p-2 bg-white hover:bg-gray-100 transition duration-200 ease-in-out">
			<Search class="text-gray-500 size-5" />
		</router-link> -->
		<!-- <router-link @click="onAction" class="rounded-full p-2 bg-white hover:bg-gray-100 transition duration-200 ease-in-out">
			<Activity class="text-gray-500 size-5" />
		</router-link> -->
		<router-link to="/admin" v-slot="{ isActive }" class="rounded-full p-2 bg-white hover:bg-gray-100 transition duration-200 ease-in-out">
			<Home :class="[,
				isActive === true ? 'text-lumy-purple size-6'
				: 'text-gray-500 size-5'
			]" />
		</router-link>
		<router-link to="/member" v-slot="{ isActive }" class="rounded-full p-2 bg-white hover:bg-gray-100 transition duration-200 ease-in-out">
			<UserRound :class="[,
				isActive === true ? 'text-lumy-purple size-6'
				: 'text-gray-500 size-5'
			]" />
		</router-link>

		<router-link to="/admin/settings" v-slot="{ isActive }" class="rounded-full p-2 bg-white hover:bg-gray-100 transition duration-200 ease-in-out">
			<Settings :class="[,
				isActive ? 'text-lumy-purple size-6'
				: 'text-gray-500 size-5'
			]" />
		</router-link>
	</div>
</template>
<script setup lang="ts">
import { Search, Activity, UserRound, Settings, Home } from 'lucide-vue-next';

defineProps<{
  onAction?: () => void
}>();
</script>