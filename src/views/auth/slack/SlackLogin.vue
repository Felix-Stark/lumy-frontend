<template>
	<main class="flex flex-col items-center justify-center min-h-screen">
		<article>
			<div class="flex flex-col items-center justify-center">
				<img :src="feedyLogo" alt="McFeedFace Logo" class="w-56 h-auto mt-4 mb-4" />
			</div>
			<h1 class="font-inter font-semibold text-xl text-center">Welcome to McFeedFace</h1>
			<h3 class="font-inter font-semibold text-lg text-center"> Feedback that actually helps — not hurts.</h3>
		</article>
		<section class="flex flex-col items-center justify-center mt-4">
			<p class="font-inter font-light text-lg text-center">
				Connect your Slack account to give and get meaningful, skill-based feedback <br/> — with a little help from AI.
			</p>
		</section>
		<button
			class="bg-[#962DFF] hover:bg-[#962dffb5] text-white font-bold py-3 px-4 rounded-md flex items-center justify-between gap-4 mt-4 cursor-pointer transition duration-200 ease-in-out"
			@click="signInWithSlack"
		>
			<!-- SVG icon for Slack -->
			<svg xmlns="http://www.w3.org/2000/svg" class="" width="24" height="24" viewBox="0 0 122.8 122.8">
				<g>
					<path fill="#e01e5a" d="M30.7 76.8c0 8.5-6.9 15.4-15.4 15.4S0 85.3 0 76.8s6.9-15.4 15.4-15.4h15.4v15.4zm7.7 0c0-8.5 6.9-15.4 15.4-15.4s15.4 6.9 15.4 15.4v38.5c0 8.5-6.9 15.4-15.4 15.4s-15.4-6.9-15.4-15.4V76.8z"/>
					<path fill="#36c5f0" d="M46.1 30.7c-8.5 0-15.4-6.9-15.4-15.4S37.6 0 46.1 0s15.4 6.9 15.4 15.4v15.4H46.1zm0 7.7c8.5 0 15.4 6.9 15.4 15.4s-6.9 15.4-15.4 15.4H7.7C-0.8 69.2-0.8 62.3 7.7 62.3h38.4z"/>
					<path fill="#2eb67d" d="M92.1 46.1c0-8.5 6.9-15.4 15.4-15.4s15.4 6.9 15.4 15.4-6.9 15.4-15.4 15.4h-15.4V46.1zm-7.7 0c0 8.5-6.9 15.4-15.4 15.4s-15.4-6.9-15.4-15.4V7.7C53.6-0.8 60.5-0.8 60.5 7.7v38.4z"/>
					<path fill="#ecb22e" d="M76.7 92.1c8.5 0 15.4 6.9 15.4 15.4s-6.9 15.4-15.4 15.4-15.4-6.9-15.4-15.4v-15.4h15.4zm0-7.7c-8.5 0-15.4-6.9-15.4-15.4s6.9-15.4 15.4-15.4h38.4c8.5 0 8.5 6.9 0 6.9H76.7z"/>
				</g>
			</svg>
			Sign in with Slack
		</button>
	</main>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import feedyLogo from '@/assets/images/feedy_logo.png';

const clientId = import.meta.env.VITE_SLACK_CLIENT_ID;
const redirectUri = 'https://mcfeedface-frontend-production.up.railway.app/slack/callback';
const slackOauthUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=commands&user_scope=users:read,users:read.email&redirect_uri=${redirectUri}`;

const router = useRouter();
function signInWithSlack() {
	// Redirect to Slack OAuth URL
	window.location.href = slackOauthUrl;
}

</script>