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
        console.log("login status: ", res.status);
        console.log("login data: ", res.data);
        if (res.status === 200) {
          this.isLoggedIn = true;
          sessionStorage.setItem("LumyLoggedIn", "true");
          const userStore = useUserStore();
          userStore.me = res.data.user;
          userStore.account = res.data.account;
          path = "/member";
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
        this.isLoggedIn = true;
        this.setUpAccount = await res.data.content;
        return res.data;
      }
    },

    async logout() {
      sessionStorage.removeItem("LumyLoggedIn");
    },
  },
});