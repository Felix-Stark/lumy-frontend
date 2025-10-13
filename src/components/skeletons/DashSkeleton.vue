<template>
    <div v-if="isOpen === true" class="animate-pulse p-4 w-full lg:my-20 flex flex-col">
    <div class="grid grid-cols-2 gap-6 mb-6">
      <div class="flex items-center gap-4 p-6 bg-white rounded-lg shadow animate-pulse">
        <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div class="flex-1">
          <div class="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div class="h-4 bg-gray-100 rounded w-2/3"></div>
        </div>
      </div>

      <div class="flex items-center gap-4 p-6 bg-white rounded-lg shadow animate-pulse">
        <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div class="flex-1">
          <div class="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div class="h-4 bg-gray-100 rounded w-2/3"></div>
        </div>
      </div>
    </div>

    <!-- summary text skeleton -->
    <section class="w-full bg-lumy-purple text-white p-8 rounded-lg mb-6">
      <div class="h-4 bg-white/30 rounded w-3/4 mx-auto animate-pulse"></div>
      <div class="h-3 bg-white/20 rounded w-1/2 mt-3 mx-auto animate-pulse"></div>
    </section>

    <!-- charts skeletons -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="bg-white p-6 rounded-lg shadow animate-pulse h-64 flex items-center justify-center">
        <div class="w-full h-48 bg-gray-100 rounded"></div>
      </div>
    </section>
    </div>
</template>
<script setup lang="ts">
defineProps<{
    isOpen: boolean;
}>();
</script>