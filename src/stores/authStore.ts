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
    if (authenticated.value === true) return session.value;
    try {
      const res = await api.get('/session');
      if (res.data.authenticated) {
        const se: Session = await res.data
        session.value = se;
        return se;
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
        sessionStorage.setItem('LumyRole', JSON.stringify(res.data.role));
        return res.data;
      }
    } catch (err: any) {
      console.error('Error during Slack login: ', err);
    }
  };

  async function registerSlackUser(code: string) {
    try {
      const res = await api.post("/slack/account", { code });
      console.log("register data: ", res.data);
      if (res.status === 200) {
        sessionStorage.setItem("LumySetupAccount", JSON.stringify(res.data));
        sessionStorage.setItem('LumyRole', JSON.stringify(res.data.role));
      }
      return res.status;
    } catch (err:any) {
      console.error('Error in register with slack: ', err);
    }
  };

  async function verifyAccount(accountId: number) {
    const res = await api.post("/slack/verify-setup", { account_id: accountId });
    if (res.status === 200) {
      sessionStorage.setItem("loggedin", "true");
      return res.status;
    }
  };

  async function logout() {
    sessionStorage.clear();
    
    window.location.href = "/"; // Redirect to login page
  };
  return {
    session,
    authenticated,
    setupAccount,
    getSession,
    loginSlack,
    registerSlackUser,
    verifyAccount,
    logout
  }
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