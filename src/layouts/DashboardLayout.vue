<template>
    <div class="flex flex-col items-center h-full w-full p-4 md:p-8 lg:w-4/5 xl:w-3/4 2xl:w-2/3 mx-auto">

		<NavUtility />
        <main class="flex flex-col items-center gap-6 w-full my-12">
        <router-view />
        </main>
    </div>
</template>

<script setup lang="ts">
import NavUtility from '@/components/NavUtility.vue';
</script>