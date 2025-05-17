import { defineStore } from "pinia";
import api from "..//services/api";
import { useAuthStore } from "./authStore";

interface SlackUser {
	id: string;
	team_id: string;
	displayName: string;
	realName: string;
	title: string; // role
	isAdmin: boolean;
	avatar: string; // slack url to avatar image
}

export const useSlackStore = defineStore("slack", {
	state: () => ({
		slackUser: null as null | SlackUser,
		slackUsers: [] as SlackUser[]
	}),
	actions: {

	}
});