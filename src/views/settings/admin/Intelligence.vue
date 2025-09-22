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

            <!-- <div class="flex flex-col pl-8 pb-6 border-l border-gray-300">
                <label class="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <Listbox v-model="selectedFrequency">
                    <Float
                    placement="top"
                    :offset="4"
                    :flip="true"
                    >
                    <ListboxButton class="w-full rounded-lg border px-2 py-1 text-left shadow-sm cursor-default">
                        <span class="block truncate">{{ frequencies.find(f => f.value === selectedFrequency )?.label || frequencies.find(f => f.value === accountStore.account?.nudge_interval)?.label }}</span>
                        <span class="flex items-center pr-2">
                        <ChevronsUpDown class="h-5 w-5 text-gray-400" />
                        </span>
                    </ListboxButton>
                    <ListboxOptions class="mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <ListboxOption
                        v-for="freq in frequencies"
                        :key="freq.value"
                        :value="freq.value"
                        class="cursor-default select-none py-2 pl-10 pr-4 hover:bg-gray-100"
                        >
                        <span class="block truncate">{{ freq.label }}</span>
                        <span
                            v-if="selectedFrequency === freq.value"
                            class="flex items-center pl-3 text-green-600"
                        >
                            <Check class="h-5 w-5" />
                        </span>
                        </ListboxOption>
                    </ListboxOptions>
                    </Float>
                </Listbox>

            </div>
            <div class="flex flex-col w-full pl-8 pb-6 border-l border-gray-300">
                <label class="block text-sm font-medium text-gray-700 mb-1">Day</label>
                <Listbox v-model="selectedDay">
                    <ListboxButton class="w-full rounded-lg border py-2 pl-3 pr-10 text-left shadow-sm cursor-default">
                        <span class="block truncate">{{ weekdays.find(d => d.value === selectedDay)?.label || weekdays.find(d => d.value === accountStore.account?.nudge_day)?.label }}</span>
                        <span class="inset-y-0 right-0 flex items-center pr-2">
                        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" />
                        </span>
                    </ListboxButton>
                    <ListboxOptions class="mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <ListboxOption
                        v-for="day in weekdays"
                        :key="day.value"
                        :value="day.value"
                        class="cursor-default select-none py-2 pl-10 pr-4 hover:bg-gray-100"
                        >
                        <span class="block truncate">{{ day.label }}</span>
                        <span
                            v-if="selectedDay === day.value"
                            class="inset-y-0 left-0 flex items-center pl-3 text-green-600"
                        >
                            <CheckIcon class="h-5 w-5" />
                        </span>
                        </ListboxOption>
                    </ListboxOptions>
                </Listbox>

            </div>
            <div class="flex flex-col w-full pl-8 pb-6 border-l border-gray-300">
                <label class="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <Listbox v-model="selectedHour">
                    <Float
                        placement="top"
                        :offset="4"
                        :flip="true"
                    >
                    <ListboxButton class="w-full rounded-lg border py-2 pl-3 pr-10 text-left shadow-sm cursor-default">
                        <span class="block truncate">{{ hours.find(h => h.value === selectedHour)?.label || hours.find(h => h.value === accountStore.account?.nudge_hour)?.label }}</span>
                        <span class="inset-y-0 right-0 flex items-center pr-2">
                        <ChevronsUpDown class="h-5 w-5 text-gray-400" />
                        </span>
                    </ListboxButton>
                    <ListboxOptions class="mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-lumy-purple ring-opacity-5 focus:outline-none">
                        <ListboxOption
                        v-for="hour in hours"
                        :key="hour.value"
                        :value="hour.value"
                        class="cursor-default select-none py-2 pl-10 pr-4 hover:bg-gray-100"
                        >
                        <span class="block truncate">{{ hour.label }}</span>
                        <span
                            v-if="selectedHour === hour.value"
                            class="inset-y-0 left-0 flex items-center pl-3 text-green-600"
                        >
                            <CheckIcon class="h-5 w-5" />
                        </span>
                        </ListboxOption>
                    </ListboxOptions>
                    </Float>
                </Listbox>

            </div> -->

            <div class="flex flex-col w-full pl-8 pb-6 border-l border-gray-300">
                <p class="font-thin text-sm text-gray-500">Feedback reminders will be sent out on selected day and time, based on your team's time zone.</p>
                <div class="flex flex-row w-full ">
                    <select v-model="selectedFrequency" class="mt-2 mr-2 p-2 border border-gray-300 rounded">
                        <option v-for="freq in frequencies" :key="freq.value" :value="freq.value">
                            {{ freq.label }}
                        </option>
                    </select>
                    <select v-model="selectedDay" class="mt-2 mr-2 p-2 border border-gray-300 rounded">
                        <option v-for="day in weekdays" :key="day.value" :value="day.value">
                            {{ day.label }}
                        </option>
                    </select>
                    <select v-model="selectedHour" class="mt-2 p-2 border border-gray-300 rounded">
                        <option v-for="hour in hours" :key="hour.value" :value="hour.value">
                            {{ hour.label }}
                        </option>
                    </select>
                </div>
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


onMounted(async () => {
    await accountStore.getAccount();
    if (accountStore.account) {
        toggleCoaching.value = accountStore.account.intelligence_coach;
        toggleSuggestions.value = accountStore.account.intelligence_assistant;
        selectedFrequency.value = accountStore.account.nudge_interval_weeks;
        selectedDay.value = accountStore.account.nudge_weekday;
        selectedHour.value = accountStore.account.nudge_hour;
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