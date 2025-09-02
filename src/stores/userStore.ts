import {defineStore} from 'pinia';
import type { User, Skill, UserSummary, SetupUser } from '../types';
import { useApiFetch } from '@/composables/useApiFetch';
import { ref } from 'vue';

export const useUserStore = defineStore("user", () => {
  // state
  const me = ref<User | null>(null);
  const meSummary = ref<UserSummary | null>(null);
  const userSkills = ref<Skill[] | null>(null);
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // actions
  const getMe = async () => {
    loading.value = true;
    error.value = null;

    const { data, error: fetchError, loading: fetchLoading, run } = useApiFetch<User>({
		url: "/user/me",
      	method: "GET",
    });
	await run();

    if (fetchLoading.value === false) {
		if (fetchError.value) {
      		error.value = fetchError.value.message;
		} else {
			me.value = data.value;
		}
	}
    loading.value = false;
  };

  const getMeSummary = async () => {
	loading.value = true;
	error.value = null;

	const { data, error: fetchError, loading: fetchLoading, run } = useApiFetch<UserSummary>({
		method: "GET",
		url: "/me/summary",
	});

	await run();

	if (fetchError.value) {
		error.value = fetchError.value.message;
	} else {
		meSummary.value = data.value;
	}

	loading.value = false;
  };

  const getUserSkills = async (userId: number) => {
	loading.value = true;
	error.value = null;

	const { data, error: fetchError, loading: fetchLoading } = useApiFetch<Skill[]>({
	  method: "GET",
	  url: `/users/${userId}/skills`,
	});

	if (fetchLoading.value === false) {
		if (fetchError.value) {
			error.value = fetchError.value.message;
		} else {
			userSkills.value = data.value;
		}
	}
	loading.value = false;
  };

  const getUsers = async () => {
	loading.value = true;
	error.value = null;

	const { data, error: fetchError, loading: fetchLoading } = useApiFetch<User[]>({
	  method: "GET",
	  url: "/users",
	});

	if (fetchLoading.value === false) {
		if (fetchError.value) {
			error.value = fetchError.value.message;
		} else {
			users.value = data.value || [];
		}
	}
	loading.value = false;
  };

  const updateUser = async (userId: number, userData: Partial<SetupUser>) => {
	loading.value = true;
	error.value = null;
	
	const { data, error: fetchError, loading: fetchLoading } = useApiFetch<User>({
			method: "PATCH",
			url: `/users/${userId}`,
			body: userData,
		});
	if (fetchLoading.value === false) {
		if (fetchError.value) {
			error.value = fetchError.value.message;
		} else {
			loading.value = false;
			return data.value;
		}
	}
	loading.value = false;
  };

  return {
	  loading,
	  error,
	  getMe,
	  me,
	  getMeSummary,
	  meSummary,
	  getUserSkills,
	  userSkills,
	  getUsers,
	  users,
	  updateUser,
  };
});



// export const useUserStore = defineStore('user', {
// 	state: () => ({
// 		me: {} as User | null,
// 		meSummary: {} as UserSummary | null,
// 		userSkills: [] as Skill[] | null,
// 		users: [] as User[],
// 		account: {} as Account | null,
		
// 	}),
// 	actions: {
// 		async getMe() {
			
// 		},
// 		async getMeSummary() {
// 			const res = await api.get('/me/summary');
			
// 		},
// 		async getUserSkills(userId: number) {
// 			const res = await api.get(`/users/${userId}/skills`);
// 			if (res.status === 200) {
// 				this.userSkills = res.data; //return status and use userStore.userSkills in components
// 				return res.status; //return status and use userStore.users in components
// 			}
// 		},
// 		async getUsers() {
// 			try {
// 				const res = await api.get('/users');
// 				if (res.status === 200) {
// 					this.users = res.data; //return status and use userStore.users in components
// 					return res.status
// 				}
// 			} catch (error: any) {
// 				console.error('error in get users: ', error)
// 			}
			
// 		},
// 		async updateUser(userId: number, userData: Partial<SetupUser>) {
// 			try {
// 				const res = await api.patch(`/users/${userId}`, userData);
// 				if(res.status === 200) {
// 					return res.data;
// 				}
// 			} catch (error: any) {
// 				console.error('error in update user: ', error)
// 			}
// 		},
// 		async getAccount() {
// 			const res = await api.get('/account');
// 			if (res.status === 200) {
// 				this.account = res.data;
// 			}
// 			return res.data as Account;
// 		},
// 	}
// })