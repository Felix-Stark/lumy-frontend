<template>
  <div class="flex items-center justify-center">
    <span class="inline-block w-8 h-8 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></span>
    <span class="ml-3 text-purple-600 font-medium" v-if="text">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ text?: string }>()
</script>