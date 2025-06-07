<template>
	<Dialog :open="isOpen" @close="emit('close')" class="relative z-50">
		<div class="fixed inset-0 bg-black/30" aria-hidden="true" />
		<div class="fixed inset-0 flex w-screen items-center justify-center p-4">
			<DialogPanel class="w-full flex flex-col gap-6 max-w-md rounded-lg bg-white p-8">
				<div>
					<img :src="imgPath" alt="Lumy Logo" class="size-40 mx-auto mb-4" />
				</div>
				<DialogTitle v-if="title" class="text-2xl font-semibold">{{ title }}</DialogTitle>
				<DialogDescription v-if="description">
				{{ description }}
				</DialogDescription>
		
				<p v-if="message">
				{{ message }}
				</p>
		
				<button @click="emit('close')" class="px-4 py-2 bg-lumy-purple text-white rounded">OK</button>
			</DialogPanel>
	  </div>
	</Dialog>
  </template>
  
<script setup>
import {
	  Dialog,
	  DialogPanel,
	  DialogTitle,
	  DialogDescription,
	} from '@headlessui/vue'
  
const props = defineProps({
  isOpen: {
	type: Boolean,
	required: true
  },
  imgPath: {
	type: String,
	default: ''
  },
  title: {
	type: String,
	default: ''
  },
  description: {
	type: String,
	default: ''
  },
  message: {
	type: String,
	default: ''
  }
})
const emit = defineEmits(['close'])
</script>