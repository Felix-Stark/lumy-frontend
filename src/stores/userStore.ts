import {defineStore} from 'pinia';
import api from '../services/api';
import {useAuthStore} from './authStore';
import type { User, Account, Skill, UserSummary, SetupUser } from '../types';

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
			try {
				const res = await api.get('/users');
				if (res.status === 200) {
					this.users = res.data; //return status and use userStore.users in components
					return res.status
				}
			} catch (error: any) {
				console.error('error in get users: ', error)
			}
			
		},
		async updateUser(userId: number, userData: Partial<SetupUser>) {
			try {
				const res = await api.patch(`/users/${userId}`, userData);
				if(res.status === 200) {
					return res.data;
				}
			} catch (error: any) {
				console.error('error in update user: ', error)
			}
		},
		async getAccount() {
			const res = await api.get('/account');
			if (res.status === 200) {
				this.account = res.data;
			}
			return res.data as Account;
		},
	}
})