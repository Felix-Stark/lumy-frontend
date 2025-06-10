<template>
	<button
    class="bg-lumy-purple hover:opacity-50 max-w-fit text-white font-bold py-2 px-4 rounded-md flex items-center justify-center mt-4 cursor-pointer transition duration-200 ease-in-out"
    @click="onAction"
  >
    {{ btnText }}
    <slot />
  </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
defineProps<{
  btnText: string;
  onAction: () => void;
}>();
</script>