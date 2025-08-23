<template>
		<SetupComp 
			title="Sweet! Now, let's configure your account"
			text="Don't worry, you can also change these settings later on. This is just to get you set up."
			button-text="Continue"
			:onAction="() => saveSettings()"
			:disabled="!selectedFramework"
		>
		<div class="flex flex-col justify-center w-full mt-10">
			<p class="text-l font-medium w-full mt-6" aria-labelledby="company-name">What is your company name?</p>
			<input v-model="companyName" name="company-name" class="outline-lumy-purple text-lg border border-gray-300 rounded"/>
			<p class="text-l font-medium w-full mt-6">Which feedback framework would you like to use?</p>
			<div class="relative">
				<Listbox v-model="selectedFramework">
					<Float
						placement="bottom"
						:flip="true"
						:offset="4"
						:portal="true"
					>
						<ListboxButton class="w-full p-2 border rounded border-gray-300 flex cursor-pointer justify-between items-center text-gray-700 bg-white">
							<span>
								{{ frameworks?.find(fw => fw.id === selectedFramework)?.name || 'Select a framework' }}
							</span>
							<ChevronDown class="ml-2 w-4 h-4" />
						</ListboxButton>
						<ListboxOptions class="absolute w-full h-48 overflow-auto bg-white border border-gray-300 rounded shadow-lg z-10">
							<ListboxOption
								v-for="fw in frameworks"
								:key="fw.id"
								:value="fw.id"
								class="cursor-pointer select-none hover:bg-purple-50"
							>
								<div class="px-4 py-2">
								<span class="font-medium">{{ fw.name }}</span>
								<div class="text-xs text-gray-500">{{ fw.definition }}</div>
								</div>
							</ListboxOption>
						</ListboxOptions>
					</Float>
				</Listbox>
			</div>
			<p class="mt-6 text-l font-medium w-full">Which bot personality would you like to use?</p>

				<Listbox v-model="selectedBot">
					<Float
						as="div"
						class="relative"
						placement="top"
						:flip="true"
						:offset="4"
						:portal="true"
						floating-as="template"
					>
						<ListboxButton class="w-full p-2 border rounded border-gray-300 flex cursor-pointer justify-between items-center text-gray-700 bg-white">
							<span>{{ botPersonalities?.find(bp => bp.id === selectedBot)?.name || 'Select a bot personality' }}</span>
							<ChevronDown class="ml-2 size-4"/>
						</ListboxButton>
						<ListboxOptions class=" absolute w-full h-48 overflow-auto bg-white border border-gray-300 rounded shadow-lg z-10">
							<ListboxOption
							v-for="bp in botPersonalities"
							:key="bp.id"
							:value="bp.id"
							class="cursor-pointer select-none hover:bg-purple-50"
							>
								<div class="px-4 py-2">
									<span class="font-medium">{{ bp.name }}</span>
									<div class="text-xs text-gray-500">
										{{ bp.description }}
									</div>
								</div>
							</ListboxOption>
						</ListboxOptions>
					</Float>
				</Listbox>

		</div>
		</SetupComp>
		<BaseToast
			v-if="showToast"
			:text="toastText"
			:bgClass="toastBg"
			:show="showToast"
			@close="showToast = false"
		/>
</template>

<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next';
import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from '@headlessui/vue'
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import type { BotPersonality, FeedbackFramework } from '@/types';
const router = useRouter();
import SetupComp from '@/components/setup/SetupComp.vue';
import BaseToast from '@/components/base/BaseToast.vue';
import api from '@/services/api';


const companyName = ref('');
const selectedFramework = ref();
const selectedBot = ref();
const botPersonalities = ref<BotPersonality[]>();
const frameworks = ref<FeedbackFramework[]>();
const showToast = ref(false);
const toastText = ref('');
const toastBg = ref('bg-green-500');

onMounted(async () => {
	try {
		const botRes = await api.get('/bot-personalities');
		if (botRes.status === 200) {
			botPersonalities.value = botRes.data;
		}
		const frameworksRes = await api.get('/frameworks');
		if (frameworksRes.status === 200) {
			frameworks.value = frameworksRes.data;
		}
	} catch (error) {
		toastBg.value = 'bg-red-500';
		toastText.value = 'Error loading data. Please try again later.';
		showToast.value = true;
		console.error('Error loading bot personalities or frameworks:', error);
	}
});

const saveSettings = async () => {
	switch (true) {
    case !companyName.value:
      toastBg.value = 'bg-red-500';
      toastText.value = 'Please enter your company name.';
      showToast.value = true;
      return;
    case !selectedFramework.value:
      toastBg.value = 'bg-red-500';
      toastText.value = 'Please select a feedback framework.';
      showToast.value = true;
      return;
    case !selectedBot.value:
      toastBg.value = 'bg-red-500';
      toastText.value = 'Please select a bot personality.';
      showToast.value = true;
      return;
  }
	try {
		const res = await api.patch('/account', { framework_id: selectedFramework.value, bot_personality_id: selectedBot.value, name: companyName.value });
		if (res.status === 200) {

			router.push('/setup/users');
		} else {
			console.error('Error setting framework:', res);
		}
	} catch (error: any) {
		toastBg.value = 'bg-red-500';
		toastText.value = error?.response?.data?.detail || 'Could not save settings';
		showToast.value = true;
		console.error('Error saving settings:', error);
	}
	
}

</script>
