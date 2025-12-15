<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useSessionStore } from './stores/sessionStore';
import { onMounted } from 'vue';
console.log('Welcome to Lumy')
const session = useSessionStore();
onMounted(() => {
  if(!session.authenticated) {
    session.getSession();
  }
})
function breaker()
</script>

<template>
  <!-- Main application view -->
   <main class="flex flex-col box-border items-center justify-center  w-screen min-h-screen bg-slate-100">
     <RouterView />
   </main>
</template>


