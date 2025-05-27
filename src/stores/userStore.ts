import {defineStore} from 'pinia';
import api from '../services/api';
import {useAuthStore} from './authStore';
import type {User, Account} from '../types';

export const useUserStore = defineStore('user', {
	state: () => ({
		me: {} as User | null,
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
		async getUsers() {
			const res = await api.get('/users');
			if (res.status === 200) {
				this.users = res.data;
			}
			return res.status;
		},
		async getAccount() {
			const res = await api.get('/account');
			if (res.status === 200) {
				this.account = res.data;
			}
			return res.status;
		},
	}
})