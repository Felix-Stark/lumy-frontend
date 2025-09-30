<template>
    <div class="flex items-center w-full p-4 bg-white rounded-full shadow-lg">
        <div :class="['flex items-center gap-4 p-2']">
            <!-- Avatar and Name Section -->
            <img
                v-if="avatarUrl"
                :src="avatarUrl"
                alt="User Avatar"
                class="w-12 h-12 rounded-full object-cover"
            />
            <div v-else class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                <span class="text-gray-500">No Image</span>
            </div>
            <div class="flex flex-col justify-start h-full">
                <p v-if="name" class="text-lg font-medium text-gray-800">
                {{ name }} <span v-if="title" class="text-sm font-normal text-gray-500"> - <i>({{ title }}</i>)</span>
                </p>
                <p v-if="email" class="text-sm font-medium italic text-gray-800">
                {{ email }}
                </p>
            </div>
        </div>
        <p class="text-sm text-gray-700">{{ sentSum }}</p>
        <div :class="['px-4 py-2 rounded-full', sentSum === 'positive' ? 'bg-lumy-green' : sentSum === 'mixed' || 'neutral' ? 'bg-lumy-neutral-light' : 'bg-lumy-danger']">
            <p class="text-white text-sm">{{ avgSent }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">

defineProps<{
	id: number;
	name?: string;
	email?: string;
	avatarUrl?: string;
    title?: string;
    sentSum?: string | null;
    avgSent?: string;
    avgSentColor?: string;
}>();
</script>