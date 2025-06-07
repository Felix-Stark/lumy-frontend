<template>
	<SlackAuthLayout 
	title="Great success!"
	description="Your account has been setup."
	:image="lumyHappy"
	button-text="Let's configure your account"
	:onAction="() => router.push('/admin/setup/SetupFramework')"
	/>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
import SlackAuthLayout from '@/layouts/SlackAuthLayout.vue';
import lumyHappy from '@/assets/images/lumy_cheering.png';
</script>