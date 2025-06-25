<template>
	<div class="flex flex-col items-center w-[80%] p-12 ">
		<NavUtility />
        <main class="flex flex-col items-center w-full">
        <router-view />
        </main>
    </div>
</template>

<script setup lang="ts">
import NavUtility from '@/components/NavUtility.vue';
</script>