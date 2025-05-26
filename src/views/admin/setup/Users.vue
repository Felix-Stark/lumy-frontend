<template>
<SetupComp
  title="Gotcha! What about users? Does this look good?"
  text="Don't worry, you can change these settings later on as well. This is just to get you set up."
  buttonText="Next"
  :onAction="() => router.push('/admin/setup/setup-framework')"
  :disabled="false"
>
  <UserListItem
    v-for="user in users"
    :key="user.id" 
    :avatarUrl=" user.avatarUrl"
    :name="user.name"
    :title="user.title"
    :selected="true"
    :disabled="true"
  />
</SetupComp>
</template>

<script setup lang="ts">
import SetupComp from '@/components/setup/SetupComp.vue';
import UserListItem from '@/components/base/UserListItem.vue';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
</script>