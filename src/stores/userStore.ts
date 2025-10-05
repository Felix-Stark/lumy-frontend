import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'
import type { User, Account, Skill, UserSummary, SetupUser } from '../types'

export const useUserStore = defineStore('user', () => {
  const me = ref<User | null>(null);
  const meSummary = ref<UserSummary | null>(null);
  const userSkills = ref<Skill[] | null>(null);
  const users = ref<User[]>([]);

  async function getMe() {
    const res = await api.get('/me')
    if (res.status === 200) {
      me.value = res.data
    }
    return res.status
  }

  async function getMeSummary() {
    const res = await api.get('/me/summary')
    if (res.status === 200) {
      meSummary.value = res.data
      return res.status
    }
  }

  async function getUserSkills(userId: number) {
    const res = await api.get(`/users/${userId}/skills`)
    if (res.status === 200) {
      userSkills.value = res.data
      return res.status
    }
  }

  async function getUsers(inactive: boolean) {
    try {
      const res = await api.get(`/users?include_inactive=${inactive}`)
      if (res.status === 200) {
        users.value = res.data
        return res.status
      }
    } catch (error: any) {
      console.error('error in get users: ', error)
    }
  }

  async function updateUser(
    userId: number,
    userData: Partial<SetupUser>,
    path: string
  ) {
    try {
      const res = await api.patch(`/users/${userId}`, userData)
      if (res.status === 200) {
        if (path === 'setup') {
          return res.data
        } else {
          getUsers(true)
        }
      }
    } catch (error: any) {
      console.error('error in update user: ', error)
    }
  }

    const roleOrder: Record<User['role'], number> = {
    admin: 0,
    manager: 1,
    member: 2,
  }

  // Sorted list of users
  const sortedUsers = computed(() => {
    return [...users.value].sort((a, b) => {
      if (a.is_active !== b.is_active) {
        return a.is_active ? -1 : 1
      }

      const roleDiff = roleOrder[a.role] - roleOrder[b.role]
      if (roleDiff !== 0) return roleDiff

      return a.name.localeCompare(b.name)
    })
  })


  return {
    // state
    me,
    meSummary,
    userSkills,
    users,
	  sortedUsers,
    // actions
    getMe,
    getMeSummary,
    getUserSkills,
    getUsers,
    updateUser
  }
})
