<template>
    <div class="border-box w-full h-full mb-6">
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
</template>

<script setup lang="ts">
import PickUserComp from '@/components/setup/PickUserComp.vue';
import type { User } from '@/types';
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import api from '@/services/api';

const userStore = useUserStore();
const users = ref<User[]>();
const account = computed(() => userStore.account);

onMounted(async() => {
    if(account === null) {
        userStore.getAccount();
    }
    const res = await api.get('/users');
    if(res.status === 200) {
        users.value = res.data
    }
})
</script>