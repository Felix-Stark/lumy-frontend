<template>
	<SlackAuthLayout 
	:image="lumySad"
	title="Oh no! This can't be right!"
	text="It looks like you're not an admin in your Slack workspace, which is required to install this awesomeness.
Copy the link below and send to one of your admins and you will be set up in no time!"
	>
	<div class="flex items-center mt-4">
		<p class="font-inter font-light text-lg text-center border border-gray-300 rounded p-4">
			{{ installLink }}
		</p>
		<button
			class="bg-purple-500 text-white p-4 rounded hover:bg-purple-400 transition"
			@click="copyLink"
			type="button"
		>
			Copy
		</button>
	</div>
	<transition name="fade">
      <div
        v-if="showToast"
        class="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50"
      >
        Link copied to clipboard!
      </div>
    </transition>
	</SlackAuthLayout>
</template>

<script setup lang="ts">
import SlackAuthLayout from '@/layouts/SlackAuthLayout.vue';
import lumySad from '@/assets/images/lumy_sad.png';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const showToast = ref(false);

const installLink = 'https://mcfeedface-frontend-production.up.railway.app/slack/login';

const copyLink = () => {
	navigator.clipboard.writeText(installLink)
		.then(() => {
			showToast.value = true;
			setTimeout(() => {
				showToast.value = false;
			}, 2000); // Hide toast after 2 seconds
		})
		.catch(err => {
			console.error('Failed to copy: ', err);
			alert('Failed to copy link. Please try again.');
		});
}
</script>