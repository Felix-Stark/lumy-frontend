<template>
	<div class="flex flex-col p-10 rounded-2xl bg-white drop-shadow-xl w-[75vw] min-h-[80vh] mb-8">
		<header class="w-full mb-10">
			<h1 class="font-light text-2xl font-inter text-darkblue">Your Feedback Fuels My Superpowers!</h1>
		</header>
		<hr class="w-full mt-6 mb-10 border-t-2 border-gray-300"/>
		<section>
			<h3 class="font-light text-gray-500">Skill: <span class="text-lumy-purple">{{ requestInfo?.skill.skill }}</span></h3>
			<p class="font-light text-gray-500">{{ requestInfo?.skill.definition }}</p>
		</section>
		<hr class="w-full mt-10 mb-10 border-t-2 border-gray-300"/>
		<section>
			<div class="flex gap-4">
				<img
				v-if="requestInfo?.sender.avatar"
				:src="requestInfo?.sender.avatar"
				alt="User Avatar"
				class="w-12 h-12 rounded-full object-cover"
				/>
				<div v-else class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
					<User2 />
				</div>
				<p class="self-center font-light text-lg">Elena Morales</p>
				</div>
			<section class="pl-10">
				<p class="text-light italic text-gray-600">“{{requestInfo?.message}}”</p>
			</section>
		</section>
		<section>
			<h2 class="font-medium text-lg">Your feedback</h2>
			<p class="font-light text-gray-500">Remember to make your feedback actionable, or use AI to help you write it</p>
			<div class="flex">
				<form  class="mt-4 w-[60%]">
					<textarea
						class="w-full h-full p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lumy-purple"
						placeholder="Write your feedback here..."
						v-model="feedback"
					></textarea>
				</form>
				<aside class="mt-4 p-4 bg-gray-200  flex flex-col">
					<ul class="list-disc list-inside text-gray-700">
						<li><span class="font-semibold">Be specific</span> - Focus on one clear behavior or moment.</li>
						<li><span class="font-semibold">Look ahead</span> - Suggest what they could do more of, less of, or differently next time.</li>
						<li><span class="font-semibold">Keep it constructive</span> - Aim to support growth and not to judge.</li>
					</ul>
					<p class="font-semibold text-gray-700">If you need help, check the suggestions below.</p>
				</aside>
			</div>
		</section>
		<hr class="w-full mt-10 mb-10 border-t-2 border-gray-300"/>
		<div class="flex justify-end mt-4">
			<button
			@click="postFeedback"
			class="px-6 py-2 bg-lumy-purple text-white rounded-lg hover:opacity-50 transition-colors"
			>
				Send Feedback
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMsgStore } from '@/stores/msgStore'
import { User2 } from 'lucide-vue-next'
import type { User, FeedbackRequest } from '@/types'
import api from '@/services/api'
import lumyCheering from '@/assets/images/lumy_cheering.png'
const user = ref<User>()
const requestInfo = ref<FeedbackRequest>()
const feedback = ref<string>('')
const showDialog = ref(true)
const route = useRoute()
const router = useRouter()
const requestUuId = route.query.uuid as string
const msgStore = useMsgStore()

onMounted(async () => {
	if (!requestUuId) {
		console.error('No request ID provided in the route query parameters.')
	}
	try {
		const res = await api.get(`/requests/${requestUuId}`);
		requestInfo.value = res.data;
		requestInfo.value = res.data;
	} catch (error) {
		console.error('Error fetching request info:', error);
	}
})

async function postFeedback() {
	const res = await api.post('/submissions', {
		feedback_request_id: requestInfo.value?.id,
		content: feedback.value,
	})
	if (res.status === 200) {
		router.push({ name: 'feedback-give-success' })
		feedback.value = ''
	} else {
		console.error('Error sending feedback:', res.data)
	}
}

</script>