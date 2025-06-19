<template>
	<div class="flex flex-col p-4 rounded-2xl bg-white drop-shadow-xl w-full min-h-[80vh] mt-8 mb-8 md:p-10 md:w-[75vw]">
		<header class="w-full mb-10">
			<h1 class="font-light text-2xl font-inter text-darkblue">Your Feedback Fuels My Superpowers!</h1>
		</header>
		<hr class="w-full mb-10 border-t-2 border-gray-300"/>
		<section>
			<h3 class="font-light text-gray-500">Skill: <span class="text-lumy-purple">{{ requestInfo?.skill.skill }}</span></h3>
			<p class="font-light text-gray-500">{{ requestInfo?.skill.definition }}</p>
		</section>
		<hr class="w-full mt-6 mb-8 border-t-2 border-gray-300"/>
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
				<p class="self-center font-light text-lg">{{ requestInfo?.sender.name }}</p>
				</div>
			<section v-if="requestInfo?.message " class="pl-10 pb-6">
				<p class="text-light italic text-gray-600">“{{requestInfo?.message}}”</p>
			</section>
		</section>
		<section ref="feedbackSection">
			<h2 class="font-medium text-lg">Your feedback</h2>
			<p class="font-light text-gray-500">Remember to make your feedback actionable, or use AI to help you write it</p>
			<div class="flex flex-col sm:flex-row gap-4 mt-4">
				<form  class="mt-4 sm:w-[60%] w-full">
					<textarea
						v-model="feedback"
						class="w-full h-full p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lumy-purple"
						placeholder="Write your feedback here..."
						rows="6"
					></textarea>
				</form>
				<aside class="mt-4 p-4 sm:w-[40%] w-full bg-light-gray flex flex-col justify-center">
					<h3 class="font-light text-gray-600 mb-2">How to write great feedback the - {{ requestInfo?.framework.name }} way:</h3>
					<p class="text-gray-400">
						{{ requestInfo?.framework.definition }}
					</p>
				</aside>
			</div>
			<div class="flex justify-between mt-2">
				<BaseButton 
				:onAction="getSuggestions"
				btnText="Improve my feedback!"
				:disabled="loadingSuggestions || feedback.trim().length < 15"
				/>
				<BaseButton
				v-if="aiSuggestions.length > 1"
				:onAction="postFeedback"
				btnText="Send Feedback"
				:disabled="disablePost"
				/>
			</div>
		</section>
		<section ref="suggestionsSection">
			<h2 class="font-medium text-lg mt-10">AI Suggestions</h2>
			<p class="font-light text-gray-500">Click on the plus button to insert it into your feedback.</p>
			<div v-if="loadingSuggestions" class="flex flex-col w-full justify-center items-center p-8 mt-4">
				<div class="w-12 h-12 border-4 border-slate-200 border-t-[#4a154b] rounded-full animate-spin mb-4"></div>
				<p class="text-gray-700">Conferring with the feedback gurus...</p>
  			</div>
			<div
			v-if="aiSuggestions.length > 0"
			v-for="suggestion in aiSuggestions"
			:key="suggestion"
			class="flex flex-col justify-between sm:flex-row w-full sm:items-center p-8 gap-4 mt-4 bg-light-gray">
				<p class="text-gray-700">{{ suggestion }}</p>
				<button @click="addSuggestion(suggestion)" class="bg-lumy-purple text-white text-2xl px-4 py-2 cursor-pointer">+</button>
			</div>
			<div
			v-else
			class="flex w-full justify-between items-center p-8 gap-4 mt-4 bg-light-gray">
				<p class="text-gray-700">AI suggestion not available yet. A minimum of 15 characters are required to generate suggestion.</p>
			</div>
		</section>
		<hr class="w-full mt-10 mb-10 border-t-2 border-light-gray"/>

		<div v-if="aiSuggestions.length < 1" class="flex justify-end mt-4">
			<BaseButton
				:onAction="postFeedback"
				btnText="Send Feedback"
				:disabled="disablePost"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { User2 } from 'lucide-vue-next'
import BaseButton from '@/components/base/BaseButton.vue'
import type { User, FeedbackRequest } from '@/types'
import api from '@/services/api'
import { useErrorStore } from '@/stores/errorStore'
import type { Axios, AxiosError } from 'axios'

const errorStore = useErrorStore()

const requestInfo = ref<FeedbackRequest>()
const disablePost = ref<boolean>(false)
const feedback = ref<string>('')
const aiSuggestions = ref<string[]>([])
const loadingSuggestions = ref<boolean>(false)
const suggestionsSection = ref<HTMLElement | null>(null)
const feedbackSection = ref<HTMLElement | null>(null)


const route = useRoute()
const router = useRouter()
const requestUuId = route.query.uuid as string

onMounted(async () => {
	try {
		const res = await api.get(`/requests/${requestUuId}`);

		if(res.status === 200) {
			requestInfo.value = res.data
			console.log('Request info fetched successfully:', requestInfo.value)
		} else {
			console.error('Error fetching request info:', res.data)
		}
	} catch (error) {
		console.error('Error fetching request info:', error);
	}
})

const addSuggestion = (suggestion: string) => {
	feedback.value = suggestion
	nextTick(() => {
		feedbackSection.value?.scrollIntoView({ behavior: 'instant' })
	})
}

const getSuggestions = async () => {
	loadingSuggestions.value = true
	const query = feedback.value
	nextTick(() => {
    suggestionsSection.value?.scrollIntoView({ behavior: 'instant' })
  })
	try {
		const res = await api.post('feedback/improve', {
			feedback_request_id: requestUuId,
			text: query,
		})
		if (res.status === 200) {
			aiSuggestions.value = res.data.suggestions
		}		
	} catch (error) {
		console.error('Error fetching AI suggestions:', error)
	} finally {
		loadingSuggestions.value = false
	}
	
}

async function postFeedback() {
	disablePost.value = true

	const res = await api.post('/submissions', {
		feedback_request_id: requestInfo.value?.id,
		content: feedback.value,
	})
	if (res.status === 200) {
		router.push({ name: 'feedback-give-success' })
		feedback.value = ''
	} else {
		console.log('Error posting feedback:', res)
		errorStore.setError({
			code: res.status,
			detail: res.data.detail || 'An error occurred while posting feedback.'
		});
		router.push({ name: 'error' });
	}


	
		
}

</script>