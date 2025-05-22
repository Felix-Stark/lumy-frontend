

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
import SlackAuthPage from '@/layouts/SlackAuthPage.vue'
import feedyHappy from '@/assets/images/feedy_happy.png'
const clientId = import.meta.env.VITE_SLACK_CLIENT_ID
const redirectUri = 'https://mcfeedface-frontend-production.up.railway.app/slack/install-redirect'
const slackOauthUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=commands,chat:write,users:read,team:read&user_scope=identity.avatar,identity.basic,identity.email,identity.team&redirect_uri=${redirectUri}`

const registerSlackUser = () => {
	// Redirect to Slack OAuth URL
	window.location.href = slackOauthUrl
}
</script>