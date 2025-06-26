import {defineStore} from 'pinia';
import api from '../services/api';
import {useAuthStore} from './authStore';
import type { User, Account, Skill, UserSummary } from '../types';

export const useUserStore = defineStore('user', {
	state: () => ({
		me: {} as User | null,
		meSummary: {} as UserSummary | null,
		userSkills: [] as Skill[] | null,
		users: [] as User[],
		account: {} as Account | null,
	}),
	actions: {
		async getMe() {
			const res = await api.get('/me');
			if (res.status === 200) {
				this.me = res.data;
			}
			return res.status;
		},
		async getMeSummary() {
			const res = await api.get('/me/summary');
			if (res.status === 200) {
				this.meSummary = res.data; //return status and use userStore.me in components
				return res.status; //return status and use userStore.me in components
			}
		},
		async getUserSkills(userId: number) {
			const res = await api.get(`/users/${userId}/skills`);
			if (res.status === 200) {
				this.userSkills = res.data; //return status and use userStore.userSkills in components
				console.log('userSkills', this.userSkills);
				return res.status; //return status and use userStore.users in components
			}
		},
		async getUsers() {
			const res = await api.get('/users');
			if (res.status === 200) {
				this.users = res.data; //return status and use userStore.users in components
				return res.status
			}
			
		},
		async updateUser(userId: number, userData: Partial<User>) {
			const res = await api.patch(`/users/${userId}`, userData);
			if(res.status === 200) {
				return res.data;
			}
		},
		async getAccount() {
			console.log('getting account')
			const res = await api.get('/account');
			console.log('account res: ', res)
			if (res.status === 200) {
				this.account = res.data;
			}
			return res.status;
		},
	}
})