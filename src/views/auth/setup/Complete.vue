<template>
	<SlackFlowComp 
	title="Great success!"
	description="Your account has been setup!"
    text="Now, check out what I sent you in Slack."
	:image="lumyHappy"
	button-text="Or go to your dashboard"
	:onAction="() => router.push({ name: 'member-overview'})"
	/>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
import SlackFlowComp from '@/components/slackFlow/SlackFlowComp.vue';
import lumyHappy from '@/assets/images/lumy_cheering.png';
</script>