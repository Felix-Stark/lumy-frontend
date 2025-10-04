import api from "@/services/api";
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { type TeamOverview, type TeamUser, type User } from "@/types";

interface Manager {
    manager: User,
    employees: User[]
}

export const useAdminStore = defineStore("admin", () => {
    const teamSummary = ref<TeamOverview | null>(null);
    const teamUsers = ref<TeamUser[]>([]);
    const managers = ref<Manager[] | null>(null);
    const employeeSummary = ref<User | null>(null);

    async function getTeamSummary() {
        try {
            const res = await api.get('/team/overview');
            if(res.status === 200) {
                teamSummary.value = res.data;
            }
        } catch (err: any) {
            console.error('Error in getTeamSummary: ', err);
        }
    };

    async function getTeamUsers() {
        try {
            const res = await api.get('/team/members');
            if(res.status === 200) {
                teamUsers.value = res.data.users;
            }
        } catch (err: any) {
            console.error('Error in getTeamUsers: ', err)
        }
    };
    async function getManagers() {
        try {
            const res = await api.get('/org/managers');
            if(res.status === 200) {
                managers.value = res.data.managers;
            }
        } catch (err: any) {
            console.error('Error in getEmployeeSummary: ', err)
        }
    };
    async function getEmployeeSummary(userId: number) {
        try {
            const res = await api.get('/me/summary?user_id='+userId);
            if(res.status === 200) {
                employeeSummary.value = res.data;
            }
        } catch (err: any) {
            console.error('Error in getEmployeeSummary: ', err)
        }
    }

    return {
        teamSummary,
        teamUsers,
        managers,
        employeeSummary,
        getEmployeeSummary,
        getManagers,
        getTeamSummary,
        getTeamUsers
    }
})