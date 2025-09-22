<<<<<<< HEAD
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
    
        const { data, error: fetchError, run } = useApiFetch<Account>({
        method: "GET",
        url: "/account",
        });
        await run();
        if (fetchError.value) {
            error.value = fetchError.value.message;
        } else {
            account.value = data.value;
        }

        loading.value = false;
    };

    const updateAccount = async (accountData: Partial<Account>) => {
        loading.value = true;
        error.value = null;

        const { data, error: fetchError, run } = useApiFetch<Account>({
            method: 'PATCH',
            url: '/account',
            body: accountData,
        });

        await run();
        
        if (fetchError.value) {
            error.value = fetchError.value.message;
        } else {
            account.value = data.value;
        }
        loading.value = false;
    };
    
    return { account, loading, error, getAccount, updateAccount };
})
=======
import { defineStore } from "pinia";
import api from "../services/api";
import type { Account } from "../types";
import { ref } from "vue";

export const useAccountStore = defineStore("account", () => {
  const account = ref<Account | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function getAccount() {
    try {
      // check sessionStorage first
      const raw = sessionStorage.getItem("LumyAccount");
      if (raw) {
        account.value = JSON.parse(raw) as Account;
        return account.value;
      }
      loading.value = true;
      // otherwise fetch from API
      const res = await api.get("/account");
      if (res.status === 200) {
        account.value = res.data as Account;
        sessionStorage.setItem("LumyAccount", JSON.stringify(res.data));
        return account.value;
      }
    } catch (err: any) {
      console.error("error in get account: ", err);
      error.value =
        err.message || "An error occurred while fetching account data.";
    } finally {
        loading.value = false;
    }
  }

  async function updateAccount(data: Account) {
    try {
        if (!account.value) {
            throw new Error("No account data to update.");
        }
        const res = await api.patch(`/account`, data);
        if (res.status === 200) {
            account.value = res.data as Account;
            sessionStorage.setItem("LumyAccount", JSON.stringify(res.data));
            return account.value;
        }
    } catch (err: any) {
        console.error("error in update account: ", err);
        error.value =
            err.message || "An error occurred while updating account data.";
    } finally {
        loading.value = false;
    }
  }

  return { account, error, loading, getAccount, updateAccount };
});
>>>>>>> main
