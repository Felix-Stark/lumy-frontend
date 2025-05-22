import { defineStore } from "pinia";
import api from "..//services/api"; // Assuming you have an api module to handle requests
import { useRouter } from "vue-router";
import type { AxiosError } from "axios";
const router = useRouter();


function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
interface SlackUser {
	id: string;
	team_id:string;
	displayName: string;
	realName: string;
	title: string; //role
	isAdmin: boolean;
	avatar: string; //slack url to avatar image
}
export const useAuthStore = defineStore('auth', {
	state: ()=>({
		isLoggedIn: false,
		slackUser: {} as null | SlackUser,
		token: null as string | null,
		refresh: null as string | null,
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
					this.token = res.data.token;
					this.refresh = res.data.refresh;
					this.slackUser = res.data.user;
					//router.push({ name: "dashboard" });
				}
				if (res.status === 204) {
					console.log('login status 204: ', res);
					this.isLoggedIn = false;
					this.slackUser = null;
					return res.status;
				}
			} catch (error: any) {
				console.error("Login error:", error);
			}
			//set slackUser state
		},
		async registerSlackUser(code: string) {
			const res = await api.post("/slack/account", { code });
			console.log('register res: ', res);
			if (res.status === 200) {
				this.isLoggedIn = true;
			}
		},
		async logout() {
			//logout logic
			//clear user state
		}
	}
})