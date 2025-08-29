<template>
    <div class="flex flex-col items-center border-box w-full h-full mb-6 bg-white rounded-xl shadow-md p-8 max-h-[80vh]">
        <div class="flex flex-col gap-2 md:gap-4 p-4 w-full h-full overflow-auto">
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
import PickUserComp from '@/components/setup/PickUserComp.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import type { User, Account } from '@/types';
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import api from '@/services/api';
import BaseToast from '@/components/base/BaseToast.vue';

const userStore = useUserStore();
const account = computed(() => userStore.account);
const users = computed<User[]>(() => userStore.users);
const loading = ref(false);
const success = ref(false);


onMounted(async() => {
    if(account === null) {
        await userStore.getAccount();
        console.error('fetched account: ', account);
    }
    if(users === null || users.value.length === 0){
        const status = await userStore.getUsers();
        if(status === 200) {
            console.error('fetched users: ', users.value);
        }
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