<template>
	<SlackFlowComp 
	title="Great!"
	description="Your account has been connected."
	:image="lumyHappy"
	button-text="Let's configure your account"
	:onAction="() => router.push({name: 'setup-frameworks'})"
	/>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
import SlackFlowComp from '@/components/slackFlow/SlackFlowComp.vue';
import lumyHappy from '@/assets/images/lumy_connecting.png';
</script>