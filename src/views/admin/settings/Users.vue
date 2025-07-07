<template>
    <div class="flex flex-col items-center border-box w-full h-full mb-6 bg-white rounded-xl shadow-md p-8 max-h-[75vh]">
        <div class="p-4 h-full overflow-auto">
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
            :loading="loading"
            :onAction="updateUsers"
            btnText="Save changes"
        />
    </div>
</template>

<script setup lang="ts">
import PickUserComp from '@/components/setup/PickUserComp.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import type { User } from '@/types';
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import api from '@/services/api';

const userStore = useUserStore();
const users = ref<User[]>();
const account = computed(() => userStore.account);
const loading = ref(false);

onMounted(async() => {
    if(account === null) {
        userStore.getAccount();
    }
    try {
        const res = await api.get('/users');
        if(res.status === 200) {
            users.value = res.data
        }
    } catch(error: any) {
        console.log('error in mount settings: ', error)
    }
})

const updateUsers = async () => {
  loading.value = true;
  try {
    users.value?.forEach(user => {
    userStore.updateUser(user.id, { ...user, is_active: user.is_active, role: user.role });
  })
  } catch (error: any) {
    console.error('error in updateUser fn: ', error)
  }
}
</script>