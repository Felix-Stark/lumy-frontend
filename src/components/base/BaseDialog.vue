<template>
	<Dialog :open="isOpen" @close="emit('close')" class="relative z-50">
		<div class="fixed inset-0 bg-black/30" aria-hidden="true" />
		<div class="fixed inset-0 flex w-screen items-center justify-center p-4">
			<DialogPanel class="w-full flex flex-col gap-6 max-w-md rounded-lg bg-white p-8">
				<div v-if="imgPath" class="w-full">
					<img :src="imgPath" alt="Lumy Logo" class="min-w-40 h-auto  mb-4" />
				</div>
				<DialogTitle v-if="title" class="text-2xl font-semibold">{{ title }}</DialogTitle>
				<DialogDescription v-if="message">
				{{ message }}
				</DialogDescription>
				<slot />
				<button v-if="btnText" @click="emit('close')" class="px-4 py-2 bg-lumy-purple text-white rounded">{{ btnText }}</button>
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
  message: {
	type: String,
	default: ''
  },
  btnText: {
	type: String,
	default: 'Close'
  }
})
const emit = defineEmits(['close'])
</script>