<template>
	<button
    class="bg-mcpurple hover:bg-mcpurplelight text-white font-bold py-2 px-4 rounded-md flex items-center justify-center mt-4 cursor-pointer transition duration-200 ease-in-out"
    @click="onClick"
  >
  <slot />
  </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
defineProps<{
  text: string;
  icon?: string;
  onClick: () => void;
}>();
</script>