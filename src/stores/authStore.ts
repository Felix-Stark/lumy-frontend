import { defineStore } from "pinia";

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
	}),
	actions: {
		async login() {
			//slack sign in logic
			

			//set slackUser state
		},
		async logout() {
			//logout logic
			//clear user state
		}
	}
})