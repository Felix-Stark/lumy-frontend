<template>
	<div class="flex flex-col box-border max-w-2xl w-full justify-center p-4">
    <SetupComp
        title="Gotcha! What about users? Does this look good?"
        text="Don't worry, you can change these settings later on as well. This is just to get you set up."
        buttonText="Next"
        :onAction="updateUsers"
        :disabled="loading"
      >
      <Combobox>
        <div class="relative w-full">
          <ComboboxInput
            class="border p-2 border-gray-300  outline-lumy-purple w-full rounded-lg"
            placeholder="Search user or pick from list"
            :displayValue="() => query"
            @change="query = $event.target.value"
          />
          <button @click="clearQuery" class="rounded-full absolute right-2 top-2 p-1 cursor-pointer">
            <XCircleIcon class="text-gray-500" />

          </button>
        </div>
      </Combobox>
      <button
        class="self-end text-sm text-gray-500 underline underline-offset-2 hover:text-gray-700 mb-2 cursor-pointer"
        @click="toggleAllActive"
      >{{ !allInactive ? 'Deactivate all users' : 'Activate all' }}</button>
      <div v-if="users" class="flex flex-col gap-2 items-center mt-3 w-full h-full overflow-auto">
        <PickUserComp
          v-for="user in filteredUsers"
          :key="user.id"
          :id="user.id"
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
import {
    Combobox,
    ComboboxInput,
  } from '@headlessui/vue'
import { XCircleIcon } from 'lucide-vue-next';

import SetupComp from '@/components/setup/SetupComp.vue';
import PickUserComp from '@/components/setup/PickUserComp.vue';
import { useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import api from '@/services/api';
import { useUserStore } from '@/stores/userStore';
import type { SetupUser } from '@/types';
import { useAuthStore } from '@/stores/authStore';
import mockUsers from '@/test/mockUsers.json';

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();
const loading = ref(false);
const users = ref<SetupUser[]>([]);
const allInactive = ref(false);
const query = ref('');
const filteredUsers = computed<SetupUser[]>(() => {
    return query.value === ''
        ? users.value
        : users.value.filter((user: SetupUser) => {
            return user.name.toLowerCase().includes(query.value.toLowerCase());
        });
});
onMounted(async () => {
  loading.value = true;
  try {
    if(authStore.setupAccount) {
      users.value = authStore.setupAccount.users;
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    loading.value = false;
  }
});

const clearQuery = () => {
  query.value = '';
}

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

const toggleAllActive = () => {
  users.value?.forEach(user => {
    user.is_active = false;
  });
  allInactive.value = !allInactive.value;
  if(allInactive.value === false) {
    users.value?.forEach(user => {
      user.is_active = true;
    });
  }
}

async function verifySetup() {
  try {
    const res = await api.post('/slack/verify-setup', { "account_id": authStore.setupAccount?.account_id})
    if (res.status === 200) {
      router.push('/setup/complete');
      loading.value = false
    }
  } catch (error: any) {
    console.error('error in verifySetup fn: ', error)
  }
}

</script>
