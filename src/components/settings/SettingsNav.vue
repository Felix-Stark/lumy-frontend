<template>
    <header class="w-full mt-12 flex justify-center">
        <nav class="flex items-center justify-center gap-4 p-4 w-full">
            <router-link v-if="role === 'admin'" to="/settings/admin/general" v-slot="{isExactActive}">
                <span :class="['px-4 py-2 rounded-lg text-lg',
                isExactActive
                    ? 'bg-lumy-dark text-white'
                    : 'bg-gray-200 text-gray-700'
                ]">
                    General
                </span>
            
            </router-link>
            <router-link v-if="role === 'admin'" to="/settings/admin/intelligence" v-slot="{isExactActive}">
                <span :class="['px-4 py-2 rounded-lg text-lg',
                isExactActive
                    ? 'bg-lumy-dark text-white'
                    : 'bg-gray-200 text-gray-700'
                ]">
                    Intelligence
                </span>

            </router-link>
            <router-link v-if="role === 'admin'" to="/settings/admin/users" v-slot="{isExactActive}">
                <span :class="['px-4 py-2 rounded-lg',
                isExactActive
                    ? 'bg-lumy-dark text-white'
                    : 'bg-gray-200 text-gray-700'
                ]">
                    Users
                </span>
            
            </router-link>
            <router-link to="/settings/member/integrations" v-slot="{isExactActive}">
                <span :class="['px-4 py-2 rounded-lg',
                isExactActive
                    ? 'bg-lumy-dark text-white'
                    : 'bg-gray-200 text-gray-700'
                ]">
                    Integrations
                </span>
            
            </router-link>
            
        </nav>
    </header>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const role = ref('member');

onMounted(() => {
    const raw = sessionStorage.getItem('LumyRole')
  if (raw) {
	role.value = JSON.parse(raw)
  }
})


</script>