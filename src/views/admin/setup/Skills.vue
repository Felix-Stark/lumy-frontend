<template>
	<div class="flex flex-col box-border min-w-2xl h-[75vh] p-4">
    <article class="flex flex-col items-center justify-center">
      <div class="flex flex-col items-center justify-center">
        <h1 class="font-inter font-semibold text-3xl text-center">One last thing! (I promise) Assign some skills.</h1>
        <p class="font-inter font-light text-center mt-2.5">
          Don't worry, you can also change these settings later on. This is just to get you set up.
        </p>
      </div>
    </article>
	  <section class="flex flex-col items-center mt-4 min-w-1/3 min-h-[50vh] max-h-full overflow-auto">
      <UserListItem
      v-for="user in users"
      :key="user.id"
      :id="user.id"
      :avatarUrl="user.avatar"
      :name="user.name"
      :title="user.title"
      >
        <template #skillSelect>
          <Listbox v-model="selectedSkillIds[user.id]" multiple class="w-full">
            <div>
              <ListboxButton class="border  border-gray-300 bg-white text-gray-700 font-medium py-2 px-4 rounded-md w-full flex items-center justify-between cursor-pointer">
                <span>
                  <template v-if="selectedSkillIds[user.id]?.length">
                    {{ selectedSkillIds[user.id].length }} skills
                  </template>
                  <template v-else>
                    Assign Skills
                  </template>
                </span>
                <ChevronDown class="ml-2 size-4" />
              </ListboxButton>
              <ListboxOptions
              class="absolute mt-1 w-[15rem] bg-white border border-gray-300 rounded shadow-lg z-10 max-h-60 overflow-auto">
                <ListboxOption
                v-for="skill in skillOptions"
                :key="skill.id"
                :value="skill.id"
                as="template"
                v-slot="{selected}"
                class="cursor-pointer select-none px-4 py-2 hover:bg-purple-100 flex flex-col"
                >
                <li :class="{
                  'text-purple-500 border-purple-500': selected,
                }">
                  <span class="font-medium">{{ skill.skill }}</span>
                  <span class="text-xs text-gray-500">{{ skill.definition }}</span>
                </li>
                </ListboxOption>
              </ListboxOptions>
            </div>
          </Listbox>
        </template>
      </UserListItem>
	  </section>
	  <div v-if="loading" class="w-20 h-20 bg-purple-500"></div>

    <button
      class="bg-purple-500 hover:bg-purple-400 place-self-center min-w-3xs max-w-3xs mt-10 text-white font-bold py-2 px-4 rounded-md cursor-pointer transition duration-200 ease-in-out"
      @click="postSkills"
      >Finish</button>
	</div>
</template>

<script setup lang="ts">
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue';
import UserListItem from '@/components/base/UserListItem.vue';
import Tooltip from '@/components/base/Tooltip.vue';
import { useRouter } from 'vue-router';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useUserStore } from '@/stores/userStore';
import type { User, Skill } from '@/types';
import type { Ref } from 'vue';
import api from '@/services/api';
import { ChevronDown, UserRoundIcon } from 'lucide-vue-next';


interface SkillPair {
  userId: string;
  skillIds: string[];
}
const router = useRouter();
const loading = ref(false);
const userStore = useUserStore();
const users = ref<User[]>();
const skillOptions = ref<Skill[]>([]);
const selectedSkills = ref<SkillPair[]>([]);
const selectedSkillIds = ref<Record<string, string[]>>({});
const tooltip = ref({
  text: '',
  x: 0,
  y: 0,
  visible: false
});

onMounted(async() => {
  loading.value = true;
  try {
    // users.value = mockUsers;
    // const sortedSkills = mockSkills.sort((a, b) => a.skill.localeCompare(b.skill));
    // skillOptions.value = sortedSkills; 
    
    // Uncomment the following lines to fetch data from the API or store
    //---
    // Fetch users from the store
    await userStore.getUsers();
    users.value = userStore.users;

    // Fetch skills from api
    const res = await api.get('/skills');
    if (res.status === 200) {
      skillOptions.value = res.data;
    } else {
      console.error("Failed to fetch skills:", res.statusText);
    }
    //---
  } catch (error) {
    console.error("Error fetching users or skills:", error);
  } finally {
    loading.value = false;
  }
})

const postSkills = async () => {
  const payload = Object.entries(selectedSkillIds.value)
  .flatMap(([userId, skillIds]) =>
    skillIds.map(skillId => ({
      user_id: userId,
      skill_id: skillId
    }))
  );
  for(const pair of payload) {
    try {
      await api.post(`/users/${pair.user_id}/skills/${pair.skill_id}`)
    } catch (error) {
      console.error(`Failed to assign skill ${pair.skill_id} to user ${pair.user_id}:`, error);
    }
  }
  userStore.getMe();
  if( userStore.me?.role === 'admin') {
    router.push({ name: 'admin-dashboard' });
  } else {
    router.push({ name: 'home' });
  }
}


let mockSkills: Skill[] = [
  {
    id: 1,
    skill: "Effective Communication",
    definition: "Clearly conveys information and ideas to individuals or groups.",
    theme: "interpersonal"
  },
  {
    id: 2,
    skill: "Team Leadership",
    definition: "Guides and motivates a group to achieve goals.",
    theme: "leadership"
  },
  {
    id: 3,
    skill: "Critical Thinking",
    definition: "Objectively analyzes and evaluates issues to form a judgment.",
    theme: "analytical thinking"
  },
  {
    id: 4,
    skill: "Problem Solving",
    definition: "Identifies and resolves complex problems in a timely manner.",
    theme: "analytical thinking"
  },
  {
    id: 5,
    skill: "Time Management",
    definition: "Effectively prioritizes tasks to maximize productivity.",
    theme: "execution"
  },
  {
    id: 6,
    skill: "Conflict Resolution",
    definition: "Handles disagreements constructively and diplomatically.",
    theme: "interpersonal"
  },
  {
    id: 7,
    skill: "Strategic Planning",
    definition: "Develops long-term strategies to achieve organizational goals.",
    theme: "leadership"
  },
  {
    id: 8,
    skill: "Attention to Detail",
    definition: "Ensures accuracy and thoroughness in all work.",
    theme: "execution"
  },
  {
    id: 9,
    skill: "Adaptability",
    definition: "Adjusts effectively to changing environments and demands.",
    theme: "interpersonal"
  },
  {
    id: 10,
    skill: "Decision Making",
    definition: "Makes timely and sound decisions even under pressure.",
    theme: "leadership"
  },
  {
    id: 11,
    skill: "Data Analysis",
    definition: "Interprets and draws conclusions from data sets.",
    theme: "analytical thinking"
  },
  {
    id: 12,
    skill: "Project Execution",
    definition: "Drives projects to completion efficiently and effectively.",
    theme: "execution"
  }
];

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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
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
    isActive: false,
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
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
    isActive: false,
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
  },
];
</script>