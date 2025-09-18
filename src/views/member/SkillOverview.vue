<template>
    <section class="flex justify-between items-center mb-6 w-full">
        <h1 class="font-thin text-2xl text-lumy-secondary"><span>{{ formatName(activeSkill.name) }}</span></h1>
        <BaseButton
            :onAction="() => router.push('/feedback/request')"
            btnText="Request Feedback"
        />
    </section>
    <section class="w-full bg-white rounded-lg shadow-md p-6 lg:p-8">
        <p>{{  }}</p>
    </section>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import { ref, computed, onMounted } from 'vue';
import type { Skill, SkillSummary } from '@/types';
import { useRouter } from 'vue-router';
import { formatName } from '@/composables/formatName';

const router = useRouter();

const activeSkill = computed<SkillSummary>(() => {
    return JSON.parse(sessionStorage.getItem('selectedSkill') || '{}');
});

onMounted(() => {
    if (!activeSkill.value || !activeSkill.value.skill_id) {
        router.push('/member/skills');
    }
});
</script>