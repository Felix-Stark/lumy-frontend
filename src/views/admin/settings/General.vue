<template>
    <div class="flex flex-col w-full min-h-[80vh] bg-white p-8 pl-12 rounded-xl shadow-md">
        <article class="flex flex-col gap-12">
            <h1 class="font-thin text-2xl text-gray-500">
                General settings
            </h1>
            <!-- <div class="flex flex-col w-full pl-8 border-l border-gray-300">
                <label for="account_name" class="font-thin">Account name</label>
                <input type="text" name="account_name"
                class="border border-gray-300 rounded  p-2 focus:outline-lumy-purple"
                :placeholder="account?.name"
                v-model="newAccountName" />
            </div> -->
            <div class="flex flex-col w-1/2 pl-8 border-l border-gray-300">
                <p class="font-thin py-2 text-sm">Feedback framework</p>
                <Listbox v-model="selectedFramework">
                    <div class="relative">
                        <ListboxButton class="w-full p-2 border rounded border-gray-300 flex cursor-pointer justify-between items-center text-gray-700 bg-white">
                        <span>
                            {{ frameworks?.find(fw => fw.id === selectedFramework)?.name || 'Select a framework' }}
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
            </div>
            <hr class="text-gray-300" />
            <h1 class="font-thin text-2xl text-gray-500">
                Bot settings
            </h1>
            <div class="flex flex-col w-1/2 pl-8 border-l border-gray-300">
                <p class="font-thin py-2 text-sm">Bot personality</p>
                <Listbox v-model="selectedBot">
                    <div class="relative">
                        <ListboxButton class="w-full p-2 border rounded border-gray-300 flex cursor-pointer justify-between items-center text-gray-700 bg-white">
                            <span>{{ botPersonalities?.find(bp => bp.id === selectedBot?.id)?.name || 'Select a bot personality' }}</span>
                            <ChevronDown class="ml-2 size-4"/>
                        </ListboxButton>
                        <ListboxOptions class="absolute mt-1 w-full overflow-auto bg-white border border-gray-300 rounded shadow-lg z-10">
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
            <BaseButton
            btnText="Save settings"
            :onAction="() => saveSettings()"
            />
        </article>

    </div>
</template>

<script setup lang="ts">
import type { BotPersonality, FeedbackFramework } from '@/types';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
import BaseButton from '@/components/base/BaseButton.vue';
import { ChevronDown } from 'lucide-vue-next';
import { useUserStore } from '@/stores/userStore';
import { onMounted, ref, computed } from 'vue';
import api from '@/services/api';
const userStore = useUserStore();
const newAccountName = ref('')
// const timezone = ref();
const selectedFramework = ref<number>();
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
    }
    const resFrameworks = await api.get('/frameworks');
    if (resFrameworks.status === 200) {
        frameworks.value = resFrameworks.data;
    }
})

async function saveSettings() {
    if (!selectedFramework.value) {
        selectedFramework.value = account.value?.framework?.id;
    }
    if(!selectedBot.value) {
        selectedBot.value = 4;
    }
    const res = await api.patch('/account', {
        framework: selectedFramework.value,
        bot_personality: selectedBot.value
    })
}

</script>