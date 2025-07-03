<template>
	<div class="flex flex-col box-border max-w-2xl w-full justify-center max-h-[75vh] p-4">
    <SetupComp
        title="Gotcha! What about users? Does this look good?"
        text="Don't worry, you can change these settings later on as well. This is just to get you set up."
        buttonText="Next"
        :onAction="updateUsers"
        :disabled="loading"
      >
      <div v-if="users" class="flex flex-col items-center mt-3 w-full max-h-full overflow-auto">
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
    </SetupComp>
	</div>
</template>

<script setup lang="ts">
import SetupComp from '@/components/setup/SetupComp.vue';
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
    verifySetup()
  }
}

async function verifySetup() {
  try {
    const res = await api.post('/slack/verify-setup', { "account_id": authStore.setupAccount?.account_id})
    if (res.status === 200) {
      router.push('/admin')
      loading.value = false
    }
  } catch (error: any) {
    console.error('error in verifySetup fn: ', error)
  }
}

</script>
