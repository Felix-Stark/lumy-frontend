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
			const res = await api.get("/slack/login/callback/" + code);
			if (res.status == 200 || res.status == 204 ) {
				console.log("Login successful", res.data);
				return res.status;
			} else {
				throw new Error("Failed to login");
			}


			//set slackUser state
		},
		async logout() {
			//logout logic
			//clear user state
		}
	}
})