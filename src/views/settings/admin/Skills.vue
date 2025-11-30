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
                <textarea v-model="editDef" type="text" rows="3" class="p-2 border w-full border-gray-300 rounded outline-lumy-purple" ></textarea>
            </div>
            <section class="flex flex-row-reverse">
                <base-button
                btn-text="Save"
                :onAction="() => updateSkill()"
                bgColor="bg-lumy-green"
                />
            </section>
        </section>
    </BaseModal>
    <BaseModal :isOpen="addModal" @close="handleClose">
        <div class="flex flex-col w-full">
            <h1 class="text-lumy-secondary text-2xl">Add a new skill</h1>
        <hr class="my-2 mb-2 border-gray-300 w-[80%]">
        <section class="flex flex-col gap-6">
            <div class="w-full space-y-2">
                <h2 class="text-600 text-lg">Skill name</h2>
                <input v-model="editName" type="text" class="p-2 w-full border border-gray-300 rounded outline-lumy-purple text-" placeholder="Enter skill name" />
            </div>
            <div class="w-full space-y-2">
                <h2 class="text-600 text-lg">Skill definition</h2>
                <p class="text-sm text-gray-600">Enter a brief and understandable description of the skill</p>
                <textarea v-model="editDef" type="text" rows="3" class="p-2 border w-full border-gray-300 rounded outline-lumy-purple" :placeholder="'Enter description here'"></textarea>
            </div>
            <section class="flex flex-row-reverse">
                <base-button
                btn-text="Save"
                :onAction="() => addSkill()"
                bgColor="bg-lumy-green"
                />
            </section>
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
                :onAction="cancelDelete"
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
        <section class="flex flex-col gap-3">
            <h2 v-if="customSkills" class="text-lg text-gray-600 mb-4">Custom skills</h2>
            <Disclosure v-if="customSkills" v-slot="{ open }" v-for="s in customSkills">
                <div class="flex w-full justify-between items-start border-b border-b-gray-300">
                    <div class="flex w-full flex-col">
                        <DisclosureButton class="flex w-full items-center cursor-pointer justify-between p-2 hover:text-lumy-purple/40 ">
                            <span class=" text-gray-600">{{ s.skill }}</span>
                            <ChevronDown class="w-5 h-5 text-gray-600" :class="open && 'rotate-180'" />
                        </DisclosureButton>
                        <DisclosurePanel class="text-gray-600 pl-6 py-2 text-sm">
                            {{ s.definition }}
                        </DisclosurePanel>
                    </div>
                    <div class="flex items-start p-2 gap-6">
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
                        <Menu as="section" class="relative overflow-visible">
                            <MenuButton class="cursor-pointer">
                                <EllipsisVertical class="h-6" />
                            </MenuButton>
                            <MenuItems as="ul" class="w-36 p-2 bg-white border border-gray-300 rounded absolute bottom-0 right-0 z-50 space-y-2">
                                <MenuItem as="li" >
                                    <button @click="() => editSkill(s)" class="flex items-center w-full gap-6 cursor-pointer">
                                        <Edit class="w-5 h-5 text-lumy-secondary" aria-hidden="true" />
                                        Edit
                                    </button>
                                </MenuItem>
                                <MenuItem as="li" >
                                    <button @click="() => verifyDelete(s)" class="flex items-center gap-6 w-full cursor-pointer">
                                        <Trash2 class="w-5 h-5 text-lumy-danger" aria-hidden="true" />
                                        Delete
                                    </button>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </Disclosure>
            <h2 class="text-lg text-gray-600 mt-8 mb-4">Default skills</h2>
            <Disclosure v-slot="{ open }" v-for="s in defaultSkills">
                <div class="flex w-full justify-between items-start border-b border-b-gray-300">
                    <div class="flex w-full flex-col">
                        <DisclosureButton class="flex w-full items-center cursor-pointer justify-between p-2 hover:text-lumy-purple/40 ">
                            <span class=" text-gray-600">{{ s.skill }}</span>
                            <ChevronDown class="w-5 h-5 text-gray-600" :class="open && 'rotate-180'" />
                        </DisclosureButton>
                        <DisclosurePanel class="text-gray-600 text-sm">
                            {{ s.definition }}
                        </DisclosurePanel>
                    </div>
                    <div class="flex items-start p-2 gap-6">
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
import type { CustomSkill, Skill } from '@/types';
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
import { EllipsisVertical, ChevronDown, Edit,  Trash2 } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';

const initLoading = ref(true);
const loading = ref(false);
const skills = ref<Skill[]>([]);
const customSkills = ref<Skill[]>([]);
const defaultSkills = ref<Skill[]>([]);
const editModal = ref(false);
const addModal = ref(false);
const deleteModal = ref(false);
const selectedSkill = ref<Skill>();
const showToast = ref(false);
const toastText = ref('')
const toastBg = ref('')
const editName = ref('');
const editDef = ref('');

onMounted(async() => {
    try {
        const res = await api.get('/skills');
        if(res.status === 200) {
            skills.value = res.data;
            defaultSkills.value = skills.value.filter(s => !s.account_id)
            customSkills.value = skills.value.filter(s => s.account_id);
        }
    } catch (err: any) {
        console.error('Error fetching skills in settings: ', err);
    } finally {
        initLoading.value = false;
    }
})

async function addSkill() {
    console.log('name and def in addSkill: ', editName.value + editDef.value)
    let prev = customSkills.value;
    try {
        loading.value = true;
        if(editName.value && editDef.value) {
            const res = await api.post(`/skills`, {
                skill: editName.value,
                definition: editDef.value,
                theme: null
            });
            if(res.status === 200) {
                customSkills.value.push(res.data)
                toastBg.value = 'bg-lumy-green';
                toastText.value = 'Created custom skill!'
                editDef.value = '';
                editName.value = '';
                addModal.value = false;
            } else {
                toastBg.value = 'bg-lumy-danger';
                toastText.value = 'Failed to create skill';
            }
        } else {
            toastBg.value = 'bg-lumy-danger';
            toastText.value = 'Please fill in all fields';
        }
        
    } catch (err: any) {
            console.error('Failed to create skill:', err);
            toastBg.value = 'bg-lumy-danger';
            toastText.value = 'Something went wrong :(';
    } finally {
        loading.value = false;
        showToast.value = true;
    }
}

function handleClose() {
    addModal.value = false
    editModal.value = false;
    deleteModal.value = false;
    editName.value = '';
    editDef.value = '';
}


async function toggleSkill(skillId: number, newValue: boolean) {
    const idx = skills.value.findIndex(s => s.id === skillId)
    if(idx === -1) return;
    const prev = skills.value[idx].is_active;
    loading.value = true
    try{
        toastBg.value = 'bg-lumy-green';
        toastText.value = 'Change saved!'
        skills.value[idx].is_active = newValue;
        const res = await api.post(`/skills/${skillId}/toggle?enabled=${newValue}`);
        if (res.status !== 200) {
            // revert if backend didn't accept
            skills.value[idx].is_active = prev;
            toastBg.value = 'bg-lumy-danger';
            toastText.value = 'Failed to update skill';
        }
    } catch(err:any) {
        skills.value[idx].is_active = prev;
        console.error('Error toggling skill: ', err);
        toastBg.value = 'bg-lumy-danger';
        toastText.value = 'Something went wrong :(';
    } finally {
        selectedSkill.value = undefined;
        loading.value = false;
        showToast.value = true;
    }
}
async function editSkill(s: Skill) {
    selectedSkill.value = s;
    editModal.value = true;
    editName.value = s.skill;
    editDef.value = s.definition;
}

async function updateSkill() {
    try {
        loading.value = true;
        if(editName.value || editDef.value) {
            const res = await api.put(`/skills/${selectedSkill.value!.id}`, {
                skill: editName.value || selectedSkill.value!.skill,
                definition: editDef.value || selectedSkill.value!.definition,
                theme: null
            });
            if( res.status === 200 ) {
                let index = customSkills.value.findIndex(s => s.id === selectedSkill.value!.id)
                if (index !== -1) {
                    customSkills.value[index] = {
                        ...customSkills.value[index],
                        skill: editName.value || selectedSkill.value!.skill,
                        definition: editDef.value || selectedSkill.value!.definition
                    }
                }
                toastBg.value = 'bg-lumy-green';
                toastText.value = 'Skill updated!';
                handleClose();
            }
        }
    } catch (err: any) {
        console.error('Failed to delete skill: ', err);
        toastBg.value = 'bg-lumy-danger';
        toastText.value = 'Something went wrong :(';
    } finally {
        selectedSkill.value = undefined;
        loading.value = false;
        showToast.value = true;
    }
}

function cancelDelete() {
    deleteModal.value = false;
    selectedSkill.value = undefined
}

function verifyDelete(s: Skill) {
    selectedSkill.value = s;
    deleteModal.value = true;
}

async function deleteSkill() {
    try {
        loading.value = true;
        const res = await api.delete(`/skills/${selectedSkill.value?.id}`);
        if(res.status === 200) {
            deleteModal.value = false
            toastBg.value = 'bg-lumy-green';
            toastText.value = 'Deleted skill';
            customSkills.value = customSkills.value.filter(s => s.id !== selectedSkill.value?.id);
        }

    } catch (err: any) {
        console.error('Failed to delete skill: ', err);
        toastBg.value = 'bg-lumy-danger';
        toastText.value = 'Something went wrong :('
        loading.value = false;
    } finally {
        selectedSkill.value = undefined;
        loading.value = false;
        showToast.value = true;
    }
}
</script>