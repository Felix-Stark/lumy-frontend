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

        </article>
        <BaseButton
        :btnText="btnText"
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
        {{ accountStore.loading ? btnText = 'Saving...' : btnText = 'Save Settings' }}
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
import { ref, onMounted, watch } from 'vue';
import { Switch } from '@headlessui/vue'
import { useAccountStore } from '@/stores/accountStore';
import { buttonNativeTypes } from 'element-plus';

const accountStore = useAccountStore();
const toggleCoaching = ref(false);
const toggleSuggestions = ref(false);
const showToast = ref(false);
const toastText = ref('Settings saved successfully!');
const toastBg = ref('bg-lumy-green');
const btnText = ref('Save Settings');

// Watch for when account data becomes available
watch(
  () => accountStore.account,
  (newAccount) => {
    if (newAccount) {
      toggleCoaching.value = newAccount.intelligence_coach;
      toggleSuggestions.value = newAccount.intelligence_assistant;
    }
  },
  { immediate: true } // run right away in case account is already loaded
);

onMounted(() => {
    accountStore.getAccount();
})

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
    intelligence_assistant: toggleSuggestions.value
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