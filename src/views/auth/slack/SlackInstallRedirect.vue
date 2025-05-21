<template>
<SlackAuthPage 
	text="Deploying bots and aligning stars... almost there!"
	:image="feedyWaiting"
	:loader="true"
/>
</template>

<script setup lang="ts">
import SlackAuthPage from '@/layouts/SlackAuthPage.vue';
import feedyWaiting from '@/assets/images/feedy_waiting.png';

const installSlack = () => {
	
}
</script>