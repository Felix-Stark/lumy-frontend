import { defineStore } from "pinia";
import api from "..//services/api";
import { useUserStore } from "./userStore";


function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export const useAuthStore = defineStore('auth', {
	state: ()=>({
		isLoggedIn: false,
		isAdmin: false,
		// token: null as string | null,
		// refresh: null as string | null,
	}),
	actions: {
		async loginSlack(code: string) {
			//slack sign in logic

			const res = await api.get("/slack/login/callback?code=" + code);
			let path = '';
			try {
				console.log('login res: ', res);
				if (res.status === 200) {
					console.log('login status 200: ', res);
					this.isLoggedIn = true;
					this.isAdmin = res.data.user.role === "admin";
					const userStore = useUserStore();
					userStore.me = res.data.user;
					userStore.account = res.data.account;
					path = '/admin/dashboard';
				}
				if (res.status === 204) {
					console.log('login status 204: ', res);
					this.isLoggedIn = false;
					path = '/slack/register';
				}
				return path;
			} catch (error: any) {
				console.error("Login error:", error);
			}
			//set slackUser state
		},
		async registerSlackUser(code: string) {
			const res = await api.post("/slack/account", { code });
			console.log('register data: ', res.data);
			if (res.status === 200) {
				const userStore = useUserStore();
				this.isLoggedIn = true;
				userStore.account = res.data;
				return res.data;
			}
		},
		
		async logout() {
			//logout logic
			//clear user state
		}
	}
})