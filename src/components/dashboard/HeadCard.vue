<!-- src/components/BaseCard.vue -->
<template>
	<div
	  class="rounded-2xl shadow-md p-6 transition duration-300 relative"
	  :class="[
		,
		hoverable ? hoverBg : '',
		clickable ? 'cursor-pointer' : 'cursor-default'
	  ]"
	  @click="clickable && emit('click')"
	>
	  <div class="flex items-center justify-between mb-3">
		<div class="flex items-center gap-2">
		  <component
			v-if="icon"
			:is="icon"
			class="w-6 h-6 text-gray-700 dark:text-gray-300"
		  />
		  <h3 v-if="title" class="text-lg font-semibold text-gray-800 dark:text-white">
			{{ title }}
		  </h3>
		</div>
		<span
		  v-if="badge"
		  class="text-xs font-medium px-2 py-1 rounded-full"
		  :class="badgeClass"
		>
		  {{ badge }}
		</span>
	  </div>
  
	  <slot name="content" />
	  <slot name="footer" />
	</div>
  </template>
  
  <script setup lang="ts">
  import { computed, defineProps, defineEmits } from 'vue'
  
  const props = defineProps<{
	title?: string
	icon?: any // Pass a component (e.g., imported from Lucide)
	badge?: string
	badgeVariant?: 'success' | 'warning' | 'danger' | 'info'
	variant?: 'light' | 'dark' | 'primary'
	hoverable?: boolean
	clickable?: boolean
  }>()
  
  const emit = defineEmits<{
	(e: 'click'): void
  }>()
  
  const baseBg = computed(() => {
	switch (props.variant) {
	  case 'primary':
		return 'bg-blue-100 dark:bg-blue-900'
	  case 'dark':
		return 'bg-gray-800 text-white'
	  case 'light':
	  default:
		return 'bg-white dark:bg-gray-700'
	}
  })
  
  const hoverBg = computed(() => {
	switch (props.variant) {
	  case 'primary':
		return 'hover:bg-blue-200 dark:hover:bg-blue-800'
	  case 'dark':
		return 'hover:bg-gray-700'
	  case 'light':
	  default:
		return 'hover:bg-gray-100 dark:hover:bg-gray-600'
	}
  })
  
  const badgeClass = computed(() => {
	switch (props.badgeVariant) {
	  case 'success':
		return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
	  case 'warning':
		return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100'
	  case 'danger':
		return 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
	  case 'info':
	  default:
		return 'bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100'
	}
  })
  </script>
  