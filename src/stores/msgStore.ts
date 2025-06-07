import { defineStore } from "pinia";

export const useMsgStore = defineStore('msg', {
	  state: () => ({
		msg: {
			image: '',
			title: '',
			description: '',
			text: '',
			buttonText: '',
		}
	  }),
})