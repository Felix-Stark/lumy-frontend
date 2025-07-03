<template>
	<article class="flex flex-col items-center justify-center h-full">
		<h1 v-if="title" class="font-inter font-semibold text-3xl text-center">{{ title }}</h1>
		<p v-if="text" class="font-inter font-light text-center mt-2.5">
			{{ text }}
		</p>
	</article>
	<section class="flex flex-col items-center justify-center p-2 overflow-auto mt-4">
		<p>
			{{ explain }}
		</p>
		<slot/>
	</section>
	<div class="flex flex-col items-center mt-3">
		<button v-if="buttonText"
		class="bg-purple-500 hover:bg-purple-400 min-w-3xs max-w-3xs text-white font-bold py-2 px-4 rounded-md cursor-pointer transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
		@click="onAction"
		:disabled="disabled"
		>
			{{ buttonText }}
		</button>
	</div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
	title?: string
	text?: string
	explain?: string
	buttonText?: string
	onAction?: () => void
	disabled?: boolean
	loader?: boolean
  }>()
  </script>
