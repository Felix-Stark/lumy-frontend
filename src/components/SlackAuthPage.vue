<template>
  <article>
			<div class="flex flex-col items-center justify-center">
				<img v-if="image" :src="image" alt="McFeedFace Logo" class="w-56 h-auto mt-4 mb-4" />
			</div>
			<h1 v-if="title" class="font-inter font-semibold text-xl text-center">{{ title }}</h1>
			<h2 v-if="description" class="font-inter font-semibold text-lg text-center"> {{ description }}</h2>
		</article>
		<section class="flex flex-col items-center justify-center mt-4">
			<p v-if="text" class="font-inter font-light text-lg text-center">
				{{ text }}
			</p>
      <slot/>
		</section>
    <button
      class="bg-[#962DFF] hover:bg-[#962dffb5] min-w-3xs text-white font-bold py-2 px-4 rounded-md mt-4 cursor-pointer transition duration-200 ease-in-out"
      @click="onAction"
      >
        {{ buttonText }}
      </button>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description: string
  text?: string
  image?: string
  buttonText: string
  onAction: () => void
}>()
</script>