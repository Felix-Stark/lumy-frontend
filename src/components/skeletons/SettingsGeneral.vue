<template>
    <div v-if="isOpen" class="animate-pulse w-full p-8 flex flex-col bg-white rounded-xl shadow-md">
        <div class="flex flex-col gap-8 md:w-1/2">
            <div class="h-6 bg-gray-500 rounded w-50"></div>
            <div class="flex flex-col w-full pl-8 pb-6 border-l border-gray-300">
                <div class="h-4 bg-gray-400 rounded w-1/4 mb-2"></div>
                <div class="h-4 bg-gray-400 rounded w-full"></div>
            </div>
            <div class="flex flex-col w-full pl-8 pb-6 border-l border-gray-300">
                <div class="h-4 bg-gray-400 rounded w-1/4 mb-2"></div>
                <div class="h-4 bg-gray-400 rounded w-full"></div>
            </div>
            <div class="flex flex-col w-full pl-8 pb-6 border-l border-gray-300">
                <div class="h-4 bg-gray-400 rounded w-1/4 mb-2"></div>
                <div class="h-4 bg-gray-400 rounded w-full"></div>
            </div>
            <hr class="text-gray-300" />
            <div class="h-6 bg-gray-500 rounded w-50"></div>
            <div class="flex flex-col w-full pl-8 pb-6 border-l border-gray-300">
                <div class="h-4 bg-gray-400 rounded w-1/4 mb-2"></div>
                <div class="h-4 bg-gray-400 rounded w-full"></div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
defineProps<{
    isOpen: boolean;
}>();
</script>