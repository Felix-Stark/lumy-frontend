<template>
	<button
  :disabled="disabled"
    :class="['hover:opacity-50 max-w-fit text-white font-bold py-2 px-4 rounded-md flex items-center justify-center mt-4 cursor-pointer transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed', secondary ? 'bg-lumy-secondary' : 'bg-lumy-purple' ]"
    @click="onAction"
  >
    {{ btnText }}
    <slot />
  </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
defineProps<{
  secondary?: boolean;
  disabled?: boolean;
  loading?: boolean;
  btnText?: string;
  onAction: () => void;
}>();
</script>