<template>
	<SlackFlowComp 
	:image="lumyLogo"
	title="Welcome to Lumy"	
	:description="`Feedback that actually helps — not hurts.`"
	buttonText="Continue with Slack"
	:onAction="signInWithSlack"
	>
		<template #text>
			Connect your Slack account to give and get meaningful, skill-based feedback <br/> — with a little help from AI.
		</template>
	</SlackFlowComp>
</template>


<script setup lang="ts">
import { useRouter } from 'vue-router';
import lumyLogo from '@/assets/images/lumy.png';
import SlackFlowComp from '@/components/slackFlow/SlackFlowComp.vue';
import { onMounted } from 'vue';
import { useSessionStore } from '@/stores/sessionStore';
const session = useSessionStore();
const clientId = import.meta.env.VITE_SLACK_CLIENT_ID;
const redirectUri = import.meta.env.VITE_SLACK_REDIRECT_URI;
// Construct the Slack OAuth URL
// This URL is used to redirect users to Slack for authentication
// It includes the client ID, requested scopes, and redirect URI
const slackOauthUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=users:read,team:read&redirect_uri=${redirectUri}`

const router = useRouter();
function signInWithSlack() {
	// Redirect to Slack OAuth URL
	window.location.href = slackOauthUrl;
}
onMounted(async() => {
	await session.getSession();
	if (session.authenticated && session.user !== null) {
		if(session.user.role) {
			router.push({ name: 'member-overview' });
		} else {
			router.push({ name: 'admin-overview'});
		}
	} 
})

</script>