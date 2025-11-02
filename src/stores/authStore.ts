import { defineStore } from "pinia";
import api from "..//services/api";
import { useUserStore } from "./userStore";
import type { SetupAccount, Session } from "@/types";
import { useErrorStore } from "./errorStore";
import { ref, computed } from "vue";
export const useAuthStore = defineStore("auth", () => {
  const session = ref<Session | null>(null);
  const authenticated = computed(() => session.value?.authenticated || false);

  const setupAccount = computed<SetupAccount | null>(() => {
    const raw = sessionStorage.getItem("LumySetupAccount");
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  async function getSession() {
    if (session.value?.authenticated) return session.value;
    try {
      const res = await api.get('/session');
      if (res.status === 200) {
        session.value = await res.data;
      }
    } catch (err:any) {
      console.error('Error fetching session: ', err)
    }
  }

  async function loginSlack(code: string) {
    try {
      const res = await api.get("/slack/login/callback?code=" + code);
      if (res.status === 200) {
        await getSession();
      }
      return res.data;
    } catch (err: any) {
      console.error('Error during Slack login: ', err);
    }
  }

  async function registerSlackUser(code: string) {
    try {
      const res = await api.post("/slack/account", { code });
      if(res.status === 200) {
        sessionStorage.setItem("LumySetupAccount", JSON.stringify(res.data));
        return res.status;
      }
    } catch (err:any) {
      console.error('Error registering Slack user: ', err);
    }
  }

  // state: () => ({
  
  //   async registerSlackUser(code: string) {
  //     const res = await api.post("/slack/account", { code });
  //     console.log("register data: ", res.data);
  //     if (res.status === 200) {
  //       this.setupAccount = await res.data; //store this in sessionStorage
  //       sessionStorage.setItem("LumySetupAccount", JSON.stringify(res.data));
  //     }
  //     return res.status;
  //   },
  //   async verifyAccount(accountId: number) {
  //     const res = await api.post("/slack/verify-setup", { account_id: accountId });
  //     if (res.status === 200) {
  //       sessionStorage.setItem("loggedin", "true");
  //       this.isLoggedIn = true;
  //       return res.status;
  //     }
  //   },
  //   async logout() {
  //     sessionStorage.clear();
  //     this.isLoggedIn = false;
  //     this.isAdmin = false;
  //     this.accountId = null;

  //     window.location.href = "/"; // Redirect to login page
  //   },
  // },
  return {
    session,
    authenticated,
    setupAccount,
    getSession,
    loginSlack,
    registerSlackUser,
  }
});