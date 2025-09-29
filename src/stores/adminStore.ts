import api, { apiRequest } from '@/services/apiWrapper';
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { type TeamOverview, type TeamUser } from "@/types";
import type { AxiosError } from "axios";
import { useRouter } from "vue-router";
import { useErrorStore } from "./errorStore";

const errorStore = useErrorStore();
const router = useRouter();

export const useAdminStore = defineStore("admin", () => {
    const teamSummary = ref<TeamOverview | null>(null);
    const teamUsers = ref<TeamUser[] | null>(null);

    async function getTeamSummary() {
        teamSummary.value = await apiRequest(api.get('/overview'))
        console.log('teamSummary: ', teamSummary.value);
    };

    async function getTeamUsers() {
        teamUsers.value = await apiRequest(api.get('/team'))
    };

    return {
        teamSummary,
        teamUsers,
        getTeamSummary,
    }
})