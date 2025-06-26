<template>
    <div class="flex flex-col gap-12 w-full min-h-[60vh] bg-white p-8  rounded-xl shadow-md">
        <article class="flex flex-col gap-8">
            <!-- <form class="w-full">
                <h1 class="font-thin text-2xl text-gray-500">
                    General settings
                </h1>
                <div class="flex flex-col w-1/2 pl-8 border-l border-gray-300">
                    <label class="font-thin text-sm" for="fw">Feedback Frameworks</label>
                    <select class="border rounded border-gray-400 focus:outline-lumy-purple" name="framework" id="fw" v-model="selectedFramework">
                        <option v-for="fw in frameworks" :value="fw.id">{{ fw.name }}</option>
                    </select>
                </div>
                <h1 class="font-thin text-2xl text-gray-500">
                    Bot settings
                </h1>
                <div class="flex flex-col w-1/2 pl-8 border-l border-gray-300">
                    <label for="bp">Bot personality</label>
                    <select name="bot-personality" id="bp" v-model="selectedBot">
                        <option v-for="bp in botPersonalities" :value="bp.id">{{ bp.name }}</option>
                    </select>
                </div>
            </form> -->
            <!-- currently unavalible -->
            <!-- <div class="flex flex-col w-1/2 pl-8 border-l border-gray-300">
                <label for="account_name" class="font-thin">Account name</label>
                <input type="text" name="account_name"
                class="border border-gray-300 rounded  p-2 focus:outline-lumy-purple"
                :placeholder="account?.name"
                v-model="newAccountName" />
            </div> -->
            <h1 class="font-thin text-2xl text-gray-500">
                General settings
            </h1>
            <div class="flex flex-col w-1/2 pl-8 pb-6 border-l border-gray-300">
                <p class="font-thin py-2 text-sm">Feedback framework</p>
                <Listbox v-model="selectedFramework">
                    <div class="relative">
                        <ListboxButton class="w-full p-2 border rounded border-gray-300 flex cursor-pointer justify-between items-center text-gray-700 bg-white">
                        <span>
                            {{ frameworks?.find(fw => fw.id === selectedFramework)?.name || 'Select a framework' }}
                        </span>
                        <ChevronDown class="ml-2 w-4 h-4" />
                        </ListboxButton>
                        <ListboxOptions class="absolute mt-1 w-full max-h-48 overflow-auto bg-white border border-gray-300 rounded shadow-lg z-10 right-0 left-0">
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
            </div>
            <hr class="text-gray-300" />
            <h1 class="font-thin text-2xl text-gray-500">
                Bot settings
            </h1>
            <div class="flex flex-col w-1/2 pl-8 pb-6 border-l border-gray-300">
                <p class="font-thin py-2 text-sm">Bot personality</p>
                <Listbox v-model="selectedBot">
                    <div class="relative">
                        <ListboxButton class="w-full p-2 border rounded border-gray-300 flex cursor-pointer justify-between items-center text-gray-700 bg-white">
                            <span>{{ botPersonalities?.find(bp => bp.id === selectedBot?.id)?.name || 'Select a bot personality' }}</span>
                            <ChevronDown class="ml-2 size-4"/>
                        </ListboxButton>
                        <ListboxOptions class="absolute mt-1 w-full overflow-auto bg-white border border-gray-300 rounded shadow-lg max-h-48 left-0 right-0 z-10">
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

        </article>

        <BaseButton
        btnText="Save settings"
        :onAction="() => saveSettings()"
        />
        <BaseToast
        :show="showToast"
        :text="toastText"
        :bg-class="toastBg"
        />
    </div>
</template>

<script setup lang="ts">
import type { BotPersonality, FeedbackFramework } from '@/types';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseToast from '@/components/base/BaseToast.vue';
import { ChevronDown } from 'lucide-vue-next';
import { useUserStore } from '@/stores/userStore';
import { onMounted, ref, computed } from 'vue';
import api from '@/services/api';
const userStore = useUserStore();
const showToast = ref(false)
const toastText = ref('Settings saved!')
const toastBg = ref('bg-green-500')
const newAccountName = ref('')
// const timezone = ref();
const selectedFramework = ref();
const frameworks = ref<FeedbackFramework[]>([])
// const botLanguage = ref();
const selectedBot = ref();
const botPersonalities = ref<BotPersonality[]>([]);
const account = computed(() => userStore.account);
onMounted(async () => {
    if(userStore.account === null) {
        userStore.getAccount();
    }
    const res = await api.get('/bot-personalities');
    if( res.status === 200) {
        botPersonalities.value = res.data;
        console.log('bot res: ', res)
    }
    const resFrameworks = await api.get('/frameworks');
    if (resFrameworks.status === 200) {
        frameworks.value = resFrameworks.data;
        console.log('fw res: ', resFrameworks)
    }
    const currentFramework = frameworks.value.find(fw => fw.id === account.value?.framework_id);
    const currentBot = botPersonalities.value.find(bp => bp.id === account.value?.bot_personality_id)
})

async function saveSettings() {
    if (!selectedFramework.value) {
        selectedFramework.value = account.value?.framework_id;
    }
    if(!selectedBot.value) {
        selectedBot.value = account.value?.bot_personality_id;
    }
    console.log('selected framework: ', selectedFramework.value)
    console.log('selected bot: ', selectedBot.value)
    try {
        const res = await api.patch('/account', {
            framework: selectedFramework.value.id,
            bot_personality: selectedBot.value.id
        })
        console.log('saveSettings res: ', res)
        if (res.status === 200) {
            toastText.value = 'Settings saved!'
            toastBg.value = 'bg-green-500'
            showToast.value = true
        }
    } catch (error: any) {
        console.log('failed to save settings: ', error)
        toastText.value = error?.response?.data?.detail || 'Could not save settings'
        toastBg.value = 'bg-red-500'
        showToast.value = true
    }
}

</script>