<template>
	<div class="flex flex-col items-center gap-6 w-full p-4 md:w-[80vw] h-full">
		<NavUtility />
        <main class="flex flex-col items-center w-full mt-12">
        <router-view />
        </main>
    </div>
</template>

<script setup lang="ts">
import NavUtility from '@/components/NavUtility.vue';
</script>