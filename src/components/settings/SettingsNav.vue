<template>
    <header class="w-screen mt-12 flex justify-center overflow-auto">
        <nav class="flex items-center justify-center gap-4 p-4 w-full">
            <router-link v-if="role === 'admin'" :to="{name: 'settings-admin-general'}" v-slot="{isExactActive}">
                <span :class="['px-4 py-2 rounded-lg text-lg',
                isExactActive
                    ? 'bg-lumy-secondary text-white'
                    : 'bg-gray-200 text-gray-700'
                ]">
                    General
                </span>
            
            </router-link>
            <router-link v-if="role === 'admin'" :to="{name: 'settings-admin-intelligence'}" v-slot="{isExactActive}">
                <span :class="['px-4 py-2 rounded-lg text-lg',
                isExactActive
                    ? 'bg-lumy-secondary text-white'
                    : 'bg-gray-200 text-gray-700'
                ]">
                    Intelligence
                </span>

            </router-link>
            <router-link v-if="role === 'admin'" :to="{name: 'settings-admin-skills'}" v-slot="{isExactActive}">
                <span :class="['px-4 py-2 rounded-lg text-lg',
                isExactActive
                    ? 'bg-lumy-secondary text-white'
                    : 'bg-gray-200 text-gray-700'
                ]">
                    Skills
                </span>
            
            </router-link>
            <router-link v-if="role === 'admin'" :to="{name: 'settings-admin-users'}" v-slot="{isExactActive}">
                <span :class="['px-4 py-2 rounded-lg',
                isExactActive
                    ? 'bg-lumy-secondary text-white'
                    : 'bg-gray-200 text-gray-700'
                ]">
                    Users
                </span>
            
            </router-link>
            <router-link v-if="role === 'admin'" :to="{name: 'settings-admin-teams'}" v-slot="{isExactActive}">
                <span :class="['px-4 py-2 rounded-lg',
                isExactActive
                    ? 'bg-lumy-secondary text-white'
                    : 'bg-gray-200 text-gray-700'
                ]">
                    Teams
                </span>
            
            </router-link>
            <router-link :to="{name: 'settings-member-integrations'}" v-slot="{isExactActive}">
                <span :class="['px-4 py-2 rounded-lg',
                isExactActive
                    ? 'bg-lumy-secondary text-white'
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
import { useSessionStore } from '@/stores/sessionStore';

const session = useSessionStore();
const role = ref('member');

onMounted(async() => {
   role.value = (await session.getSession()).user?.role ?? 'member';
})


</script>