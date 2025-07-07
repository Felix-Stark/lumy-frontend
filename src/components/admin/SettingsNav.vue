<template>
    <header class="w-full mt-12 flex justify-center">
        <nav class="flex items-center justify-center gap-4 p-4 w-full">
            <router-link to="/admin/settings/general" v-slot="{isExactActive}">
                <span :class="['px-4 py-2 rounded-lg text-lg',
                isExactActive
                    ? 'bg-lumy-dark text-white'
                    : 'bg-gray-200 text-gray-700'
                ]">
                    General
                </span>
            
            </router-link>
            <router-link to="/admin/settings/users" v-slot="{isExactActive}">
                <span :class="['px-4 py-2 rounded-lg',
                isExactActive
                    ? 'bg-lumy-dark text-white'
                    : 'bg-gray-200 text-gray-700'
                ]">
                    Users
                </span>
            
            </router-link>
            
        </nav>
    </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();


</script>