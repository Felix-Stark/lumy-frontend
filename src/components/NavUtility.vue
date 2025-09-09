<template>
	<button
	v-if="!menuOpen"
		class="fixed top-6 right-6 z-50 md:hidden bg-white rounded-full p-2 shadow"
		@click="menuOpen = !menuOpen"
		aria-label="Open navigation"
	>
		<svg class="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
		</svg>
  	</button>
	<div v-if="menuOpen" class="absolute top-0 right-0 w-64 bg-slate-200 h-full shadow-lg transition-all z-51 p-6 md:hidden">
		<button class="absolute top-6 left-6 transition-all duration-600" @click="menuOpen = false" aria-label="Close navigation">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
		</button>

		<ul class="flex flex-col gap-4 text-gray-700 text-lg font-semibold pt-8">
			<!-- <li v-if="role === 'admin'">
				<router-link to="/admin">Admin</router-link>
			</li> -->
			<li>
				<router-link to="/member">Overview</router-link>
			</li>
			<li>
				<router-link to="/settings">Settings</router-link>
			</li>
		</ul>
		</div>
	<div
		v-if="menuOpen"
		class="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
		@click="menuOpen = false"
	></div>
	<div :class="[
      isSticky
        ? 'fixed top-20 right-8 flex flex-col items-center gap-4 z-50'
        : 'absolute top-0 right-0 flex items-center gap-4 mr-12 mt-10',
		'transition-all duration-300 ease-in-out',
		'hidden md:flex'
    ]"
    style="transition: all 0.3s;">
		<!-- <router-link to="/admin" v-slot="{ isExactActive }" class="rounded-full p-3 bg-white hover:bg-gray-100 transition duration-200 ease-in-out"
		@mouseenter="(e: MouseEvent) => handleMouseEnter(e, 'Admin Home')"
		@mouseleave="handleMouseLeave"
		> -->
			<!-- <Home :class="[,
				isExactActive === true ? 'text-lumy-purple size-5'
				: 'text-gray-500 size-4'
			]" /> -->
		<!-- </router-link> -->
		<router-link to="/member" v-slot="{ isExactActive }" class="rounded-full p-3 bg-white hover:bg-gray-100 transition duration-200 ease-in-out"
		@mouseenter="(e: MouseEvent) => handleMouseEnter(e, 'Overview')"
		@mouseleave="handleMouseLeave"
		>
			<UserRound :class="[,
				isExactActive === true ? 'text-lumy-purple size-5'
				: 'text-gray-500 size-4'
			]" />
		</router-link>
		<router-link to="/settings" v-slot="{ isActive }" class="rounded-full p-3 bg-white hover:bg-gray-100 transition duration-200 ease-in-out"
		@mouseenter="(e: MouseEvent) => handleMouseEnter(e, 'Settings')"
		@mouseleave="handleMouseLeave"
		>
			<Settings :class="[,
				isActive ? 'text-lumy-purple size-5'
				: 'text-gray-500 size-4'
			]" />
		</router-link>
		<button class="cursor-pointer rounded-full p-3 bg-white hover:bg-gray-100 transition duration-200 ease-in-out">
			<LogOut
			@click="auth.logout()"
			:class="['text-gray-500 size-4']"
			@mouseenter="(e: MouseEvent) => handleMouseEnter(e, 'Logout')"
			@mouseleave="handleMouseLeave"
			/>
		</button>
		<Teleport to="body">
			<Tooltip
			:text="tooltipText"
			:x="tooltipX"
			:y="tooltipY"
			:visible="showTooltip"
			/>
		</Teleport>
	</div>
</template>
<script setup lang="ts">
import { UserRound, Settings, Home, UserRoundCog, LogOut } from 'lucide-vue-next';
import { onMounted, onUnmounted, ref } from 'vue';
import Tooltip from './base/Tooltip.vue';
import { useAuthStore } from '@/stores/authStore';

const auth = useAuthStore();

const isSticky = ref(false)
const menuOpen = ref(false)
const showTooltip = ref(false)
const tooltipText = ref('')
const tooltipX = ref(0)
const tooltipY = ref(0)
const role = ref()

function handleMouseEnter(event: MouseEvent, text: string) {
  tooltipText.value = text
  tooltipX.value = event.clientX - 12 // offset for better positioning
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
  const raw = sessionStorage.getItem('LumyRole')
  if (raw) {
	role.value = JSON.parse(raw)
  }
  console.log('Role from sessionStorage:', role.value)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)

})
</script>