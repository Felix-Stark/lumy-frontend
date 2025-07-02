<template>
	<div class="flex flex-col box-border max-w-2xl w-full justify-center max-h-[75vh] p-4">
    <article class="flex flex-col items-center justify-center">
      <div class="flex flex-col items-center justify-center">
        <h1 class="font-inter font-semibold text-3xl text-center">Gotcha! What about users? Does this look good?</h1>
        <p class="font-inter font-light text-center mt-2.5">
          Don't worry, you can change these settings later on as well. This is just to get you set up.
        </p>
      </div>
    </article>
    <div v-if="users" class="flex flex-col items-center mt-3 min-h-1/3 max-h-full overflow-auto">
      <PickUserComp
        v-for="user in users"
        :id="user.id"
        :key="user.id"
        :avatarUrl="user.avatar"
        :name="user.name"
        :title="user.title"
        v-model:role="user.role"
        v-model:isActive="user.is_active"
      />
    </div>
    <button
      class="bg-purple-500 hover:bg-purple-400 place-self-center min-w-3xs max-w-3xs mt-10 text-white font-bold py-2 px-4 rounded-md cursor-pointer transition duration-200 ease-in-out"
      @click="updateUsers"
      >Next</button>
	</div>
</template>

<script setup lang="ts">
import PickUserComp from '@/components/setup/PickUserComp.vue';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import api from '@/services/api';

import { useUserStore } from '@/stores/userStore';
import type { SetupUser } from '@/types';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();
const loading = ref(false);
const users = ref<SetupUser[]>();

onMounted(async () => {
  loading.value = true;
  console.log('setup account in users: ', authStore.setupAccount);
  try {
    users.value = authStore.setupAccount?.users;
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    loading.value = false;
  }
});
const updateUsers = async () => {
  loading.value = true;
  try {
    users.value?.forEach(user => {
    userStore.updateUser(user.id, { ...user, is_active: user.is_active, role: user.role });
  })
  } catch (error: any) {
    console.error('error in updateUser fn: ', error)
  } finally {
    loading.value = false
    verifySetup()
  }
}

async function verifySetup() {
  try {
    const res = await api.post('/slack/verify-setup', { "account_id": authStore.setupAccount?.account_id})
    if (res.status === 200) {
      router.push({ name: 'admin' })
    }
  } catch (error: any) {
    console.error('error in verifySetup fn: ', error)
  }
}

</script>
