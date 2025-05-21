import { defineStore } from "pinia";
import api from "..//services/api"; // Assuming you have an api module to handle requests
// import router from "@/router";

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
				if (res.status === 200) {
					this.isLoggedIn = true;
					this.token = res.data.token;
					this.refresh = res.data.refresh;
					this.slackUser = res.data.user;
					//router.push({ name: "dashboard" });
					
				} else {
					console.log('res status: ', res.status);
					if (res.status === 404) {
						return res.status
					}
				}
			} catch (error) {
				console.error("Login error:", error);

			}
			//set slackUser state
		},
		async registerSlackUser(code: string) {

		},
		async logout() {
			//logout logic
			//clear user state
		}
	}
})