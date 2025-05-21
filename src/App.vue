<script setup lang="ts">
import { RouterView } from 'vue-router'
console.log('App.vue loaded')
</script>

<template>
  <!-- Main application view -->
   <main class="flex flex-col items-center justify-center min-h-screen w-screen bg-slate-50">
     <RouterView />
   </main>
</template>


