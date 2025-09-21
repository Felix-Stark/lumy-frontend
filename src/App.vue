<script setup lang="ts">
import { RouterView } from 'vue-router'
console.log('Welcome to Lumy')
</script>

<template>
  <!-- Main application view -->
   <main class="flex flex-col box-border items-center justify-center  w-screen min-h-screen bg-slate-100">
     <RouterView />
   </main>
</template>


