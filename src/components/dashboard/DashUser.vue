<template>
    <div @click="$emit('setEmployee')" class="flex items-center justify-between w-full p-6 bg-white rounded-lg shadow-md hover:bg-gray-300 cursor-pointer">
        <div :class="['flex items-center gap-4']">
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
                <p v-if="name" class="flex text-lg text-nowrap font-medium text-gray-800">
                {{ name }} <span v-if="title" class="text-sm font-normal text-gray-500"> - <i>({{ title }}</i>)</span>
                </p>
                <p v-if="email" class="text-sm font-medium italic text-gray-800">
                {{ email }}
                </p>
                <p v-if="sentSum" class="text-sm text-wrap text-gray-700">{{ sentSum }}</p>
            </div>
        </div>
        <div class="flex items-center gap-5">
            <div v-if="avgSent" :class="['px-4 py-2 rounded-full', avgSent === 'positive' ? 'bg-lumy-green' : avgSent === 'mixed' || 'neutral' ? 'bg-lumy-neutral-light' : 'bg-lumy-danger']">
                <p class="text-white text-sm">{{ avgSent }}</p>
            </div>
            <ChevronRight class="text-gray-600 text-lg" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ChevronRight } from 'lucide-vue-next';
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
defineEmits<{
    (e: 'setEmployee'): void
}>();
</script>