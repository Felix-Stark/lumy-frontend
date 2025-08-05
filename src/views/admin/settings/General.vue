<template>
    <div class="flex flex-col justify-between w-full bg-white p-8  rounded-xl shadow-md">
        <article class="flex flex-col gap-8">
            <h1 class="font-thin text-2xl text-gray-500">
                General settings
            </h1>
            <div class="flex flex-col w-full md:w-1/2 pl-8 pb-6 border-l border-gray-300">
                <p class="font-thin py-2 text-sm">Company name</p>
                <input v-model="companyName" name="company-name" class="text-lg border border-gray-300 rounded outline-lumy-purple" />
            </div>
            <div class="flex flex-col w-full md:w-1/2 pl-8 pb-6 border-l border-gray-300">
                <p class="font-thin py-2 text-sm">Feedback framework</p>
                <Listbox v-model="selectedFramework">
                    <Float
                            as="div"
                            class="relative"
                            placement="bottom"
                            :flip="true"
                            :offset="4"
                            :portal="true"
                            floating-as="template"

                        >
                        <ListboxButton class="w-full p-2 border rounded border-gray-300 flex cursor-pointer justify-between items-center text-gray-700 bg-white">
                            <span>
                                {{ frameworks?.find(fw => fw.id === selectedFramework)?.name }}
                            </span>
                            <ChevronDown class="ml-2 w-4 h-4" />
                        </ListboxButton>
                        
                        <ListboxOptions class="
                        absolute
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
            <hr class="text-gray-300" />
            <h1 class="font-thin text-2xl text-gray-500">
                Bot settings
            </h1>
            <div class="flex flex-col w-full md:w-1/2 pl-8 pb-6 border-l border-gray-300">
                <p class="font-thin py-2 text-sm">Bot personality</p>
                <Listbox v-model="selectedBot">
                    <Float
                            as="div"
                            class="relative"
                            placement="bottom"
                            :flip="true"
                            :offset="4"
                            :portal="true"
                            floating-as="template"
                        >
                        <ListboxButton class="w-full p-2 border rounded border-gray-300 flex cursor-pointer justify-between items-center text-gray-700 bg-white">
                            <span>{{ botPersonalities?.find(bp => bp.id === selectedBot)?.name }}</span>
                            <ChevronDown class="ml-2 size-4"/>
                        </ListboxButton>
                        
                        <ListboxOptions class="
                        absolute
                        w-full
                        max-h-48
                        overflow-auto bg-white border border-gray-300 rounded shadow-lg z-10">
                            <ListboxOption
                            v-for="bp in botPersonalities"
                            :key="bp.id"
                            :value="bp.id"
                            class="cursor-pointer text-wrap px-4 py-2 hover:bg-purple-100"
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
const companyName = ref('');
const selectedFramework = ref();
const frameworks = ref<FeedbackFramework[]>([])
const selectedBot = ref();
const botPersonalities = ref<BotPersonality[]>([]);
const account = ref<Account>()
onMounted(async () => {
    try {
        account.value = await userStore.getAccount();
        companyName.value = account.value?.name || '';
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
    console.log('new name: ', companyName.value)
    try {
        const res = await api.patch('/account', {
            framework: selectedFramework.value.id,
            bot_personality: selectedBot.value.id,
            name: companyName.value ? companyName.value : account.value?.name
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