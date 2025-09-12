<template>
	<div class="flex flex-col items-center gap-6 w-full p-4 md:w-4/5 lg:w-4/6 h-full">
		<NavUtility />
        <main class="flex flex-col items-center gap-6 w-full my-12">
        <router-view />
        </main>
    </div>
</template>

<script setup lang="ts">
import NavUtility from '@/components/NavUtility.vue';
</script>