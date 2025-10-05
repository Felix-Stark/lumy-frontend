<template>
    <div class="flex flex-col items-center gap-6 w-full min-h-[90vh] lg:w-4/5">
        <NavUtility />
        <SettingsNav />
        <main class="w-full">
        <router-view />
        </main>
    </div>
</template>
<script setup lang="ts">
import SettingsNav from '@/components/settings/SettingsNav.vue';
import NavUtility from '@/components/NavUtility.vue';
</script>