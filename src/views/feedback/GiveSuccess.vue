<template>
	<SuccessMsg
	title="Feedback Sent Successfully!"
	description="Thank you for your feedback! It helps us improve and grow."
	:image="lumyCheering"
	/>
</template>

<script setup lang="ts">
import SuccessMsg from '@/components/base/BaseMsg.vue'
import lumyCheering from '@/assets/images/lumy_cheering.png'
</script>