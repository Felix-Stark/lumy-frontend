<template>
	<SlackFlowComp 
	:image="lumySad"
	buttonText="Back to start"
	@onAction="() => router.push('/')"
	title="Oh no! This can't be right!"
	text="It looks like you're not an admin in your Slack workspace, which is required to install this awesomeness.
Copy the link below and send to one of your admins and you will be set up in no time!"
	>
	</SlackFlowComp>
</template>

<script setup lang="ts">
import SlackFlowComp from '@/components/slackFlow/SlackFlowComp.vue';
import lumySad from '@/assets/images/lumy_sad.png';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import router from '@/router';

</script>