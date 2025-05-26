<template>
<SetupComp
  title="Gotcha! What about users? Does this look good?"
  text="Don't worry, you can change these settings later on as well. This is just to get you set up."
  buttonText="Next"
  :onAction="() => router.push('/admin/setup/setup-framework')"
  :disabled="false"
>
  
</SetupComp>
</template>

<script setup lang="ts">
import SetupComp from '@/components/setup/SetupComp.vue';
</script>