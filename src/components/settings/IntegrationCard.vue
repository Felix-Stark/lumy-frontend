<template>
    <div class="flex flex-col items-center gap-6 w-full min-h-[60vh] p-8 lg:p-12 bg-white rounded-xl shadow-lg">
        <img :src="img" alt="Google calendar logo" class="w-48 h-48 mb-4"/>
        <h1 class="font-inter text-2xl">{{ title }}</h1>
        <div class="flex flex-col justify-center items-center mt-4 font-normal text-sm space-y-1">
            <slot />
        </div>
        <div v-if="connected === true" class="flex">
            <Link class="w-4 h-4 stroke-3 text-gray-500 mr-1" />
            <p class="text-lumy-green">Connected</p>
        </div>
        <div v-else class="flex items-center">
            <Unlink class="w-4 h-4 stroke-3 text-gray-500 mr-1"/>
            <p class="text-lumy-danger">Not connected</p>
        </div>
        <div class="flex space-x-4 mt-6">
            <button v-if="connected === true" @click="$emit('disconnect')" class="flex items-center space-x-2 px-4 py-2 bg-lumy-secondary opacity-70 text-white text-sm rounded-lg cursor-pointer">
                Disconnect
            </button>
            <button v-else @click="$emit('connect')" class="px-4 py-2 bg-lumy-green text-white text-sm rounded-lg cursor-pointer">
                Connect
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">

defineProps<{
    img: string; // image src
    title: string;
    connected: boolean;
}>();

defineEmits<{
    (e: 'connect'): void
    (e: 'disconnect'): Promise<void>
}>();


</script>