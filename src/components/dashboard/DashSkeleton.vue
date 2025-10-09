<template>
    <div v-if="isOpen === true" class="animate-pulse p-4">
        <div class="flex items-center mb-8 gap-4">
            <div class="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div class="h-6 bg-gray-300 rounded w-1/4"></div>
        </div>
        <header class="grid grid-cols-2 xl:grid-cols-2 2xl:mx-8 w-full items-stretch gap-6">
            <div class="bg-white p-4 rounded-lg shadow">
                <div class="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div class="h-40 bg-gray-200 rounded"></div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow">
                <div class="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div class="h-40 bg-gray-200 rounded"></div>
            </div>
        </header>
        <section class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-white p-4 rounded-lg shadow">
                <div class="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div class="h-32 bg-gray-200 rounded"></div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow">
                <div class="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div class="h-32 bg-gray-200 rounded"></div>
            </div>
            <div class="bg-white p-4 rounded-lg shadow">
                <div class="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div class="h-32 bg-gray-200 rounded"></div>
            </div>
        </section>
    </div>
</template>
<script setup lang="ts">
defineProps<{
    isOpen: boolean;
}>();
</script>