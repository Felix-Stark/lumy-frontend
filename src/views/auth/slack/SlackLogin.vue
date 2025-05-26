<template>
	<SlackAuthLayout 
	:image="feedyLogo"
	title="Welcome to McFeedFace"	
	:description="`Feedback that actually helps — not hurts.`"
	buttonText="Sign in with Slack"
	:onAction="signInWithSlack"
	>
		<template #text>
			Connect your Slack account to give and get meaningful, skill-based feedback <br/> — with a little help from AI.
		</template>
	</SlackAuthLayout>
</template>


<script setup lang="ts">
import { useRouter } from 'vue-router';
import feedyLogo from '@/assets/images/feedy_logo.png';
import SlackAuthLayout from '@/layouts/SlackAuthLayout.vue';

const clientId = import.meta.env.VITE_SLACK_CLIENT_ID;
const redirectUri = 'https://mcfeedface-frontend-production.up.railway.app/slack/callback';
const slackOauthUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=commands&user_scope=users:read,users:read.email&redirect_uri=${redirectUri}`;

const router = useRouter();
function signInWithSlack() {
	// Redirect to Slack OAuth URL
	window.location.href = slackOauthUrl;
}

</script>