<template>
	<div class="flex flex-col p-10 rounded-2xl bg-white drop-shadow-xl w-[75vw] min-h-[80vh] mb-8">
		<header class="w-full mb-10">
			<h1 class="font-light text-lg text-darkblue">Your Feedback Fuels My Superpowers!</h1>
		</header>
		<section>
			<h3 class="font-light text-gray-500">Skill: <span class="text-lumy-purple">Communication</span></h3>
			<p class="font-light text-gray-500">The ability to clearly express ideas and information, listen actively, and adapt your message to the audience.</p>
		</section>
		<hr class="w-full mt-10 mb-10 border-t-2 border-gray-400"/>
		<section>
			<div class="flex">
				<img
				v-if="user?.avatar"
				:src="user?.avatar"
				alt="User Avatar"
				class="w-12 h-12 rounded-full object-cover"
				/>
				<div v-else class="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
					<User2 />
				</div>
				<p>Elena Morales</p>
				</div>
			<section>
				<p class="text-light italic text-gray-500 my-5">“Describe a recent moment when I communicated something clearly — or when my message could have been clearer. What was the situation, and how did it come across to you?”</p>
			</section>
		</section>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { User2 } from 'lucide-vue-next'
import type { User } from '@/types'
const user = ref<User>()
</script>