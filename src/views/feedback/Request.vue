<template>
<div class="flex flex-col p-4 rounded-2xl bg-white drop-shadow-xl w-full min-h-[80vh] md:p-10 md:w-[75vw]">
		<header class="w-full mb-10">
			<h1 class="font-light text-2xl font-inter text-darkblue">Request feedback to fuel your Superpowers!</h1>
		</header>
		<hr class="w-full mb-10 border-t-2 border-gray-300"/>
		<section>
			<h3 class="font-light text-gray-500">Skill: <span class="text-lumy-purple">{{ reqSkill?.name }}</span></h3>
		</section>
		<hr class="w-full mt-6 mb-8 border-t-2 border-gray-300"/>
		<div class="w-1/2 relative">
			<Combobox v-model="selectedUsers" multiple>
                <ul v-if="selectedUsers.length > 0" class="flex flex-wrap gap-2">
                    <li v-for="person in selectedUsers" :key="person.id"
                        class="bg-lumy-purple text-white px-2 py-1 rounded-lg flex items-center gap-2">
                            <button @click="selectedUsers = selectedUsers.filter(u => u.id !== person.id)" class="px-1 py-2">
                                {{ person.name }}
                            </button>
                    </li>
                </ul>
                <Float
                    placement="bottom"  
                    :flip="true"
                    :offset="4"
                    
                    floatingAs="template"
                >
                    <div class="w-full flex">
                        <ComboboxInput class="border border-gray-300 w-full rounded" placeholder="Search or pick from list" @change="query = $event.target.value" />
                        <ComboboxButton class="bg-lumy-purple text-white font-bold p-2 rounded-md cursor-pointer">
                            <ChevronDown class="w-4 h-4" />
                        </ComboboxButton>
                    </div>
                    <ComboboxOptions class="absolute w-full max-h-48 overflow-auto bg-white border border-gray-300 rounded shadow-lg z-10">
                        <ComboboxOption v-for="u in filteredUsers" :key="u.id" :value="u" class="text-lg p-2 hover:bg-purple-50 cursor-pointer">
                            {{ u.name }} <Check v-if="selectedUsers.includes(u)" class="inline-block ml-2 text-lumy-purple" />
                        </ComboboxOption>
                    </ComboboxOptions>
                </Float>
            </Combobox>
            <textarea
                v-model="message"
                class="w-full h-full p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lumy-purple"
                placeholder="Write your feedback here..."
                rows="4"
            ></textarea>
            <BaseButton 
            btnText="Send Feedback Request"
            :disabled="selectedUsers.length === 0"
            :onAction="sendReq"
            />
		</div>
    </div>
</template>

<script setup lang="ts">
import {
    Combobox,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
    ComboboxLabel,
    ComboboxButton
  } from '@headlessui/vue'
import { Float } from '@headlessui-float/vue';
import BaseButton from '@/components/base/BaseButton.vue';
import { ref, onMounted, computed } from 'vue';
import api from '@/services/api';
import { useRouter } from 'vue-router';
import type { SkillSummary, User } from '@/types';
import { ChevronDown, Check, X } from 'lucide-vue-next';

const router = useRouter();

const message = ref('');
const users = ref<User[]>([]);
const showSuccess = ref(false);
const reqSkill = ref<SkillSummary>();
const selectedUsers = ref<User[]>([]);
const query = ref('');

const filteredUsers = computed<User[]>(() => {
    return query.value === ''
        ? users.value
        : users.value.filter((user: User) => {
            return user.name.toLowerCase().includes(query.value.toLowerCase());
        });
});

onMounted(async () => {
    try {
        const skill = sessionStorage.getItem('selectedSkill');
        if (skill) {
            reqSkill.value = JSON.parse(skill);
        }
        console.log('reqSkill: ', reqSkill.value);
        const response = await api.get('/users');
        if(response.status === 200) {
            users.value = response.data;
            console.log('Users fetched successfully:', users.value);
        } else {
            console.error('Failed to fetch users:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    }
});

const sendReq = async () => {
    try {
        if (selectedUsers.value.length === 0 || !reqSkill.value) {
            return;
        }
        for (const user of selectedUsers.value) {
            await api.post('/feedback/requests', {
                recipient_id: user.id,
                skill_id: reqSkill.value.skill_id,
                message: message.value,
                type: 'request'
            });
            console.log(`Feedback request sent to ${user.name}`);
        }
        
    } catch (error) {
        console.error('Error sending feedback request:', error);
    } finally {
        showSuccess.value = true;
        message.value = '';
        selectedUsers.value = [];
    }
}

const handleClose = () => {
    showSuccess.value = false;
    message.value = '';
    selectedUsers.value = [];
    router.push({ name: 'member' });
}

</script>