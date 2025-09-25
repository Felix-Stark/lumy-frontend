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

  async function updateAccount(data: Partial<Account>) {
    try {
        if (!account.value) {
            throw new Error("No account data to update.");
        }
        loading.value = true;
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
