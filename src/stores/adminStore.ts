import api from "@/services/api";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { type TeamOverview, type TeamUser } from "@/types";


export const useAdminStore = defineStore("admin", () => {
    const teamSummary = ref<TeamOverview | null>(null);
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
        try {
            const res = await api.get('/team');
            if(res.status === 200) {
                teamUsers.value = res.data;
            }
        } catch (err: any) {
            console.error('Error in getTeamUsers: ', err)
        }

    };

    return {
        teamSummary,
        teamUsers,
        getTeamSummary,
        getTeamUsers
    }
})