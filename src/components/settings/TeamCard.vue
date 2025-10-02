<template>
    <div class="flex flex-col items-center gap-6 bg-white p-8 rounded-lg shadow-xl">
        <div class="flex flex-col items-center">
            <img
                v-if="avatar"
                :src="avatar"
                alt="User Avatar"
                class="w-12 h-12 rounded-full object-cover"
            />
            <div v-else class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span class="text-gray-500">No Image</span>
            </div>
            <h2 class="text-lg">{{ teamLead }}</h2>
            <p class="text-thin text-sm">{{ role }}</p>
        </div>
        <p class="text-gray-600 text-thin"><span>{{ numberOfDR+' ' }} </span>direct reports</p>
        <button @click="$emit('manage-team')" class="px-4 py-2 text-white bg-lumy-secondary-light rounded-lg">{{ btnText }}</button>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    avatar: string;
    teamLead: string;
    role: string;
    numberOfDR?: number;
    directReports?: string[];
    btnText?: string;
}>();

defineEmits<{
    (e: 'manage-team'): void
}>();

</script>