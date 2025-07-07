<template>
    <div class="flex flex-col items-center w-full md:w-[80vw] min-h-full ">
        <SettingsNav />
        <main class="w-full">
        <router-view />
        </main>
    </div>
</template>
<script setup lang="ts">
import SettingsNav from '@/components/admin/SettingsNav.vue';
</script>