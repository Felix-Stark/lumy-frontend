<template>
    <div class="flex flex-col items-center w-[80vw] min-h-screen ">
        <SettingsNav />
        <main class="w-full">
        <router-view />
        </main>
    </div>
</template>
<script setup lang="ts">
import SettingsNav from '@/components/admin/SettingsNav.vue';
import NavUtility from '@/components/NavUtility.vue';
</script>