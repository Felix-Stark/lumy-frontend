<template>
    <section class="flex flex-col w-full h-full xl:flex-row xl:flex-wrap xl:gap-8">
        <IntegrationCard
        :img="GoogleCal"
        title="Google"
        :connected="isConnected"
        @connect="triggerGoogle()"
        @disconnect="disconnectGoogle()"
        >
            <p>Trigger feedback after regular meeting interactions</p>
            <p>Skip users who are marked as OOO automatically</p>
            <p>No access to meeting content or private notes</p>
        </IntegrationCard>
    </section>
    <BaseToast
    :text="toastText"
    :bgClass="toastBg"
    :show="showToast"
    @close="showToast = false"
    />
</template>
<script setup lang="ts">
import GoogleCal from '@/assets/images/google_cal.png';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Link, Unlink } from 'lucide-vue-next';
import BaseToast from '@/components/base/BaseToast.vue';
import IntegrationCard from '@/components/settings/IntegrationCard.vue';
import api from '@/services/api.ts';

const route = useRoute();
const apiUrl = import.meta.env.VITE_API_URL as string;

const isConnected = ref(false);
const showToast = ref(false);
const toastBg = ref('bg-lumy-green');
const toastText = ref('');

onMounted(async () => {
    try {
        if (route.query.status === 'success') {
        const rawMsg = route.query.message as string;
        toastText.value = rawMsg.replace(/_/g, ' ');
        toastBg.value = 'bg-lumy-green';
        showToast.value = true;
    } else if (route.query.status === 'error') {
        toastText.value = 'There was an error connecting Google Calendar';
        toastBg.value = 'bg-lumy-danger';
        showToast.value = true;
        
    }
    const res = await api.get('/integrations/google')
    isConnected.value = res.data.connected;
    } catch (error) {
        console.error('Error fetching Google Calendar status:', error);
        toastText.value = 'There was an error connecting Google Calendar';
        toastBg.value = 'bg-lumy-danger';
        showToast.value = true;
    }
})

const triggerGoogle = () => {
    window.open(apiUrl + 'integrations/google/start',
  '_self');
}

const disconnectGoogle = async () => {
    try {
        const res = await api.delete('/integrations/google');
        if (res.status === 200) {
            isConnected.value = false;
            toastText.value = 'Google Calendar disconnected successfully';
            toastBg.value = 'bg-lumy-green';
            showToast.value = true;
        } else {
            toastText.value = 'There was an error disconnecting Google Calendar';
            toastBg.value = 'bg-lumy-danger';
            showToast.value = true;
        }
    } catch (error) {
        console.error('Error disconnecting Google Calendar:', error);
        toastText.value = 'There was an error disconnecting Google Calendar';
        toastBg.value = 'bg-lumy-danger';
        showToast.value = true;
    }
}

</script>