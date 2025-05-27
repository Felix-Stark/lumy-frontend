<template>
	<div class="flex flex-col items-center justify-center h-screen">
		<SetupComp 
			title="Sweet! Now, let's configure your account"
			text="Don't worry, you can also change these settings later on. This is just to get you set up."
			button-text="Continue"
			:onAction="() => setFramework()"
			:disabled="!selectedFramework"
		>
		<div class="flex flex-col justify-center w-full mt-10">
			<p class="text-l font-medium w-full">Which feedback framework would you like to use?</p>
			<select
			v-model="selectedFramework"
			class="mt-4 px-4 py-2 rounded border border-gray-300 focus:outline-none"
		  >
			<option value="" disabled selected>Select a feedback framework</option>
			<option
			  v-for="fw in frameworks"
			  :key="fw.id"
			  :value="fw.value"
			>
			  {{ fw.name }}
			</option>
		  </select>

		</div>
		</SetupComp>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
const router = useRouter();
import SetupComp from '@/components/setup/SetupComp.vue';
import api from '@/services/api';
const selectedFramework = ref('');

const setFramework = async () => {
	const res = await api.put('/account/framework', { framework: selectedFramework.value });
	if (res.status === 200) {
		router.push('/setup/users');
	} else {
		console.error('Error setting framework:', res);
	}
	console.log('selectedFramework: ', selectedFramework.value)
}

const frameworks = [
	{
		id: 'coin_framework',
		name: 'COIN Framework',
		value: 'coin_framework',
	},
	{
		id: 'sbi_model',
		name: 'SBI Model',
		value: 'sbi_model',

	},
	{
		id: 'start_stop_continue',
		name: 'Start - Stop - Continue',
		value: 'start_stop_continue',
	}
]
</script>

<!-- <template>
  <div class="flex flex-col items-center justify-center h-screen bg-mcgray">
    <SetupComp 
      title="Sweet! Now, let's configure your account"
      text="Don't worry, you can also change these settings later on. This is just to get you set up."
      button-text="Continue"
      :onAction="() => router.push('/admin/setup/SetupFramework')"
      :disabled="!selectedFramework"
    >
      <select
        v-model="selectedFramework"
        class="mt-4 px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-mcpurple"
      >
        <option value="" disabled selected>Select a feedback framework</option>
        <option
          v-for="fw in frameworks"
          :key="fw.id"
          :value="fw.value"
        >
          {{ fw.name }}
        </option>
      </select>
    </SetupComp>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
const router = useRouter();
import SetupComp from '@/components/setup/SetupComp.vue';

const selectedFramework = ref('');
const frameworks = [
  {
    id: 'coin_framework',
    name: 'COIN Framework',
    value: 'coin_framework',
  },
  {
    id: 'sbi_model',
    name: 'SBI Model',
    value: 'sbi_model',
  },
  {
    id: 'start_stop_continue',
    name: 'Start - Stop - Continue',
    value: 'start_stop_continue',
  }
];
</script> -->