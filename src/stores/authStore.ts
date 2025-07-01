import { defineStore } from "pinia";
import api from "..//services/api";
import { useUserStore } from "./userStore";
import type { SetupAccount } from "@/types";
export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    isAdmin: false,
    accountId: null as string | null,
    setupAccount: loadSetupAccount(),
  }),
  actions: {
    async loginSlack(code: string) {
      let path = "";
      try {
        const res = await api.get("/slack/login/callback?code=" + code);
        console.log("login data: ", res.data);
        if (res.status === 200) {
          const role = res.data.role;
          const userStore = useUserStore();
          userStore.getAccount();
          sessionStorage.setItem("LumyRole", role);
          path = `/${role}`;
          this.isLoggedIn = true;
        }
        if (res.status === 204) {
          this.isLoggedIn = false;
          path = "/slack/register";
        }
        return path;
      } catch (error: any) {
        console.error("Login error:", error);
      }
      //set slackUser state
    },
    async registerSlackUser(code: string) {
      const res = await api.post("/slack/account", { code });
      console.log("register data: ", res.data);
      if (res.status === 200) {
        this.setupAccount = await res.data; //store this in sessionStorage
        sessionStorage.setItem("LumySetupAccount", JSON.stringify(res.data));
        return res.data;
      }
    },
    async verifyAccount(accountId: number) {
      const res = await api.post("/slack/verify-setup", { account_id: accountId });
      if (res.status === 200) {
        this.isLoggedIn = true;
        sessionStorage.setItem("LumyLoggedIn", "true");
          const userStore = useUserStore();
          userStore.me = res.data.user;
          userStore.account = res.data.account;
          sessionStorage.setItem("LumyRole", res.data.user.role);

          this.isLoggedIn = true;
        return res.status;
      }
    },
    async logout() {
      sessionStorage.removeItem("LumyLoggedIn");
    },
  },
});

function loadSetupAccount(): SetupAccount | null {
  const raw = sessionStorage.getItem("LumySetupAccount");
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}