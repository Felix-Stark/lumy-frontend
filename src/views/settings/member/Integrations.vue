<template>
    <div class="flex flex-col items-center gap-6 w-full min-h-[60vh] p-8 lg:p-12 bg-white rounded-xl shadow-md">
        <img :src="GoogleCal" alt="Google calendar logo" class="w-48 h-48 mb-4"/>
        <h1 class="font-inter text-2xl">Google Calendar</h1>
        <div class="flex flex-col justify-center items-center mt-4 font-normal text-sm space-y-1">
            <p>
                Use shared meetings to detect collaboration patterns across teams.
            </p>
            <p>
                Trigger feedback after regular meeting interactions
            </p>
            <p>
                Skip users who are marked as OOO automatically
            </p>
            <p>
                No access to meeting content or private notes
            </p>
        </div>
        <div v-if="isConnected === true" class="flex">
            <Link class="w-4 h-4 stroke-3 text-gray-500 mr-1" />
            <p class="text-lumy-green">Connected</p>
        </div>
        <div v-else class="flex items-center">
            <Unlink class="w-4 h-4 stroke-3 text-gray-500 mr-1"/>
            <p class="text-lumy-danger">Not connected</p>
        </div>
        <div class="flex space-x-4 mt-6">
            <button v-if="isConnected === true" class="flex items-center space-x-2 px-4 py-2 bg-lumy-dark opacity-70 text-white text-sm rounded-lg">
                Disconnect
            </button>
            <button v-else @click="triggerGoogle" class="flex items-center space-x-2 px-4 py-2 bg-lumy-green text-white text-sm rounded-lg">
                Connect
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
import GoogleCal from '@/assets/images/google_cal.png';
import { ref, onMounted } from 'vue';
import { Link, Unlink } from 'lucide-vue-next';
import api from '@/services/api.ts';

const apiUrl = import.meta.env.VITE_API_URL as string;

const isConnected = ref(false);

onMounted(async () => {
    const res = await api.get('/integrations/google')
    isConnected.value = res.data.connected;
})

const triggerGoogle = () => {
    window.open(apiUrl + '/integrations/google/start?state=' + encodeURIComponent(window.location.href),
  '_self');
}

</script>