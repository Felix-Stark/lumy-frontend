<template>
  <article class="flex flex-col items-center justify-center">
			<div class="flex flex-col items-center justify-center">
				<img v-if="image" :src="image" alt="McFeedFace Logo" class="w-56 h-auto mt-4 mb-4" />
			</div>
      <div v-if="loader" class="w-12 h-12 border-4 border-slate-200 border-t-[#4a154b] rounded-full animate-spin mb-4"></div>
			<h1 v-if="title" class="font-inter font-semibold text-xl text-center">{{ title }}</h1>
			<h2 v-if="description" class="font-inter font-semibold text-lg text-center"> {{ description }}</h2>
		</article>
		<section class="flex flex-col items-center justify-center mt-4">
			<p v-if="text" class="font-inter font-light text-lg text-center">
				{{ text }}
			</p>
      <slot/>
		</section>
    <button v-if="buttonText"
      class="bg-[#962DFF] hover:bg-[#962dffb5] min-w-3xs text-white font-bold py-2 px-4 rounded-md mt-4 cursor-pointer transition duration-200 ease-in-out"
      @click="onAction"
      >
        {{ buttonText }}
      </button>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  text?: string
  image?: string
  buttonText?: string
  onAction?: () => void
  loader?: boolean
}>()
</script>