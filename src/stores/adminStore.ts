import api, { apiRequest } from '@/services/apiWrapper';
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { type TeamOverview, type TeamUser } from "@/types";
import { useRouter } from "vue-router";
import { useErrorStore } from "./errorStore";

const errorStore = useErrorStore();
const router = useRouter();

export const useAdminStore = defineStore("admin", () => {
    const teamSummary = ref<TeamOverview>({} as TeamOverview);
    const teamUsers = ref<TeamUser[]>([]);

    async function getTeamSummary() {
        try {
            const res = await api.get('/overview');
            if(res.status === 200) {
                teamSummary.value = res.data;
            }
        } catch (err: any) {
            console.error('Error in getTeamSummary: ', err);
        }
    };

    async function getTeamUsers() {
        teamUsers.value = await apiRequest(api.get('/team'))
    };

    return {
        teamSummary,
        teamUsers,
        getTeamSummary,
        getTeamUsers
    }
})