<template>
    <div class="flex flex-col items-center border-box w-full h-full mb-6 bg-white rounded-xl shadow-md p-8 max-h-[80vh]">
        <div class="flex flex-col gap-2 md:gap-4 p-4 w-full h-full overflow-auto">
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
        <div v-if="users" class="flex flex-col gap-2 items-center mt-3 w-full h-full overflow-auto">
            <PickUserComp
            v-for="user in filteredUsers"
            :key="user.id"
            :id="user.id"
            :avatarUrl="user.avatar"
            :name="formatName(user.name)"
            :email="user.email"
            :title="user.title"
            :disabled="loading"
            v-model:role="user.role"
            v-model:isActive="user.is_active"
            />
        </div>
        </div>
        <BaseButton
            :disabled="loading"
            :onAction="updateUsers"
            btnText="Save changes"
        />
    </div>
    <BaseToast
        v-if="loading"
        text="Saving changes..."
        bgClass="bg-blue-600"
        :show="loading"
        :duration="3000"
    />
    <BaseToast
        text="Changes saved successfully!"
        bgClass="bg-green-500"
        :show="success"
        :duration="3000"
        @close="success = false"
    />
</template>

<script setup lang="ts">
import {
    Combobox,
    ComboboxInput,
  } from '@headlessui/vue'
import { XCircleIcon } from 'lucide-vue-next';
import PickUserComp from '@/components/setup/PickUserComp.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import type { User, Account } from '@/types';
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import BaseToast from '@/components/base/BaseToast.vue';
import { formatName } from '@/composables/formatName.ts';

const userStore = useUserStore();
const account = computed(() => userStore.account);
const users = computed<User[]>(() => userStore.users);
const loading = ref(false);
const success = ref(false);
const query = ref('');
const filteredUsers = computed<User[]>(() => {
    return query.value === ''
        ? users.value
        : users.value.filter((user: User) => {
            return user.name.toLowerCase().includes(query.value.toLowerCase());
        });
});
const clearQuery = () => {
  query.value = '';
};

onMounted(async() => {
    if(account === null) {
        await userStore.getAccount();
    }
    if(users === null || users.value.length === 0){
        await userStore.getUsers(true);
    }
})

const updateUsers = async () => {
  loading.value = true;
  try {
    users.value?.forEach(user => {
        userStore.updateUser(user.id, { ...user, is_active: user.is_active, role: user.role });
    });
  } catch (error: any) {
    console.error('error in updateUser fn: ', error)
  } finally {
    loading.value = false;
    success.value = true;
  }
}
</script>