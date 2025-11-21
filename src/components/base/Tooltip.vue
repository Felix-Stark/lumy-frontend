<!-- Tooltip.vue -->
<template>
	<teleport to="body">
	  <div
		v-if="visible"
		:style="style"
		class="fixed z-50 bg-gray-600 text-white text-xs rounded px-2 py-1 whitespace-pre w-fit pointer-events-none"
	  >
		{{ text }}
	  </div>
	</teleport>
  </template>
  
  <script setup lang="ts">
  import { ref, watch } from 'vue';
  
  const props = defineProps<{
	text: string;
	x: number;
	y: number;
	visible: boolean;
  }>();
  
  const style = ref({ left: '0px', top: '0px' });
  
  watch(
	() => [props.x, props.y, props.visible],
	([x, y, visible]) => {
	  if (visible) {
		style.value = { left: `${x || 0}px`, top: `${y || 0}px` };
	  }
	}
  );
  </script>