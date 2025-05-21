

<template>
	<SlackAuthPage
	title="It looks like you're new here!"
	description="Let's install the slack bot and set up your account shall we?"
	text="It lives right in your workspace to help you and your team give, receive, and understand feedback like pros."
	:image="feedyHappy"
	buttonText="Yes, let's go!"
	:onAction="registerSlackUser"
	/>
</template>

<script setup lang="ts">
import SlackAuthPage from '@/components/SlackAuthPage.vue'
import feedyHappy from '@/assets/images/feedy_happy.png'

const registerSlackUser = () => {
	
}
</script>