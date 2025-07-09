import { defineStore } from "pinia";
import api from "..//services/api";
import { useUserStore } from "./userStore";
import type { SetupAccount } from "@/types";
export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: setLoggedIn(),
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
          console.log("role in loginSlack: ", role);
          console.log("res.data in loginSlack: ", res.data);
          sessionStorage.setItem("LumyRole", role);
          sessionStorage.setItem("loggedin", "true")
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
        sessionStorage.setItem("loggedin", "true");
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
function setLoggedIn(): boolean | null {
  const raw = sessionStorage.getItem("loggedin");
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}