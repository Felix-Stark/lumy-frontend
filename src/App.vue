<script setup lang="ts">
import { RouterView } from 'vue-router'
console.log('App.vue loaded')
</script>

<template>
  <!-- Main application view -->
   <main class="flex flex-col border-box items-center justify-center  w-screen min-h-screen bg-slate-100 p-8">
     <RouterView />
   </main>
</template>


