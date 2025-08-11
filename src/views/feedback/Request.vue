<template>
<div class="flex flex-col items-center p-4 rounded-2xl bg-white drop-shadow-xl w-full min-h-[80vh] mt-8 mb-8 md:p-10 md:w-[75vw]">
		<header class="w-full mb-10">
			<h1 class="font-light text-2xl font-inter text-darkblue">Request feedback to fuel your Superpowers!</h1>
		</header>
		<hr class="w-full mb-10 border-t-2 border-gray-300"/>
		<section>
			<h3 class="font-light text-gray-500">Skill: <span class="text-lumy-purple">{{ reqSkill?.skill }}</span></h3>
			<p class="font-light text-gray-500">{{ reqSkill?.definition }}</p>
		</section>
		<hr class="w-full mt-6 mb-8 border-t-2 border-gray-300"/>
		<section>
			<Combobox v-model="selectedUsers" multiple>
                <ul v-if="selectedUsers.length > 0">
                <li v-for="person in selectedUsers" :key="person.id">
                    {{ person.name }}
                </li>
                </ul>
                <ComboboxInput />
                <ComboboxButton class="bg-lumy-purple text-white font-bold py-2 px-4 rounded-md cursor-pointer">
                    Select Users
                </ComboboxButton>
                <ComboboxLabel class="sr-only">Select Users</ComboboxLabel>
                <ComboboxOptions>
                    <ComboboxOption v-for="u in users" :key="u.id" :value="u">
                        {{ u.name }}
                    </ComboboxOption>
                </ComboboxOptions>
            </Combobox>
            <textarea
                v-model="message"
                class="w-full h-full p-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lumy-purple"
                placeholder="Write your feedback here..."
                rows="6"
            ></textarea>
            <BaseButton 
            btnText="Send Feedback Request"
            :disabled="selectedUsers.length === 0"
            :onAction="sendReq"
            />
		</section>
    </div>
    <BaseDialog
			v-if="showSuccess"
			:isOpen="showSuccess"
			@close="handleClose"
			:imgPath="LumySuccess"
			:imgAlt="'Lumy Success'"
			title="Feedback Requested"
			message="Your feedback request has been sent successfully!"
			btnText="OK"
		>
		</BaseDialog>
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
import BaseDialog from '@/components/dialogs/BaseDialog.vue';
import BaseButton from '@/components/buttons/BaseButton.vue';
import { ref, onMounted } from 'vue';
import LumySuccess from '@/assets/images/lumy_cheering.png';
import api from '@/services/api';
import { useRouter } from 'vue-router';
import type { Skill, User } from '@/types';

const router = useRouter();

const message = ref('');
const users = ref<User[]>([]);
const showSuccess = ref(false);
const reqSkill = ref<Skill>();
const selectedUsers = ref<User[]>([]);

onMounted(async () => {
    try {
        const skill = sessionStorage.getItem('selectedSkill');
        if (skill) {
            reqSkill.value = JSON.parse(skill);
        }
        const response = await api.get('/users');
        users.value = response.data;
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
                skill_id: reqSkill.value.id,
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