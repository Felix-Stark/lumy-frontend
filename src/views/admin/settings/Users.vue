<template>
    <div class="border-box w-full h-full mb-6 bg-white rounded-xl shadow-md p-8 max-h-[75vh] overflow-auto">
        <div class="p-4 overflow-auto">
            <PickUserComp
            v-for="user in users"
            :id="user.id"
            :key="user.id"
            :avatarUrl="user.avatar"
            :name="user.name"
            :title="user.title"
            v-model:role="user.role"
            v-model:isActive="user.is_active"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import PickUserComp from '@/components/setup/PickUserComp.vue';
import type { User } from '@/types';
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import api from '@/services/api';

const userStore = useUserStore();
const users = ref<User[]>();
const account = computed(() => userStore.account);

onMounted(async() => {
    if(account === null) {
        userStore.getAccount();
    }
    try {
        const res = await api.get('/users');
        if(res.status === 200) {
            users.value = res.data
        }
        // users.value = mockUsers;
    } catch(error: any) {
        console.log('error in mount settings: ', error)
    }
})
const mockUsers: User[] = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    role: "admin",
    title: "Team Lead",
    slack_user_id: "U001",
    slack_team_id: "T001",
    account_id: "A001",
    is_active: true,
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@example.com",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    role: "member",
    title: "Developer",
    slack_user_id: "U002",
    slack_team_id: "T001",
    account_id: "A001",
    is_active: true,
  },
  {
    id: 3,
    name: "Carol White",
    email: "carol.white@example.com",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    role: "member",
    title: "Designer",
    slack_user_id: "U003",
    slack_team_id: "T001",
    account_id: "A001",
    is_active: true,
  },
  {
    id: 4,
    name: "David Brown",
    email: "david.brown@example.com",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    role: "admin",
    slack_user_id: "U004",
    slack_team_id: "T001",
    account_id: "A001",
    is_active: true,
  },
  {
    id: 5,
    name: "Eva Green",
    email: "eva.green@example.com",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    role: "member",
    title: "QA Engineer",
    slack_user_id: "U005",
    slack_team_id: "T001",
    account_id: "A001",
    is_active: true,
  },
  {
    id: 6,
    name: "Frank Black",
    email: "frank.black@example.com",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    role: "member",
    title: "Support",
    slack_user_id: "U006",
    slack_team_id: "T001",
    account_id: "A001",
    is_active: false,
  },
  {
    id: 7,
    name: "Grace Lee",
    email: "grace.lee@example.com",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
    role: "admin",
    title: "HR Manager",
    slack_user_id: "U007",
    slack_team_id: "T001",
    account_id: "A001",
    is_active: true,
  },
  {
    id: 8,
    name: "Henry Adams",
    email: "henry.adams@example.com",
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
    role: "member",
    title: "Intern",
    slack_user_id: "U008",
    slack_team_id: "T001",
    account_id: "A001",
    is_active: true,
  },
  {
    id: 9,
    name: "Ivy Clark",
    email: "ivy.clark@example.com",
    avatar: "https://randomuser.me/api/portraits/women/9.jpg",
    role: "member",
    title: "Marketing",
    slack_user_id: "U009",
    slack_team_id: "T001",
    account_id: "A001",
    is_active: true,
  },
  {
    id: 10,
    name: "Jack Miller",
    email: "jack.miller@example.com",
    avatar: "https://randomuser.me/api/portraits/men/10.jpg",
    role: "admin",
    title: "CTO",
    slack_user_id: "U010",
    slack_team_id: "T001",
    account_id: "A001",
    is_active: true,
  },
  {
    id: 11,
    name: "Kathy Turner",
    email: "kathy.turner@example.com",
    avatar: "https://randomuser.me/api/portraits/women/11.jpg",
    role: "member",
    title: "Business Analyst",
    slack_user_id: "U011",
    slack_team_id: "T001",
    account_id: "A001",
    is_active: false,
  },
  {
    id: 12,
    name: "Leo Harris",
    email: "leo.harris@example.com",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    role: "member",
    title: "DevOps",
    slack_user_id: "U012",
    slack_team_id: "T001",
    account_id: "A001",
    is_active: true,
  },
  {
    id: 13,
    name: "Mona Scott",
    email: "mona.scott@example.com",
    avatar: "https://randomuser.me/api/portraits/women/13.jpg",
    role: "admin",
    title: "CEO",
    slack_user_id: "U013",
    slack_team_id: "T001",
    account_id: "A001",
    is_active: true,
  },
  {
    id: 14,
    name: "Nate Young",
    email: "nate.young@example.com",
    avatar: "https://randomuser.me/api/portraits/men/14.jpg",
    role: "member",
    title: "Frontend Developer",
    slack_user_id: "U014",
    slack_team_id: "T001",
    account_id: "A001",
    is_active: true,
  },
  {
    id: 15,
    name: "Olivia King",
    email: "olivia.king@example.com",
    avatar: "https://randomuser.me/api/portraits/women/15.jpg",
    role: "member",
    title: "Content Writer",
    slack_user_id: "U015",
    slack_team_id: "T001",
    account_id: "A001",
    is_active: true,
  },
];
</script>