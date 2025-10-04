import { defineStore } from "pinia";
import api from "..//services/api";
import { useUserStore } from "./userStore";
import type { SetupAccount } from "@/types";
import { useErrorStore } from "./errorStore";
export const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: loadLoggedIn(),
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
          sessionStorage.setItem("LumyRole", JSON.stringify(role));
          sessionStorage.setItem("loggedin", "true")
          this.isLoggedIn = true;
          if(role === 'admin' || path === 'manager') {
            path = '/admin/overview'
          }
          if(role === 'member') {
            path = '/member/overview'
          }
        } else if (res.status === 204) {
          this.isLoggedIn = false;
          path = "/slack/register";
        } else {
          this.isLoggedIn = false;
          path = "/error";
          useErrorStore().setError(
            res.status,
            res.statusText || "Login failed. Please try again.",
          );
        }
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
      }
      return res.status;
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
      sessionStorage.clear();
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.accountId = null;

      window.location.href = "/"; // Redirect to login page
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
function loadLoggedIn(): boolean | null {
  const raw = sessionStorage.getItem("loggedin");
  try {
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}