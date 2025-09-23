<template>
    <div class="flex flex-col justify-between w-full bg-white p-8  rounded-xl shadow-md">
        <article class="flex flex-col gap-8 md:w-1/2">
            <h1 class="font-thin text-2xl text-gray-500">Feedback helpers</h1>
            <div class="flex flex-col pl-8 pb-6 border-l border-gray-300">
                <p class="font-thin text-sm">Toggle AI coaching</p>
            <Switch
                v-model="toggleCoaching"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer"
                :class="toggleCoaching ? 'bg-lumy-green' : 'bg-gray-200'"
            >
                <span
                class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                :class="toggleCoaching ? 'translate-x-6' : 'translate-x-1'"
                />
            </Switch>
            </div>
            <div class="flex flex-col pl-8 pb-6 border-l border-gray-300">
                <p class="font-thin text-sm">Toggle AI suggestions</p>
                <Switch
                    v-model="toggleSuggestions"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer"
                    :class="toggleSuggestions ? 'bg-lumy-green' : 'bg-gray-200'"
                >
                    <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    :class="toggleSuggestions ? 'translate-x-6' : 'translate-x-1'"
                    />
                </Switch>
            </div>
            <h1 class="font-thin text-2xl text-gray-500">Feedback reminders</h1>
            <div class="flex flex-col w-full pl-8 pb-6 border-l border-gray-300">
                <p class="font-thin text-sm text-gray-500">Feedback reminders will be sent out on selected day and time, based on your team's time zone.</p>
                <div class="flex flex-row w-full ">
                    <select v-model="selectedFrequency" class="mt-2 mr-2 p-2 border border-gray-300 rounded outline-lumy-secondary">
                        <option v-for="freq in frequencies" :key="freq.value" :value="freq.value">
                            {{ freq.label }}
                        </option>
                    </select>
                    <select v-model="selectedDay" class="mt-2 mr-2 p-2 border border-gray-300 rounded outline-lumy-secondary">
                        <option v-for="day in weekdays" :key="day.value" :value="day.value">
                            {{ day.label }}
                        </option>
                    </select>
                    <select v-model="selectedHour" class="mt-2 p-2 border border-gray-300 rounded outline-lumy-secondary">
                        <option v-for="hour in hours" :key="hour.value" :value="hour.value">
                            {{ hour.label }}
                        </option>
                    </select>
                </div>
            </div>
            <h1 class="font-thin text-2xl text-gray-500">Nudge Grace Period</h1>
            <div class="flex flex-col w-full pl-8 pb-6 border-l border-gray-300">
                <p class="font-thin text-sm text-gray-500">Number of minimum days between each intelligent nudge being sent to users (i.e. based on integrations)</p>
                <input v-model.number="ngp" type="number" :min="1" :max="10" :value="ngp" name="Nudge-grace-period" id="ngp" class="w-12 text-center outline-lumy-secondary" />
            </div>
        </article>
        <BaseButton
        :onAction="() => saveSettings()"
        >
            <span v-if="accountStore.loading" class="absolute left-3">
        <!-- Simple spinner -->
        <svg
          class="animate-spin h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </span>
      <span :class="{ 'opacity-50': accountStore.loading }">
        {{ accountStore.loading ?'Saving...' : 'Save Settings' }}
      </span>
        </BaseButton>
        <BaseToast
        :show="showToast"
        @close="showToast = false"
        :duration="3000"
        :text="toastText"
        :bg-class="toastBg"
        />
    </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseToast from '@/components/base/BaseToast.vue';
import { Float } from '@headlessui-float/vue'

import { ref, onMounted, watch } from 'vue';
import { Switch, Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { useAccountStore } from '@/stores/accountStore';

const accountStore = useAccountStore();
const toggleCoaching = ref(false);
const toggleSuggestions = ref(false);
const showToast = ref(false);
const toastText = ref('Settings saved successfully!');
const toastBg = ref('bg-lumy-green');
const btnText = ref('Save Settings');
const ngp = ref(0);


onMounted(async () => {
    await accountStore.getAccount();
    if (accountStore.account) {
        toggleCoaching.value = accountStore.account.intelligence_coach;
        toggleSuggestions.value = accountStore.account.intelligence_assistant;
        selectedFrequency.value = accountStore.account.nudge_interval_weeks;
        selectedDay.value = accountStore.account.nudge_weekday;
        selectedHour.value = accountStore.account.nudge_hour;
        ngp.value = accountStore.account.nudge_grace_period;
    }
})

const frequencies = [
  { label: 'Every week', value: 1 },
  { label: 'Every 2 weeks', value: 2 },
  { label: 'Every 3 weeks', value: 3 },
  { label: 'Every 4 weeks', value: 4 },
]

const weekdays = [
  { label: 'Monday', value: 0 },
  { label: 'Tuesday', value: 1 },
  { label: 'Wednesday', value: 2 },
  { label: 'Thursday', value: 3 },
  { label: 'Friday', value: 4 },
]

const hours = Array.from({ length: 24 }, (_, i) => ({
  label: `${i}:00`,
  value: i,
}))
const selectedFrequency = ref(0)
const selectedDay = ref(0)
const selectedHour = ref(0)

async function saveSettings() {
   if (!accountStore.account) {
    toastBg.value = 'bg-red-500';
    toastText.value = 'Account data not loaded. Please try again.';
    showToast.value = true;
    return;
   }

   const updated = {
    ...accountStore.account,
    intelligence_coach: toggleCoaching.value,
    intelligence_assistant: toggleSuggestions.value,
    nudge_interval_weeks: selectedFrequency.value,
    nudge_weekday: selectedDay.value,
    nudge_hour: selectedHour.value,
   };
   const res = await accountStore.updateAccount(updated);
   if (res) {
    toastBg.value = 'bg-lumy-green';
    toastText.value = 'Settings saved successfully!';
   } else {
        toastBg.value = 'bg-red-500';
        toastText.value = 'Failed to save settings. Please try again.';
    }
    showToast.value = true;
      
    
}

</script>