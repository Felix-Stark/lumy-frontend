<template>
    <BaseModal :isOpen="showModal" @close="handleClose">
        <h1 class="text-lumy-secondary text-2xl"></h1>

    </BaseModal>
    <SettingsSkills v-if="initLoading" />
    <div v-else class="flex flex-col justify-between w-full bg-white p-8 rounded-xl shadow-md">
        <section class="flex flex-row-reverse">
            <BaseButton
            :onAction="() => addSkill()"
            />
        </section>
        <section class="flex flex-col gap-6">
            <Disclosure v-slot="{ open }" v-for="s in skills">
                <div class="flex w-full justify-between border-b border-b-gray-300">
                    <DisclosureButton class="flex w-full cursor-pointer justify-between p-2 hover:text-lumy-purple/40 ">
                        <span class="font-bold text-gray-600">{{ s.skill }}</span>
                        <ChevronDown class="w-5 h-5 text-gray-600" :class="open && 'rotate-180'" />
                    </DisclosureButton>
                    <div class="flex gap-6">
                        <Switch
                            v-model="active"
                            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer"
                            :class="active ? 'bg-lumy-green' : 'bg-lumy-danger-light'"
                        >
                            <span class="sr-only">Enable skill</span>
                            <span
                            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                            :class="active ? 'translate-x-6' : 'translate-x-1'"
                            />
                        </Switch>
                        <Menu as="div" class="relative inline-block text-left">
                            <MenuButton>
                                <EllipsisVertical class="h-6" />
                            </MenuButton>
                            <MenuItems class="w-36 bg-white aboslute bottom-0">
                                <MenuItem class="flex items-center gap-4">
                                    <button @click="() => editSkill(s)" class="cursor-pointer">
                                        <Edit class="w-5 h-5 text-lumy-secondary" aria-hidden="true" />
                                    </button>
                                    Edit
                                </MenuItem>
                                <MenuItem class="flex items-center gap-4">
                                    <button @click="() => editSkill(s)" class="cursor-pointer">
                                        <Delete class="w-5 h-5 text-lumy-secondary" aria-hidden="true" />
                                    </button>
                                    Delete
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                    <DisclosurePanel class="text-gray-600 text-sm">
                        {{ s.definition }}
                    </DisclosurePanel>
                </div>
            </Disclosure>
        </section>
    </div>
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import SettingsSkills from '@/components/skeletons/SettingsSkills.vue';
import api from '@/services/api';
import type { Skill } from '@/types';
import {
Disclosure,
DisclosureButton,
DisclosurePanel,
Menu,
MenuButton,
MenuItems,
MenuItem,
Switch
} from '@headlessui/vue';
import { EllipsisVertical, ChevronDown, Edit, Delete } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';

const initLoading = ref(true);
const loading = ref(false);
const skills = ref<Skill[]>([])
const showModal = ref(false);
const active = ref(true)
const selectedSkill = ref<Skill>();

onMounted(async() => {
    try {
        const res = await api.get('/skills');
        if(res.status === 200) {
            skills.value = res.data
        }
    } catch (err: any) {
        console.error('Error fetching skills in settings: ', err);
    } finally {
        initLoading.value = false;
    }
})

function addSkill() {
}

function handleClose() {
    showModal.value = false;
}


async function toggleSkill(skillId: number) {
    try{
        const res = await api.post(`/skills${skillId}/toggle`)
        
    } catch(err:any) {
        console.error('Error toggle skill: ', err);
    }
}
async function editSkill(s: Skill) {
    selectedSkill.value = s;
    showModal.value = true;
}

async function updateSkill(s: Skill) {

}
</script>