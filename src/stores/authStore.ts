import { defineStore } from "pinia";
import api from "..//services/api";
import { useUserStore } from "./userStore";
import type { SetupAccount } from "@/types";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    isAdmin: false,
    accountId: null as number | null,
    setUpAccount: {} as SetupAccount | null,
  }),
  actions: {
    async loginSlack(code: string) {

      const res = await api.get("/slack/login/callback?code=" + code);
      let path = "";
      try {
        console.log("login data: ", res.data);
        if (res.status === 200) {
          console.log("login status: ", res.status);
          const userStore = useUserStore();
          userStore.me = res.data.user;
          userStore.account = res.data.account;
          sessionStorage.setItem("LumyRole", res.data.user.role);
          console.log("me: ", userStore.me);
          this.isLoggedIn = true;
          sessionStorage.setItem("LumyLoggedIn", "true");
          path = `/${userStore.me?.role}`;
        }
        if (res.status === 204) {
          console.log("login status 204: ", res);
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
        this.setUpAccount = await res.data.content;
        return res.data;
      }
    },
    async verifyAccount(accountId: string) {
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