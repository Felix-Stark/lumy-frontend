<template>
    <div class="flex flex-col justify-between w-full bg-white p-8  rounded-xl shadow-md">
        <article class="flex flex-col gap-8">
            <h1 class="font-thin text-2xl text-gray-500">
                General settings
            </h1>
            <div class="flex flex-col w-full md:w-1/2 pl-8 pb-6 border-l border-gray-300">
                <p class="font-thin py-2 text-sm">Company name</p>
                <p v-if="editName === false" class="text-gray-700">{{ newName ? newName : account?.name }}<span><button @click="editName = true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg></button></span></p>
                <div v-else class="flex items-center gap-2">
                    <input v-model="newName" type="text" class="border border-gray-300 rounded p-2 w-full" placeholder="Enter new company name" />
                </div>
            </div>
            <div class="flex flex-col w-full md:w-1/2 pl-8 pb-6 border-l border-gray-300">
                <p class="font-thin py-2 text-sm">Feedback framework</p>
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
                            {{ frameworks?.find(fw => fw.id === selectedFramework)?.name }}
                        </span>
                        <ChevronDown class="ml-2 w-4 h-4" />
                        </ListboxButton>
                        
                        <ListboxOptions class="
                        w-full
                        max-h-48 overflow-auto bg-white border border-gray-300 rounded shadow-lg">
                            <ListboxOption
                                v-for="fw in frameworks"
                                :key="fw.id"
                                :value="fw.id"
                                class="cursor-pointer select-none px-4 py-2 hover:bg-purple-50"
                            >
                                <div>
                                <span class="font-medium">{{ fw.name }}</span>
                                <div class="text-xs text-gray-500 text-wrap">{{ fw.definition }}</div>
                                </div>
                            </ListboxOption>
                        </ListboxOptions>
                    </Float>
                </Listbox>
                </div>

            </div>
            <hr class="text-gray-300" />
            <h1 class="font-thin text-2xl text-gray-500">
                Bot settings
            </h1>
            <div class="flex flex-col w-full md:w-1/2 pl-8 pb-6 border-l border-gray-300">
                <p class="font-thin py-2 text-sm">Bot personality</p>
                <div class="relative">
                <Listbox v-model="selectedBot">
                    <Float
                            placement="bottom"
                            :flip="true"
                            :offset="4"
                            :portal="true"
                        >
                        <ListboxButton class="w-full p-2 border rounded border-gray-300 flex cursor-pointer justify-between items-center text-gray-700 bg-white">
                            <span>{{ botPersonalities?.find(bp => bp.id === selectedBot)?.name }}</span>
                            <ChevronDown class="ml-2 size-4"/>
                        </ListboxButton>
                        
                            <ListboxOptions class="
                            w-full
                            max-h-48
                            overflow-auto bg-white border border-gray-300 rounded shadow-lg z-10">
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
                        </Float>
                </Listbox>
                </div>
            </div>

        </article>

        <BaseButton
        btnText="Save settings"
        :onAction="() => saveSettings()"
        />
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
import type { Account, BotPersonality, FeedbackFramework } from '@/types';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
import { Float } from '@headlessui-float/vue';
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
const editName = ref(false);
const newName = ref('');
const selectedFramework = ref();
const frameworks = ref<FeedbackFramework[]>([])
const selectedBot = ref();
const botPersonalities = ref<BotPersonality[]>([]);
const account = ref<Account>()
onMounted(async () => {
    try {
        account.value = await userStore.getAccount();
        const res = await api.get('/bot-personalities');
        if( res.status === 200) {
            botPersonalities.value = res.data;
            selectedBot.value = account.value?.bot_personality_id;
        }
        const resFrameworks = await api.get('/frameworks');
        if (resFrameworks.status === 200) {
            frameworks.value = resFrameworks.data;
            selectedFramework.value = account.value?.framework_id;
        }
    } catch (error: any) {
        console.error('Error fetching data: ', error);
        toastText.value = error?.response?.data?.detail || 'Could not load settings';
        toastBg.value = 'bg-red-500';
        showToast.value = true;
    }
    
})

async function saveSettings() {
    console.log('selected framework: ', selectedFramework.value)
    console.log('selected bot: ', selectedBot.value)
    console.log('new name: ', newName.value)
    try {
        const res = await api.patch('/account', {
            framework: selectedFramework.value.id,
            bot_personality: selectedBot.value.id,
            name: newName.value || account.value?.name
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
    } finally {
        account.value = await userStore.getAccount(); // Refresh account data
    }
}

</script>