<template>
	<div class="flex flex-col items-center justify-center">
		<SetupComp 
			title="Sweet! Now, let's configure your account"
			text="Don't worry, you can also change these settings later on. This is just to get you set up."
			button-text="Continue"
			:onAction="() => saveSettings()"
			:disabled="!selectedFramework"
		>
		<div class="flex flex-col justify-center w-full mt-10">
			<p class="text-l font-medium w-full">Which feedback framework would you like to use?</p>
			<Listbox v-model="selectedFramework">
          <div class="relative">
            <ListboxButton class="w-full p-2 border rounded border-gray-300 flex cursor-pointer justify-between items-center text-gray-700 bg-white">
              <span>
                {{ frameworks?.find(fw => fw.id === selectedFramework)?.name || 'Select a framework' }}
              </span>
              <ChevronDown class="ml-2 w-4 h-4" />
            </ListboxButton>
            <ListboxOptions class="absolute mt-1 w-full h-48 overflow-auto bg-white border border-gray-300 rounded shadow-lg z-10">
              <ListboxOption
                v-for="fw in frameworks"
                :key="fw.id"
                :value="fw.id"
                class="cursor-pointer select-none px-4 py-2 hover:bg-purple-50"
              >
                <div>
                  <span class="font-medium">{{ fw.name }}</span>
                  <div class="text-xs text-gray-500">{{ fw.definition }}</div>
                </div>
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Listbox>
		  <p class="mt-6 text-l font-medium w-full">Which bot personality would you like to use?</p>
		  <Listbox v-model="selectedBot">
			<div class="relative">
				<ListboxButton class="w-full p-2 border rounded border-gray-300 flex cursor-pointer justify-between items-center text-gray-700 bg-white">
					<span>{{ botPersonalities?.find(bp => bp.id === selectedBot)?.name || 'Select a bot personality' }}</span>
					<ChevronDown class="ml-2 size-4"/>
				</ListboxButton>
				<ListboxOptions class="absolute mt-1 w-full h-48 overflow-auto bg-white border border-gray-300 rounded shadow-lg z-10">
					<ListboxOption
					v-for="bp in botPersonalities"
					:key="bp.id"
					:value="bp.id"
					class="cursor-pointer select-none px-4 py-2 hover:bg-purple-100"
					>
						<div>
							<span class="font-medium">{{ bp.name }}</span>
							<div class="text-xs text-gray-500">
								{{ bp.description }}
							</div>
						</div>
					</ListboxOption>
				</ListboxOptions>
			</div>
		  </Listbox>
		</div>
		</SetupComp>
	</div>
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
import { useAuthStore } from '@/stores/authStore';
import api from '@/services/api';
const authStore = useAuthStore();
const selectedFramework = ref();
const selectedBot = ref();
const botPersonalities = ref<BotPersonality[]>();
const frameworks = ref<FeedbackFramework[]>();

onMounted(async () => {
	const botRes = await api.get('/bot-personalities');
	if (botRes.status === 200) {
		botPersonalities.value = botRes.data;
	} else {
		console.error('Error fetching bot personalities:', botRes);
	}
	const frameworksRes = await api.get('/frameworks');
	if (frameworksRes.status === 200) {
		frameworks.value = frameworksRes.data;
	} else {
		console.error('Error fetching frameworks:', frameworksRes);
	}
});

const saveSettings = async () => {
	const res = await api.patch('/account', { framework_id: selectedFramework.value, bot_personality_id: selectedBot.value });
	if (res.status === 200) {

		router.push('/setup/users');
	} else {
		console.error('Error setting framework:', res);
	}
	
}

</script>
