import {defineStore} from 'pinia';
import api from '../services/api';
import {useAuthStore} from './authStore';

interface User {
		name: string;
		email: string;
		avatar: string;
		role: string;
		is_active: boolean;
}

export const useUserStore = defineStore('user', {
	state: () => ({
		user: {} as User | null,
	})
})