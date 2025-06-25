<template>
	<div :class="[
      isSticky
        ? 'fixed top-20 right-8 flex flex-col items-center gap-4 z-50'
        : 'absolute top-0 right-0 flex items-center gap-4 mr-12 mt-10'
    ]"
    style="transition: all 0.3s;">
		<!-- <router-link @click="onAction" class="rounded-full p-2 bg-white hover:bg-gray-100 transition duration-200 ease-in-out">
			<Search class="text-gray-500 size-5" />
		</router-link> -->
		<!-- <router-link @click="onAction" class="rounded-full p-2 bg-white hover:bg-gray-100 transition duration-200 ease-in-out">
			<Activity class="text-gray-500 size-5" />
		</router-link> -->
		<router-link to="/admin" v-slot="{ isExactActive }" class="rounded-full p-3 bg-white hover:bg-gray-100 transition duration-200 ease-in-out">
			<Home :class="[,
				isExactActive === true ? 'text-lumy-purple size-5'
				: 'text-gray-500 size-4'
			]" />
		</router-link>
		<router-link to="/member" v-slot="{ isExactActive }" class="rounded-full p-3 bg-white hover:bg-gray-100 transition duration-200 ease-in-out">
			<UserRound :class="[,
				isExactActive === true ? 'text-lumy-purple size-5'
				: 'text-gray-500 size-4'
			]" />
		</router-link>

		<router-link to="/admin/settings" v-slot="{ isActive }" class="rounded-full p-3 bg-white hover:bg-gray-100 transition duration-200 ease-in-out">
			<Settings :class="[,
				isActive ? 'text-lumy-purple size-5'
				: 'text-gray-500 size-4'
			]" />
		</router-link>
	</div>
</template>
<script setup lang="ts">
import { Search, Activity, UserRound, Settings, Home } from 'lucide-vue-next';
import { onMounted, onUnmounted, ref } from 'vue';

const isSticky = ref(false)

const handleScroll = () => {
  // Adjust 80 to your nav's offset height
  isSticky.value = window.scrollY > 80
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>