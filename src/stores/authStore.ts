import { defineStore } from "pinia";
import api from "..//services/api";
import type { SetupAccount } from "@/types";
import { ref, computed } from "vue";
import { useSessionStore } from "./sessionStore";

export const useAuthStore = defineStore("auth", () => {


  async function loginSlack(code: string) {
    try {
      const res = await api.get("/slack/login/callback?code=" + code);
      return res.status;
    } catch (err: any) {
      console.error('Error during Slack login: ', err);
    }
  };

  async function registerSlackUser(code: string) {
    try {
      const res = await api.post("/slack/account", { code });
      if (res.status === 200) {
        sessionStorage.setItem("LumySetupAccount", JSON.stringify(res.data));
      }
      return res.status;
    } catch (err:any) {
      if(err.response?.status === 403) {
        throw new Error('NOT_ADMIN');
      }
      console.error('Error in registerSlackAccount: ', err);
      throw err;
    }
  };

  async function verifyAccount(accountId: number) {
    const session = useSessionStore();

    const res = await api.post("/slack/verify-setup", { account_id: accountId });
    if (res.status === 200) {
      await session.getSession();
      return res.status;
    }
  };

  async function logout() {
    try {
      const res = await api.post("/logout");
      if (res.status === 200) {
        sessionStorage.clear();
      }
    } catch (err: any) {
      console.error('Error during logout: ', err);
    } finally {
        window.location.href = "/";
    }
  };
  return {
    loginSlack,
    registerSlackUser,
    verifyAccount,
    logout
  }
});