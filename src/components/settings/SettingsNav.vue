<template>
    <header class="w-full mt-12 flex justify-center">
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

const role = ref('member');

onMounted(() => {
    const raw = sessionStorage.getItem('LumyRole')
  if (raw) {
	role.value = JSON.parse(raw)
  }
})


</script>