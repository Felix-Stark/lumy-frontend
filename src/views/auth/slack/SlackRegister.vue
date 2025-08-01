<template>
	<SlackFlowComp
	title="It looks like you're new here!"
	description="Let's install the slack bot and set up your account shall we?"
	text="It lives right in your workspace to help you and your team give, receive, and understand feedback like pros."
	:image="lumyGlad"
	buttonText="Yes, let's go!"
	:onAction="registerSlackUser"
	/>
</template>

<script setup lang="ts">
import SlackFlowComp from '@/components/slackFlow/SlackFlowComp.vue'
import lumyGlad from '@/assets/images/lumy_glad.png'
const clientId = import.meta.env.VITE_SLACK_CLIENT_ID
const redirectUri = 'https://app.getlumy.app/slack/install-redirect'
const slackOauthUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=commands,chat:write,users:read,team:read,users:read.email&redirect_uri=${redirectUri}`


const registerSlackUser = () => {
	// Redirect to Slack OAuth URL
	window.location.href = slackOauthUrl
}
</script>