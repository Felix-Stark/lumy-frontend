<template>
	<div :class="[
      isSticky
        ? 'fixed top-20 right-8 flex flex-col items-center gap-4 z-50'
        : 'absolute top-0 right-0 flex items-center gap-4 mr-12 mt-10'
    ]"
    style="transition: all 0.3s;">
		<router-link to="/admin" v-slot="{ isExactActive }" class="rounded-full p-3 bg-white hover:bg-gray-100 transition duration-200 ease-in-out"
		@mouseenter="(e: MouseEvent) => handleMouseEnter(e, 'Admin Home')"
		@mouseleave="handleMouseLeave"
		>
			<Home :class="[,
				isExactActive === true ? 'text-lumy-purple size-5'
				: 'text-gray-500 size-4'
			]" />
		</router-link>
		<router-link to="/member" v-slot="{ isExactActive }" class="rounded-full p-3 bg-white hover:bg-gray-100 transition duration-200 ease-in-out"
		@mouseenter="(e: MouseEvent) => handleMouseEnter(e, 'Profile')"
		@mouseleave="handleMouseLeave"
		>
			<UserRound :class="[,
				isExactActive === true ? 'text-lumy-purple size-5'
				: 'text-gray-500 size-4'
			]" />
		</router-link>

		<router-link to="/admin/settings" v-slot="{ isActive }" class="rounded-full p-3 bg-white hover:bg-gray-100 transition duration-200 ease-in-out"
		@mouseenter="(e: MouseEvent) => handleMouseEnter(e, 'Settings')"
		@mouseleave="handleMouseLeave"
		>
			<Settings :class="[,
				isActive ? 'text-lumy-purple size-5'
				: 'text-gray-500 size-4'
			]" />
		</router-link>
		<Tooltip
			:text="tooltipText"
			:x="tooltipX"
			:y="tooltipY"
			:visible="showTooltip"
			/>
	</div>
</template>
<script setup lang="ts">
import { UserRound, Settings, Home } from 'lucide-vue-next';
import { onMounted, onUnmounted, ref } from 'vue';
import Tooltip from './base/Tooltip.vue';

const isSticky = ref(false)

const showTooltip = ref(false)
const tooltipText = ref('')
const tooltipX = ref(0)
const tooltipY = ref(0)

function handleMouseEnter(event: MouseEvent, text: string) {
  tooltipText.value = text
  tooltipX.value = event.clientX + 12 // offset for better positioning
  tooltipY.value = event.clientY + 12
  showTooltip.value = true
}
function handleMouseLeave() {
  showTooltip.value = false
}

const handleScroll = () => {
  // Adjust 80 to your nav's offset height
  isSticky.value = window.scrollY > 40
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>