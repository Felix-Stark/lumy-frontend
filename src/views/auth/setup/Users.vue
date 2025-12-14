<template>
	<div class="flex flex-col box-border max-w-2xl w-full justify-center p-4">
    <SetupComp
        title="Gotcha! What about users? Does this look good?"
        text="Don't worry, you can change these settings later on as well. This is just to get you set up."
        buttonText="Next"
        :onAction="verifySetup"
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
      >{{ allActive === true ? 'Deactivate all users' : 'Activate all' }}</button>
      <div v-if="users" class="flex flex-col gap-2 items-center mt-3 w-full h-full overflow-auto">
        <PickUserComp
          v-for="user in filteredUsers"
          :key="user.id"
          :id="user.id"
          :avatarUrl="user.avatar"
          :name="user.name"
          :email="user.email"
          v-model:role="user.role"
          v-model:isActive="user.is_active"
          :disabled="loading === true"
          :isCreator="user.id === setupAccount!.id"
          @update:isActive="val => toggleUser(user.id, { is_active: val })"
          @update:role="val => updateRole(user.id, { role: val })"
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
import type { SetupAccount, SetupUser } from '@/types';

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const users = ref<SetupUser[]>([]);
const allActive = ref(true);
const query = ref('');
const setupAccount = ref<SetupAccount>();
const filteredUsers = computed<SetupUser[]>(() => {
    return query.value === ''
        ? users.value
        : users.value.filter((user: SetupUser) => {
            return user.name.toLowerCase().includes(query.value.toLowerCase());
        });
});
onMounted(async () => {
  loading.value = true;
  const raw = sessionStorage.getItem('LumySetupAccount');
  if(raw) {
    setupAccount.value = JSON.parse(raw);
  }
  if(setupAccount.value) {
    users.value = setupAccount.value.users;
  }
  loading.value = false;
});

function clearQuery() {
  query.value = '';
}

const patching = ref<Record<number, boolean>>({}); // store loading state per user

async function updateRole(userId:number, newRole: Partial<SetupUser>) {
  console.log('userId in updateUser fn: ', userId, newRole)
  const idx = users.value.findIndex(u => u.id === userId);
  const prevRole = users.value[idx].role

  users.value[idx].role = newRole.role!;
  if(idx === -1) return;
  try {
      const res = await api.patch(`/users/${userId}`, newRole);
      if(res.status !== 200) {
        users.value[idx].role = prevRole;
      }
  } catch (error: any) {
    console.error('error in updateUser fn: ', error)
  }
  
}
async function toggleUser(userId:number, payload: Partial<SetupUser>) {
  console.log('userId in updateUser fn: ', userId, payload)
  patching.value[userId] = true;
  try {
    // handle different shapes of response safely
    const res = await userStore.updateUser(userId, payload, 'setup');
    if (Array.isArray(res)) {
      users.value = (res as SetupUser[]).filter(Boolean);
    } else if (res && typeof res === 'object' && 'id' in res) {
      // update single user in-place
      users.value = users.value.map(u => (u && u.id === (res as any).id ? (res as SetupUser) : u)).filter(Boolean) as SetupUser[];
    } else {
      // fallback: refresh users from store
      await userStore.getUsers(true);
      users.value = (userStore.users as SetupUser[]).filter(Boolean);
    }
  } catch (error: any) {
    console.error('error in updateUser fn: ', error)
  } finally {
    patching.value[userId] = false;
  }
  
}

const toggleAllActive = async () => {
  try {
    await api.post("/account/users/activation", { "active": !allActive.value });
    allActive.value = !allActive.value;
    users.value.map(user => {
      user.id !== setupAccount.value?.id ? user.is_active = allActive.value : null;
      return user;
    });
  } catch (error) {
    console.error("Failed to toggle all active", error);
  }
};

async function verifySetup() {
  loading.value = true;
  try {
    const res = await api.post('/slack/verify-setup', { "account_id": setupAccount.value?.account_id})
    if (res.status === 200) {
	    sessionStorage.setItem("loggedin", "true");
      sessionStorage.setItem("LumyRole", JSON.stringify("admin"));

      router.push({name: 'setup-complete'});
      loading.value = false
    }
  } catch (error: any) {
    console.error('error in verifySetup fn: ', error)
  }
}

</script>
