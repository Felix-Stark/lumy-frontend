<template>
    <div class="flex flex-col items-center h-full w-full p-4 md:p-8 lg:w-4/5 mx-auto">

		<NavUtility />
        <main class="flex flex-col items-center gap-6 w-full lg:my-20">
        <router-view />
        </main>
    </div>
</template>

<script setup lang="ts">
import NavUtility from '@/components/NavUtility.vue';
</script>