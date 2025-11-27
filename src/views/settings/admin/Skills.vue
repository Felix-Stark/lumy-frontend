<template>
    <BaseModal :isOpen="editModal" @close="handleClose">
        <h1 class="text-lumy-secondary text-2xl">Update: {{ selectedSkill?.skill }}</h1>
        <hr class="my-2 mb-2 border-gray-300 w-[80%]">
        <section class="flex flex-col gap-6">
            <div class="w-full space-y-4">
                <h2 class="text-600 text-lg">Skill name</h2>
                <input v-model="editName" type="text" class="p-2 w-full border border-gray-300 rounded outline-lumy-purple text-" :placeholder="selectedSkill?.skill" />
            </div>
            <div class="w-full space-y-2">
                <h2 class="text-600 text-lg">Definition</h2>
                <textarea v-model="editDef" type="text" rows="3" class="p-2 border w-full border-gray-300 rounded outline-lumy-purple" :placeholder="selectedSkill?.definition" />
            </div>
            <base-button
            btn-text="Save changes"
            :onAction="() => updateSkill()"
            bgColor="bg-lumy-green"
            />
        </section>
    </BaseModal>
    <BaseModal :isOpen="addModal" @close="handleClose">
        <div class="flex flex-col w-full">
            <h1 class="text-lumy-secondary text-2xl">Add a new skill</h1>
        <hr class="my-2 mb-2 border-gray-300 w-[80%]">
        <section class="flex flex-col items-center gap-6">
            <div class="w-full space-y-2">
                <h2 class="text-600 text-lg">Skill name</h2>
                <input v-model="editName" type="text" class="p-2 w-full border border-gray-300 rounded outline-lumy-purple text-" :placeholder="selectedSkill?.skill" />
            </div>
            <div class="w-full space-y-2">
                <h2 class="text-600 text-lg">Skill definition</h2>
                <p class="text-sm text-gray-600">Enter a brief and understandable description of the skill</p>
                <textarea v-model="editDef" type="text" rows="3" class="p-2 border w-full border-gray-300 rounded outline-lumy-purple" :placeholder="'Type description here'"></textarea>
            </div>
            <base-button
            btn-text="Save changes"
            :onAction="() => addSkill()"
            bgColor="bg-lumy-green"
            />
        </section>
        </div>
    </BaseModal>
    <base-modal :isOpen="deleteModal" @close="handleClose">
        <div class="flex flex-col w-full">
            <h1 class="text-lumy-secondary text-2xl">Deleting skill - {{ selectedSkill?.skill }}</h1>
            <p class="text-gray-600 mt-4">This action will remove the skill from your account. Are you sure you want to proceed?</p>
            <section class="flex gap-4 justify-end">
                <base-button
                btn-text="Cancel"
                :secondary="true"
                :onAction="handleDelete"
                />
                <base-button
                btn-text="Delete"
                bgColor="bg-lumy-danger"
                :onAction="deleteSkill"
                />
            </section>
        </div>
    </base-modal>
    <base-loader :isLoading="loading"/>
    <SettingsSkills v-if="initLoading" />
    <div v-else class="flex flex-col justify-between w-full bg-white p-8 rounded-xl shadow-md">
        <section class="flex flex-row-reverse mb-8">
            <BaseButton
            btn-text="Add new skill"
            :onAction="() => addModal = true"
            />
        </section>
        <section class="flex flex-col gap-6">
            <Disclosure v-slot="{ open }" v-for="s in skills">
                <div class="flex w-full justify-between border-b border-b-gray-300">
                    <div class="flex flex-col">
                        <DisclosureButton class="flex w-full items-center cursor-pointer justify-between p-2 hover:text-lumy-purple/40 ">
                            <span class="font-bold text-gray-600">{{ s.skill }}</span>
                            <ChevronDown class="w-5 h-5 text-gray-600" :class="open && 'rotate-180'" />
                        </DisclosureButton>
                        <DisclosurePanel class="text-gray-600 text-sm">
                            {{ s.definition }}
                        </DisclosurePanel>
                    </div>
                    <div class="flex items-center gap-6">
                        <Switch
                            v-model="s.is_active"
                            @update:model-value="val => toggleSkill(s.id, val)"
                            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer"
                            :class="s.is_active ? 'bg-lumy-green' : 'bg-lumy-danger-light'"
                        >
                            <span class="sr-only">Enable skill</span>
                            <span
                            class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                            :class="s.is_active ? 'translate-x-6' : 'translate-x-1'"
                            />
                        </Switch>
                        <Menu as="div" class="relative overflow-visible">
                            <MenuButton class="cursor-pointer">
                                <EllipsisVertical class="h-6" />
                            </MenuButton>
                            <MenuItems as="ul" class="w-36 p-2 bg-white border border-gray-300 rounded absolute bottom-0 right-0 z-50">
                                <MenuItem as="li" >
                                    <button @click="() => editSkill(s)" class="flex items-center gap-4 cursor-pointer">
                                        <Edit class="w-5 h-5 text-lumy-secondary" aria-hidden="true" />
                                        Edit
                                    </button>
                                </MenuItem>
                                <MenuItem as="li" >
                                    <button @click="deleteModal = true, selectedSkill = s" class="flex items-center gap-4 cursor-pointer">
                                        <Trash2 class="w-5 h-5 text-lumy-danger" aria-hidden="true" />
                                        Delete
                                    </button>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </Disclosure>
        </section>
    </div>
    <base-toast
    :text="toastText || 'Saved change!'"
    :show="showToast"
    @close="showToast = false"
    :duration="3000"
    :bgClass="toastBg"
    />
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseModal from '@/components/base/BaseModal.vue';
import BaseToast from '@/components/base/BaseToast.vue';
import BaseLoader from '@/components/base/BaseLoader.vue';
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
import { EllipsisVertical, ChevronDown, Edit, Delete, Trash2 } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';

const initLoading = ref(true);
const loading = ref(false);
const skills = ref<Skill[]>([])
const editModal = ref(false);
const addModal = ref(false);
const deleteModal = ref(false);
const selectedSkill = ref<Skill>();
const showToast = ref(false);
const toastText = ref('')
const toastBg = ref('')
const edits = ref<Partial<Skill>>();
const editName = ref('');
const editDef = ref('');

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

async function addSkill() {
    console.log('name and def in addSkill: ', editName.value + editDef.value)
    try {
        loading.value = true;
        if(editName.value) {
            const res = await api.post(`/skills`, {
                skill: editName.value,
                definition: editDef.value,
                theme: null
            });
            if(res.status === 200) {
                addModal.value = false;
                toastBg.value = 'bg-lumy-green';
                showToast.value = true;
            }
        }
    } catch (err: any) {
        console.error('Failed to create skill: ', err);
    } finally {
        loading.value = false;
    }
}

function handleClose() {
    addModal.value = false
    editModal.value = false;
    edits.value = {}
}


async function toggleSkill(skillId: number, newValue: boolean) {
    const idx = skills.value.findIndex(s => s.id === skillId)
    if(idx === -1) return;
    const prev = skills.value[idx].is_active;
    try{
        skills.value[idx].is_active = newValue;
        const res = await api.post(`/skills/${skillId}/toggle?enabled=${newValue}`);
        if (res.status !== 200) {
        // revert if backend didn't accept
        skills.value[idx].is_active = prev;
        toastBg.value = 'bg-lumy-danger';
        toastText.value = 'Failed to update skill';
        showToast.value = true;
        }
    } catch(err:any) {
        skills.value[idx].is_active = prev;
        console.error('Error toggling skill: ', err);
        toastBg.value = 'bg-lumy-danger';
        toastText.value = 'Something went wrong :(';
        showToast.value = true;
    } finally {
        toastBg.value = 'bg-lumy-green';
        toastText.value = 'Change saved!'
        loading.value = false;
        showToast.value = true;
    }
}
async function editSkill(s: Skill) {
    selectedSkill.value = s;
    editModal.value = true;
}

async function updateSkill() {
    try {
        loading.value = true;
        if(edits.value) {
            const res = await api.put(`/skills/${selectedSkill.value!.id}`, {
                skill: editName.value,
                definition: editDef.value,
                theme: null
            });
            if( res.status === 200 ) {
                let index = skills.value.findIndex(s => s.id === selectedSkill.value!.id)
                if (index !== -1) {
                    skills.value[index] = {
                        ...skills.value[index],
                        skill: edits.value.skill || selectedSkill.value!.skill,
                        definition: edits.value.skill || selectedSkill.value!.definition
                    }
                }
                toastBg.value = 'bg-lumy-green';
            }
        }

    } catch (err: any) {
        console.error('Failed to delete skill: ', err);
        toastBg.value = 'bg-lumy-danger';
        toastText.value = 'Something went wrong :('
        loading.value = false;
        showToast.value = true;
    } finally {
        handleClose();
        loading.value = false;
        showToast.value = true;
    }
}

function handleDelete() {
    deleteModal.value = false;
    selectedSkill.value = undefined
}

async function deleteSkill() {
    try {
        loading.value = true;
        const res = await api.delete(`/skills/${selectedSkill.value?.id}`);
        if(res.status === 200) {
            deleteModal.value = false
        }

    } catch (err: any) {
        console.error('Failed to delete skill: ', err);
        toastBg.value = 'bg-lumy-danger';
        toastText.value = 'Something went wrong :('
        loading.value = false;
        showToast.value = true;
    } finally {
        toastBg.value = 'bg-lumy-green';
        loading.value = false;
        showToast.value = true;
    }
}
</script>