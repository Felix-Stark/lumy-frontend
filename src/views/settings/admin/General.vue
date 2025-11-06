<template>
    <SettingsGeneral v-if="loading" />
    <div v-else class="flex flex-col justify-between w-full bg-white p-8 rounded-xl shadow-md">
        <article class="flex flex-col gap-8 md:w-1/2 relative">
            <h1 class="font-thin text-2xl text-gray-500">
                General settings
            </h1>
            <div class="flex flex-col w-full pl-8 pb-6 border-l border-gray-300">
                <p class="font-thin py-2 text-sm">Company name</p>
                <input v-model="companyName" name="company-name" class=" text-gray-700 p-2 border border-gray-300 rounded outline-lumy-purple" />
            </div>
            <div class="flex flex-col w-full pl-8 pb-6 border-l border-gray-300">
                <p class="font-thin py-2 text-sm">Feedback framework</p>
                <Listbox v-model="selectedFramework">
                    <Float
                            placement="bottom-start"
                            :flip="true"
                            :offset="4"
                        >
                        <ListboxButton class="w-full p-2 border rounded border-gray-300 flex cursor-pointer justify-between items-center text-gray-700 bg-white">
                            <span>
                                {{ frameworks?.find(fw => fw.id === selectedFramework)?.name }}
                            </span>
                            <ChevronDown aria-hidden="true" class="ml-2 w-4 h-4" />
                        </ListboxButton>
                        
                        <ListboxOptions class="w-full max-h-48 xl:max-h-100 overflow-auto bg-white border border-gray-300 rounded shadow-lg">
                            <ListboxOption
                                v-for="fw in frameworks"
                                :key="fw.id"
                                :value="fw.id"
                                class="cursor-pointer text-wrap hover:bg-purple-50"
                                v-slot="{ selected }"
                            >
                                <div class="px-4 py-2">
                                    <span class="font-medium flex">{{ fw.name }} <CheckIcon v-show="selected" /></span>
                                    <div class="text-xs text-gray-500 text-wrap">{{ fw.definition }}</div>
                                </div>
                            </ListboxOption>
                        </ListboxOptions>
                    </Float>
                </Listbox>

            </div>
            <div class="flex flex-col w-full pl-8 pb-6 border-l border-gray-300">
                <p class="font-thin py-2 text-sm">Timezone</p>
                <Listbox v-model="selectedTimezone">
                    <Float placement="bottom-start" :flip="true" :offset="4">
                    <ListboxButton
                        class="w-full p-2 border rounded border-gray-300 flex cursor-pointer justify-between items-center text-gray-700 bg-white"
                    >
                        <span>{{ selectedTimezone || 'Select timezone' }}</span>
                        <ChevronDown aria-hidden="true" class="ml-2 size-4" />
                    </ListboxButton>

                    <ListboxOptions
                        class="w-full max-h-48 xl:max-h-100 overflow-auto bg-white border border-gray-300 rounded shadow-lg z-10"
                    >
                        <ListboxOption
                        v-for="tz in timezoneOptions"
                        :key="tz.value"
                        :value="tz.value"
                        class="cursor-pointer"
                        v-slot="{ active, selected }"
                        >
                        <li
                            :class="[
                            'flex items-center px-4 py-2',
                            { 'bg-purple-50': active }
                            ]"
                        >
                            <span class="flex-1">{{ tz.label }}</span>
                            <CheckIcon v-show="selected" class="text-lumy-purple" />
                        </li>
                        </ListboxOption>
                    </ListboxOptions>
                    </Float>
                </Listbox>
            </div>
            <hr class="text-gray-300" />
            <h1 class="font-thin text-2xl text-gray-500">
                Bot settings
            </h1>
            <div class="flex flex-col w-full pl-8 pb-6 border-l border-gray-300">
                <p class="font-thin py-2 text-sm">Bot personality</p>
                <Listbox v-model="selectedBot">
                    <Float
                            placement="bottom-start"
                            :flip="true"
                            :offset="4"
                        >
                        <ListboxButton class="w-full p-2 border rounded border-gray-300 flex cursor-pointer justify-between items-center text-gray-700 bg-white">
                            <span>{{ botPersonalities?.find(bp => bp.id === selectedBot)?.name }}</span>
                            <ChevronDown aria-hidden="true" class="ml-2 size-4"/>
                        </ListboxButton>
                        
                        <ListboxOptions class="w-full max-h-48 xl:max-h-100 overflow-auto bg-white border border-gray-300 rounded shadow-lg z-10">
                            <ListboxOption
                            v-for="bp in botPersonalities"
                            :key="bp.id"
                            :value="bp.id"
                            class="cursor-pointer text-wrap "
                            v-slot="{ active, selected }"
                            >
                                <li :class="['flex items-center', { 'bg-purple-50': active }]">
                                    <div class="px-4 py-2">
                                        <span class="font-medium flex gap-2">
                                            {{ bp.name }} <CheckIcon class="text-lumy-purple" v-show="selected" />
                                        </span>
                                        <div class="text-xs text-gray-500">
                                            {{ bp.description }}
                                        </div>
                                    </div>
                                </li>
                            </ListboxOption>
                        </ListboxOptions>
                    </Float>
                </Listbox>
                <a @click="() => showBotModal = true " class="underline text-sm text-lumy-purple active:opacity-50 cursor-pointer">Add custom personality</a>
            </div>
        </article>
        <section class="flex justify-end">
            <BaseButton
            btnText="Save settings"
            :onAction="() => saveSettings()"
            />
        </section>
        <BaseToast
        :show="showToast"
        @close="showToast = false"
        :duration="3000"
        :text="toastText"
        :bg-class="toastBg"
        />
        <BaseModal
        :isOpen="showBotModal"
        @close="showBotModal = false"
        >
            <div class="w-full flex flex-col p-6 space-y-8">
                <div class="w-full">
                    <h1 class="text-3xl text-gray-600">
                        Add a custom bot personality
                    </h1>
                    <hr class="text-gray-200 w-full mx-8">
                </div>
                <section class="bg-gray-200 rounded p-4">
                    <h3 class="font-bold text-gray-600 mb-2">
                        Instructions
                    </h3>
                    <p class="text-gray-500 text-sm">
                        This is where you create your company's unique feedback bot personality. Please note: <span class="italic">Lumy has no control of your bot's behavior, tone, or style beyond what you define here.</span>
                    </p>
                    <br/>
                    <p class="text-gray-500 text-sm">
                        Define a unique personality for your feedback bot by providing a name, description, and example phrases. The description should outline the bot's tone and approach, while the example phrases will guide how the bot interacts with users. Once saved, this custom personality will be used to tailor the feedback experience.
                    </p>
                </section>
                <div class="w-full my-4 flex flex-col gap-1">
                    <label for="bot-name" class="font-bold text-gray-600">
                        Bot name
                    </label>
                    <input v-model="botName" name="bot-name" type="text" class="p-2 rounded border text-gray-600 border-gray-300 w-full outline-lumy-purple" />
                    <p class="text-gray-400 text-sm">Example: Coach Clara</p>
                </div>
                <div class="w-full flex flex-col gap-1">
                    <label for="bot-description" class="font-bold text-gray-600">
                        Description
                    </label>
                    <textarea v-model="botDesc" name="bot-description" rows="3" autocorrect="on" class="p-2 rounded border text-gray-600 border-gray-300 w-full my-2 outline-lumy-purple"></textarea>
                    <p class="text-gray-400 text-sm">Example: Empathetic, focused, and great at guiding reflection and growth. Clara speaks with a calm and thoughtful tone, asking reflective questions to help you gain perspective.</p>
                </div>
                <div class="w-full flex flex-col gap-1">
                    <label for="bot-origin" class="font-bold text-gray-600">
                        Origin
                    </label>
                    <textarea v-model="botOrigin" name="bot-origin" rows="1" autocorrect="on" class="p-2 text-gray-600 rounded border border-gray-300 w-full my-2 outline-lumy-purple"></textarea>
                    <p class="text-gray-400 text-sm">Example: Lumy core coaching persona.</p>
                </div>
                <div class="w-full flex flex-col gap-1">
                    <label for="bot-tone" class="font-bold text-gray-600">Tone</label>
                    <textarea v-model="botTone" name="bot-tone" rows="1" autocorrect="on" class="p-2 text-gray-600 rounded border border-gray-300 w-full my-2 outline-lumy-purple"></textarea>
                    <p class="text-gray-400 text-sm">Example: Calm, thoughtful, empathetic</p>
                </div>
                <div class="w-full flex flex-col gap-1">
                    <h3 class="font-bold text-gray-600">
                        Traits
                    </h3>
                    <BaseTagInput v-model="botTraits"
                    label="Add bot traits"
                    hint="Press Enter to add each trait."
                    placeholder="Add a trait and press Enter"
                    />
                    <p class="text-gray-400 text-sm">
                        Example: "Empathetic",
                        "Reflective questions",
                        "Guides growth",
                        "Calm presence"
                    </p>
                </div>
                <div class="w-full flex flex-col gap-1">
                    <h3 class="font-bold text-gray-600">
                        Quirks
                    </h3>
                    <BaseTagInput v-model="botQuirks"
                    label="Add bot quirks"
                    hint="Press Enter to add each quirk."
                    placeholder="Add a quirk and press Enter"
                    />
                    <p class="text-gray-400 text-sm">
                        Example: "Asks open questions",
                        "Encourages journaling",
                        "Pauses for reflection"
                    </p>
                </div>
                <div class="w-full flex flex-col gap-1">
                    <h3 class="font-bold text-gray-600">
                        Catchphrase
                    </h3>
                    <textarea v-model="botCatchphrase" rows="1" autocorrect="on" class="p-2 text-gray-600 rounded border border-gray-300 w-full my-2 outline-lumy-purple"></textarea>
                    <p class="text-gray-400 text-sm">Example: "Small steps, big momentum."</p>
                </div>
                <div class="w-full flex flex-col gap-1">
                    <h3 class="font-bold text-gray-600">
                        Example phrases
                    </h3>
                    <BaseTagInput v-model="botExamples"
                    label="Add example phrases"
                    hint="Press Enter to add each phrase."
                    placeholder="Add an example phrase and press Enter"
                    />
                    <p class="text-gray-400 text-sm">Example: "What's one thing you have learned this week that surprised you?", "If you zoom out, what progress do you notice?",
                    "What's a small action you can take today to feel better?"</p>
                </div>
                <div class="flex justify-end">
                    <button @click="saveBot" class="rounded px-4 py-2 text-white bg-lumy-green cursor-pointer">Save</button>
                </div>
            </div>
        </BaseModal>
    </div>
</template>

<script setup lang="ts">
import BaseModal from '@/components/base/BaseModal.vue';
import BaseTagInput from '@/components/base/BaseTagInput.vue';
import SettingsGeneral from '@/components/skeletons/SettingsGeneral.vue';
import type { Account, BotPersonality, FeedbackFramework } from '@/types';
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue';
import { Float } from '@headlessui-float/vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseToast from '@/components/base/BaseToast.vue';
import { CheckIcon, ChevronDown } from 'lucide-vue-next';
import { useAccountStore } from '@/stores/accountStore';
import { onMounted, ref, computed } from 'vue';
import api from '@/services/api';
import { buildTimezoneOptions } from '@/utils/timezones';

const accountStore = useAccountStore();
const showToast = ref(false)
const toastText = ref('Settings saved!')
const toastBg = ref('bg-green-500')
const companyName = ref('');
const selectedFramework = ref();
const frameworks = ref<FeedbackFramework[]>([])
const selectedBot = ref();
const botPersonalities = ref<BotPersonality[]>([]);
const loading = ref(true);
const showBotModal = ref(false);

const botName = ref('');
const botDesc = ref('');
const botOrigin = ref('');
const botTone = ref('');
const botTraits = ref<string[]>([]);
const botQuirks = ref<string[]>([]);
const botCatchphrase = ref('');
const botExamples = ref<string[]>([]);

interface TZOption {
  label: string;
  value: string;
  zones: string[];
}

const timezoneOptions = ref<TZOption[]>([]);
const selectedTimezone = ref<string>();

onMounted(async () => {
    try {
        await accountStore.getAccount();
        companyName.value = accountStore.account?.name || '';

        timezoneOptions.value = buildTimezoneOptions();
        selectedTimezone.value = accountStore.account?.timezone || 'Select timezone';
        const res = await api.get('/bot-personalities');
        if( res.status === 200) {
            botPersonalities.value = res.data;
            selectedBot.value = accountStore.account?.bot_personality_id;
        }
        const resFrameworks = await api.get('/frameworks');
        if (resFrameworks.status === 200) {
            frameworks.value = resFrameworks.data;
            selectedFramework.value = accountStore.account?.framework_id;
        }
    } catch (error: any) {
        console.error('Error fetching data: ', error);
        toastText.value = error?.response?.data?.detail || 'Could not load settings';
        toastBg.value = 'bg-red-500';
        showToast.value = true;
    } finally {
        loading.value = false;
    }
})

async function saveSettings() {
    try {
       const updated = await accountStore.updateAccount({
            name: companyName.value,
            framework_id: selectedFramework.value,
            bot_personality_id: selectedBot.value,
            timezone: selectedTimezone.value
        });
        if(updated) {
            toastText.value = 'Settings saved!';
            toastBg.value = 'bg-lumy-green';
            showToast.value = true;
        }
    } catch (error: any) {
        console.log('failed to save settings: ', error)
        toastText.value = error?.response?.data?.detail || 'Could not save settings'
        toastBg.value = 'bg-red-500'
        showToast.value = true
    }
};

async function saveBot() {
    console.log('Bot personality saved: ', {
        name: botName.value,
        formatted_name: botName.value.toLowerCase().replace(/\s+/g, '_'),
        description: botDesc.value,
        origin: botOrigin.value,
        tone: botTone.value,
        traits: botTraits.value,
        quirks: botQuirks.value,
        catchphrase: botCatchphrase.value,
        examples: botExamples.value
    });
    try {
        const res = await api.post('/bot-personalities', {
            name: botName.value,
            formatted_name: botName.value.toLowerCase().replace(/\s+/g, '_'),
            description: botDesc.value,
            origin: botOrigin.value,
            tone: botTone.value,
            traits: botTraits.value,
            quirks: botQuirks.value,
            catchphrase: botCatchphrase.value,
            example_phrases: botExamples.value
        });
        if(res.status === 201) {
            toastText.value = 'Custom bot personality added!';
            toastBg.value = 'bg-lumy-green';
            showToast.value = true;
            selectedBot.value = res.data.id;
            showBotModal.value = false;
            // Reset form
            botName.value = '';
            botDesc.value = '';
            botOrigin.value = '';
            botTone.value = '';
            botTraits.value = [];
            botQuirks.value = [];
            botCatchphrase.value = '';
            botExamples.value = [];
        }
    } catch (error: any) {
        console.error('Error saving custom bot personality: ', error);
        toastText.value = error?.response?.data?.detail || 'Could not save custom bot personality';
        toastBg.value = 'bg-red-500';
        showToast.value = true;
    } finally {
        const res = await api.get('/bot-personalities');
        if( res.status === 200) {
            botPersonalities.value = res.data;
        }
    }
}

</script>