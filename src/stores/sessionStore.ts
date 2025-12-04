import { defineStore } from "pinia";
import api from "../services/api";
import type { Session } from "@/types";
import { useErrorStore } from "./errorStore";
import { ref, computed } from "vue";

interface SessionUser {
    id: number;
    name: string;
    email: string;
    role: string;
}
export const useSessionStore = defineStore("session", () => {
    const authenticated = ref<boolean>(false);
    const user = ref<SessionUser | null>(null);

    async function getSession() {
        if(user.value !== null || authenticated.value) return {authenticated: authenticated.value, user: user.value} as Session;

        try {
            const { data } = await api.get('/session');
            console.log('session: ', data);
            authenticated.value = data.authenticated;
            if (data.user) {
                user.value = data.user;
            }
            return data as Session;
        } catch (err: any) {
            console.error('Error fetching session: ', err);
            authenticated.value = false;
            user.value = null
            throw err
        }
    };
    function clearSession() {
        authenticated.value = false;
        user.value = null;
    }
    return {
        user,
        authenticated,
        getSession,
        clearSession
    }
})