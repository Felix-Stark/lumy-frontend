import {defineStore} from 'pinia';
import type { User, Account, Skill, UserSummary, SetupUser } from '../types';
import { useApiFetch } from '@/composables/useApiFetch';
import { ref } from 'vue';

export const useAccountStore = defineStore("account", () => {
    // state
    const account = ref<Account | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    
    // actions
    const getAccount = async () => {
        loading.value = true;
        error.value = null;
    
        const { data, error: fetchError, loading: fetchLoading } = useApiFetch<Account>({
        method: "GET",
        url: "/account",
        });
    
        if (fetchLoading.value === false) {
            if (fetchError.value) {
        		error.value = fetchError.value.message;
            } else {
                account.value = data.value;
            }
        }
        loading.value = false;
    };

    const updateAccount = async (accountData: Partial<Account>) => {
        loading.value = true;
        error.value = null;

        const { data, error: fetchError, loading: fetchLoading } = useApiFetch<Account>({
            method: 'PATCH',
            url: '/account',
            body: accountData,
        });
        if (fetchLoading.value === false) {
            if (fetchError.value) {
                error.value = fetchError.value.message;
            } else {
                account.value = data.value;
            }
        }
        loading.value = false;
    };
    
    return { account, loading, error, getAccount, updateAccount };
})