import { defineStore } from "pinia";
import api from "..//services/api";


function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
interface SlackUser {
	id: string;
	account_id:string;
	role: string; //role
	displayName: string;
	email: string; //email
	avatar: string; //slack url to avatar image
}
export const useAuthStore = defineStore('auth', {
	state: ()=>({
		isLoggedIn: false,
		isAdmin: false,
		slackUser: {} as null | SlackUser,
		// token: null as string | null,
		// refresh: null as string | null,
	}),
	actions: {
		async loginSlack(code: string) {
			//slack sign in logic

			const res = await api.get("/slack/login/callback?code=" + code);

			try {
				console.log('login res: ', res);
				if (res.status === 200) {
					console.log('login status 200: ', res);
					this.isLoggedIn = true;
					this.isAdmin = res.data.user.role === "admin";
					this.slackUser = res.data;
					
				}
				if (res.status === 204) {
					console.log('login status 204: ', res);
					this.isLoggedIn = false;
					this.slackUser = null;
				}
				return res.status;
			} catch (error: any) {
				console.error("Login error:", error);
			}
			//set slackUser state
		},
		async registerSlackUser(code: string) {
			const res = await api.post("/slack/account", { code });
			console.log('register data: ', res.data);
			if (res.status === 200) {
				this.isLoggedIn = true;
				return res.status;
			}
		},
		async getMe() {
			//get user info logic
			const res = await api.get("/me");
			console.log('getMe res: ', res);
			if (res.status === 200) {
				this.slackUser = res.data;
				this.isLoggedIn = true;
				this.isAdmin = res.data.role === "admin";
			} else {
				this.isLoggedIn = false;
				this.slackUser = null;
			}
		},
		async logout() {
			//logout logic
			//clear user state
		}
	}
})