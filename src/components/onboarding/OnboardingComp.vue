<template>
	<div>
	<article class="flex flex-col items-center justify-center">
		<div class="flex flex-col items-center justify-center">
		<h1 v-if="title" class="font-inter font-semibold text-3xl text-center">{{ title }}</h1>
		<p v-if="text" class="font-inter font-light text-center mt-2.5">
			{{ text }}
		</p>
		</div>
	</article>
	<section class="flex flex-col items-center justify-center mt-4">
		<slot/>
	<p>
		{{ explain }}
	</p>
	</section>
	<div class="w-20 h-20 bg-mypurple hover:bg-mypurple-light"></div>
	<div class="flex flex-col items-center mt-4">
		<button v-if="buttonText"
		  class="bg-mypurple hover:bg-mypurple-light min-w-3xs max-w-3xs text-white font-bold py-2 px-4 rounded-md mt-4 cursor-pointer transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
		  @click="onAction"
		  :disabled="disabled"
		  >
			{{ buttonText }}
		  </button>
	</div>
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
