<template>
	<SlackFlowComp 
	:image="lumySad"
	buttonText="Back to start"
	:onAction="() => $router.replace({name: 'slack-login'})"
	title="Oh no! This can't be right!"
	text="It looks like you're not an admin in your Slack workspace, which is required to install this awesomeness. Notify your Slack admin so they can finish the installation!"
	>
	</SlackFlowComp>
</template>

<script setup lang="ts">
import SlackFlowComp from '@/components/slackFlow/SlackFlowComp.vue';
import lumySad from '@/assets/images/lumy_sad.png';

</script>