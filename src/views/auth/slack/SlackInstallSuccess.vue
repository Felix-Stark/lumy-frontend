<template>
	<SlackAuthLayout 
	title="Great success!"
	description="Your account has been setup."
	:image="feedySuccess"
	button-text="Let's configure your account"
	:onAction="() => router.push('/admin/onboarding/SetupFramework')"
	/>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
import SlackAuthLayout from '@/layouts/SlackAuthLayout.vue';
import feedySuccess from '@/assets/images/feedy_success.png';
</script>