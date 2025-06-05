<template>
	<div class="flex flex-col items-center justify-center h-screen">
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
                {{ frameworks.find(fw => fw.id === selectedFramework)?.name || 'Select a framework' }}
              </span>
              <ChevronDown class="ml-2 w-4 h-4" />
            </ListboxButton>
            <ListboxOptions class="absolute mt-1 w-full bg-white border border-gray-300 rounded shadow-lg z-10">
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
					<span>{{ botPersonalities.find(bp => bp.id === selectedBot)?.name || 'Select a bot personality' }}</span>
					<ChevronDown class="ml-2 size-4"/>
				</ListboxButton>
				<ListboxOptions class="absolute mt-1 w-full h-[15rem] overflow-auto bg-white border border-gray-300 rounded shadow-lg z-10">
					<ListboxOption
					v-for="bp in botPersonalities"
					:key="bp.id"
					:value="bp.id"
					class="cursor-pointer select-none px-4 py-2 hover:bg-purple-100"
					>
						<div>
							<span class="font-medium">{{ bp.name }}</span>
							<div class="text-xs text-gray-500">
								{{ bp.definition }}
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
import { ref } from 'vue';
const router = useRouter();
import SetupComp from '@/components/setup/SetupComp.vue';
import api from '@/services/api';
const selectedFramework = ref();
const selectedBot = ref();

const saveSettings = async () => {
	const res = await api.patch('/account', { framework: selectedFramework.value, botPersonality: selectedBot.value });
	if (res.status === 200) {
		router.push('/setup/users');
	} else {
		console.error('Error setting framework:', res);
	}
}



const botPersonalities = [
	{
		id: 'coach_clara',
		name: 'Coach Clara',
		definition: 'Empathetic, focused, and great at guiding reflection and growth.'
	},
	{
		id: 'focus_felix',
		name: 'Focus Felix',
		definition: 'Minimalist, calm, and obsessed with helping you finish what matters.'
	},
	{
		id: 'treepio',
		name: 'Treepio',
		definition: 'Anxiously helpful, fluent in six million forms of feedback.'
	},
	{
		id: 'tengiltron',
		name: 'Tengiltron',
		definition: 'Overlord of order. Craves structure. Lives to conquer chaos.'
	},
	{
		id: 'glitch',
		name: 'Glitch',
		definition: 'Hyperactive AI sidekick. May or may not be debugging itself.'
	},
	{
		id: 'nudgey',
		name: 'Nudgey',
		definition: 'Gently encouraging. Always there with a soft reminder.'
	},
	{
		id: 'sunny',
		name: 'Sunny',
		definition: 'Cheerful, supportive, and a bit emoji-happy. Your personal hype bot.'
	}
]

const frameworks = [
	{
		id: 'no_framework',
		name: 'No framework',
		definition: 'Freeform feedback without structure — flexible, but often vague or inconsistent.'
	},
	{
		id: 'coin_framework',
		name: 'COIN Framework',
		definition: 'Describes the Context, Observation, Impact, and Next steps to give clear and actionable feedback.',
	},
	{
		id: 'sbi_model',
		name: 'SBI Model',
		definition: 'Focuses on Situation, Behavior, and Impact to keep feedback objective and behavior-focused.',

	},
	{
		id: 'start_stop_continue',
		name: 'Start - Stop - Continue',
		definition: 'Encourages reflection by identifying what someone should start, stop, and continue doing.',
	},
	{
		id: 'boost_model',
		name: 'BOOST Model',
		definition: 'Ensures feedback is Balanced, Observed, Objective, Specific, and Timely for maximum clarity.'
	},
	{
		id: 'eec_model',
		name: 'EEC Model',
		definition: 'Covers Example, Effect, and Change to give feedback with context and clear suggestions.'
	},
	{
		id: 'radical_candor',
		name: 'Radical Candor',
		definition: 'Combines caring personally with challenging directly to promote honest and respectful feedback.'
	},
	{
		id: 'feedforward',
		name: 'Feedforward',
		definition: 'Focuses entirely on future-focused suggestions rather than past actions or mistakes.'
	},
	{
		id: 'aid_model',
		name: 'AID Model',
		definition: 'Covers Action, Impact, and Desired outcome, making feedback constructive and goal-oriented.'
	},
	{
		id: 'candor_framework',
		name: 'CANDOR Framework',
		definition: 'Encourages open, honest, and respectful conversations built on clarity and responsibility.'
	}
]
</script>
