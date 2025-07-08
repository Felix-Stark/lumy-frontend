<template>
    <div class="flex flex-col justify-between w-full bg-white p-8  rounded-xl shadow-md">
        <article class="flex flex-col gap-8">
            <h1 class="font-thin text-2xl text-gray-500">
                General settings
            </h1>
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
                            {{ frameworks?.find(fw => fw.id === selectedFramework)?.name || frameworks?.find(fw => fw.id === account?.framework_id) }}
                        </span>
                        <ChevronDown class="ml-2 w-4 h-4" />
                        </ListboxButton>
                        
                        <ListboxOptions class="
                        max-w-96
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
                            <span>{{ botPersonalities?.find(bp => bp.id === selectedBot)?.name || botPersonalities?.find(bp => bp.id === account?.bot_personality_id) }}</span>
                            <ChevronDown class="ml-2 size-4"/>
                        </ListboxButton>
                        
                            <ListboxOptions class="
                            max-w-96
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
import type { BotPersonality, FeedbackFramework } from '@/types';
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
const selectedFramework = ref();
const frameworks = ref<FeedbackFramework[]>([])
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