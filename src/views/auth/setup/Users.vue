<template>
	<div class="flex flex-col box-border max-w-2xl w-full justify-center max-h-[75vh] p-4">
    <article class="flex flex-col items-center justify-center">
      <div class="flex flex-col items-center justify-center">
        <h1 class="font-inter font-semibold text-3xl text-center">Gotcha! What about users? Does this look good?</h1>
        <p class="font-inter font-light text-center mt-2.5">
          Don't worry, you can change these settings later on as well. This is just to get you set up.
        </p>
      </div>
    </article>
	  <section class="flex flex-col items-center justify-center mt-4">
	
	  </section>
    <div v-if="users" class="flex flex-col items-center mt-3 min-h-1/3 max-h-full overflow-auto">
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
    <button
      class="bg-purple-500 hover:bg-purple-400 place-self-center min-w-3xs max-w-3xs mt-10 text-white font-bold py-2 px-4 rounded-md cursor-pointer transition duration-200 ease-in-out"
      @click="updateUsers"
      >Next</button>
	</div>
</template>

<script setup lang="ts">
import PickUserComp from '@/components/setup/PickUserComp.vue';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import api from '@/services/api';

import { useUserStore } from '@/stores/userStore';
import type { SetUpUser, User } from '@/types';
import { useAuthStore } from '@/stores/authStore';

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();
const loading = ref(false);
const users = ref<SetUpUser[]>();

onMounted(async () => {
  loading.value = true;
  console.log('setup account in users: ', authStore.setupAccount);
  try {

    users.value = authStore.setupAccount?.users;
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    loading.value = false;
  }
});
const updateUsers = async () => {
  loading.value = true;
  users.value?.forEach(user => {
    userStore.updateUser(user.id, { ...user, is_active: user.is_active, role: user.role });
  })
  verifyAccount();
}
async function verifyAccount() {
  const accountId = authStore.setupAccount?.id;
  if (!accountId) {
    console.error('No account ID found');
    return;
  } else {
    const verified = await authStore.verifyAccount(accountId);
    if (verified) {
      console.log('Account verified successfully');
      router.push({ name: 'admin.setup.framework' });
    } else {
      console.error('Account verification failed');
    }
  }
}


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
