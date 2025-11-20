<template>
    <BaseLoader :isLoading="loading" />
    <SettingsGeneral v-if="initLoading" />
    <div v-else class="flex flex-col justify-between w-full bg-white p-8 rounded-xl shadow-md">
        <article class="flex flex-col gap-8 md:w-1/2 relative">
            <h1 class="font-thin text-2xl text-gray-500">
                Bot personality
            </h1>

        </article>

    </div>
</template>

<script setup lang="ts">
import BaseModal from '@/components/base/BaseModal.vue';
import BaseLoader from '@/components/base/BaseLoader.vue';
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

const initLoading = ref(true);
const loading = ref(false);

</script>