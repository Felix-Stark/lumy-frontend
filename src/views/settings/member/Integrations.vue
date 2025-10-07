<template>
       <section v-if="loading" class="grid grid-cols-2 auto-rows-fr w-full gap-8">
            <!-- skeletons -->
            <div class="animate-pulse flex flex-col gap-4 p-6 bg-white rounded-xl shadow">
                <div class="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div class="animate-pulse flex flex-col gap-4 p-6 bg-white rounded-xl shadow">
                <div class="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                <div class="h-4 bg-gray-200 rounded w-3/4"></div>
                <div class="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
        </section>

        <section v-else class="grid grid-cols-2 auto-rows-fr w-full gap-8">
            <IntegrationCard
            :img="GoogleCal"
            title="Google"
            :connected="googleConnected"
            @connect="triggerGoogle()"
            @disconnect="disconnectGoogle()"
            >
            <p>Trigger feedback after regular meeting interactions</p>
            <p>Skip users who are marked as OOO automatically</p>
            <p>No access to meeting content or private notes</p>
            </IntegrationCard>

            <IntegrationCard
            :img="AsanaImg"
            title="Asana"
            :connected="asanaConnected"
            @connect="triggerAsana()"
            @disconnect="disconnectAsana()"
            >
            <p class="text-center">
                Trigger feedback automatically when tasks or projects are finished
            </p>
            <p class="text-center">
                Identify strong collaborators from assignees, followers, and project members
            </p>
            <p class="text-center">No access to task descriptions or private comments</p>
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
import AsanaImg from '@/assets/images/asana.png';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import BaseToast from '@/components/base/BaseToast.vue';
import IntegrationCard from '@/components/settings/IntegrationCard.vue';
import api from '@/services/api.ts';

const route = useRoute();
const apiUrl = import.meta.env.VITE_API_URL as string;
const showToast = ref(false);
const toastBg = ref('bg-lumy-green');
const toastText = ref('');
const googleConnected = ref(false);
const asanaConnected = ref(false);
const asanaLink = ref<string>()
const loading = ref(true);

onMounted(async () => {
    try {
        if (route.query.status === 'success') {
        const rawMsg = route.query.message as string;
        toastText.value = rawMsg.replace(/_/g, ' ');
        toastBg.value = 'bg-lumy-green';
        showToast.value = true;
    } else if (route.query.status === 'error') {
        const rawMsg = route.query.message as string;
        toastText.value = rawMsg.replace(/_/g, ' ');
        toastBg.value = 'bg-lumy-danger';
        showToast.value = true;
        
    }
    const googleRes = await api.get('/integrations/google');
    googleConnected.value = await googleRes.data.connected;

    const asanaRes = await api.get('/integrations/asana');
    asanaConnected.value = await asanaRes.data.connected;
    const asanaOauth = await api.get('/integrations/asana/oauth/start')
    if(asanaOauth.status === 200) {
        asanaLink.value = asanaOauth.data.authorize_url
    }
    } catch (error) {
        console.error('Error fetching integration status:', error);
        
    } finally {
        loading.value = false;
    }
});

const triggerAsana = () => {
    window.open(asanaLink.value, '_self');
};
const disconnectAsana = async () => {
    try {
        const res = await api.post('/integrations/asana/disconnect');
        if(res.status === 200) {
            toastText.value = 'Asana integration disconnected successfully'
            toastBg.value = 'bg-lumy-green'
            showToast.value = true
            const asanaRes = await api.get('/integrations/asana');
            asanaConnected.value = await asanaRes.data.connected;
        }
    } catch (err: any) {
        console.error('Failed to disconnect Asana: ', err)
    }
}

const triggerGoogle = () => {
    window.open(apiUrl + 'integrations/google/start',
  '_self');
};

const disconnectGoogle = async () => {
    try {
        const res = await api.delete('/integrations/google');
        if (res.status === 200) {
            googleConnected.value = false;
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