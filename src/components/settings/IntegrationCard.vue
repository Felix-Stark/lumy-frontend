<template>
    <div class="flex flex-col items-center gap-6 self-stretch p-8 lg:p-12 bg-white rounded-xl shadow-lg">
        <img :src="img" :alt="title, ' logo'" class="w-38 h-38 mb-4"/>
        <h1 class="font-inter text-2xl">{{ title }}</h1>
        <div class="flex flex-col justify-center items-center mt-4 font-normal text-sm space-y-1">
            <slot />
        </div>
        <div class="flex flex-col items-center">
            <div v-if="connected === true" class="flex">
                <Link class="w-4 h-4 stroke-3 text-gray-500 mr-1" />
                <p class="text-lumy-green">Connected</p>
            </div>
            
            <div v-if="!connected && !disabled" class="flex items-center">
                <Unlink class="w-4 h-4 stroke-3 text-gray-500 mr-1"/>
                <p class="text-lumy-danger">Not connected</p>
            </div>
            <div v-if="disabled === true" class="flex">
                <p class="text-lumy-secondary">Coming soon...</p>
            </div>
            <div class="flex items-center space-x-4 mt-6">
                <button v-if="connected === true" @click="$emit('disconnect')" class="flex items-center space-x-2 px-4 py-2 bg-lumy-secondary opacity-70 text-white text-sm rounded-lg cursor-pointer">
                    Disconnect
                </button>
                <button v-if="!connected && !disabled" @click="$emit('connect')" class="px-4 py-2 bg-lumy-green text-white text-sm rounded-lg cursor-pointer">
                    Connect
                </button>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { Link, Unlink } from 'lucide-vue-next';
defineProps<{
    img: string; // image src
    title: string;
    connected: boolean;
    disabled?: boolean;
}>();

defineEmits<{
    (e: 'connect'): void
    (e: 'disconnect'): Promise<void>
}>();


</script>