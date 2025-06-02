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
	  <section class="flex flex-col items-center mt-4 min-w-1/3 max-h-full overflow-auto">
      <UserListItem
      v-for="user in users"
      :key="user.id"
      :id="user.id"
      :avatarUrl="user.avatar"
      :name="user.name"
      :title="user.title"
      >
        <template #skillSelect>
          <div class="relative w-[15rem]" >
            <button
              class="border border-gray-300 bg-white text-gray-700 font-medium py-2 px-4 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 w-full flex items-center justify-between"
              @click="activeDropdown = activeDropdown === user.id ? '' : user.id"
              type="button"
            >
              {{ skillCounter(user.id) }}
              <span class="ml-2 text-lg ">&#9662;</span>
            </button>
            <div
              v-if="activeDropdown === user.id"
              class="absolute top-full left-0 w-full h-[15rem] overflow-auto bg-white z-10 border border-gray-300 rounded shadow"
              :ref="el => { if (el && dropdownRef.value) (dropdownRef.value as unknown as  Record<string, HTMLElement | null>)[user.id] = el as HTMLElement }"
            >
              <el-checkbox-group
                :model-value="getUserSkills(user.id)"
                @change="(val: string[]) => setUserSkills(user.id, val)"
                fill="oklch(62.7% 0.265 303.9)"
                class="flex flex-col w-full gap-2 p-2"
              >
                <el-checkbox-button
                  v-for="skill in skillOptions"
                  :key="skill.id"
                  :value="skill.id"
                  class="my-checkbox"
                  
                >
                  <span
                  @mouseenter="(event) => showTooltip(event, skill.definition)"
                  @mouseleave="hideTooltip"
                   class="relative w-full">
                    {{ skill.skill }}
                    <Tooltip
                      :text="skill.definition"
                      :x="tooltip.x"
                      :y="tooltip.y"
                      :visible="tooltip.visible"
                    />
                  </span>
                </el-checkbox-button>
              </el-checkbox-group>
            </div>
          </div>
        </template>
      </UserListItem>
	  </section>
	  <div v-if="loading" class="w-20 h-20 bg-purple-500"></div>
    <div v-if="users" class="flex flex-col items-center mt-3">
      
    </div>
    <button
      class="bg-purple-500 hover:bg-purple-400 place-self-center min-w-3xs max-w-3xs mt-10 text-white font-bold py-2 px-4 rounded-md cursor-pointer transition duration-200 ease-in-out"
      @click="router.push('/admin/setup/skills')"
      >Next</button>
	</div>
</template>

<style scoped>
:deep(.my-checkbox .el-checkbox-button__inner) {
  /* Optionally: */
  border-color: #a78bfa;
  color: #6d28d9;
}
:deep(.my-checkbox.is-checked .el-checkbox-button__inner) {
  background-color: #a78bfa; /* Checked color */
  color: #fff;
}
</style>

<script setup lang="ts">
import UserListItem from '@/components/base/UserListItem.vue';
import Tooltip from '@/components/base/Tooltip.vue';
import { useRouter } from 'vue-router';
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useUserStore } from '@/stores/userStore';
import type { User, Skill } from '@/types';
import type { Ref } from 'vue';
import api from '@/services/api';


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
const activeDropdown = ref<string | ''>('');
const tooltip = ref({
  text: '',
  x: 0,
  y: 0,
  visible: false
});
const dropdownRef = ref<Record<string, HTMLElement | null>>({})

onMounted(async() => {
  loading.value = true;
  document.addEventListener('mousedown', handleClickOutside);
  try {
    users.value = mockUsers; // Use mock data for users
    // Use mock data for skills
    // const sortedSkills = mockSkills.sort((a, b) => a.skill.localeCompare(b.skill));
    // skillOptions.value = sortedSkills; // Sort and set mock skills
    
    // Uncomment the following lines to fetch data from the API or store
    //---
    // Fetch users from the store
    await userStore.getUsers();
    users.value = userStore.users;
    // Fetch skills from the store

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

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

function handleClickOutside(event: MouseEvent) {
  // Only close if dropdown is open and click is outside the dropdown
  if (activeDropdown.value && dropdownRef.value) {
    const refEl = dropdownRef.value[activeDropdown.value];
    // Only proceed if refEl is not null
    if (refEl && !refEl.contains(event.target as Node)) {
      activeDropdown.value = '';
    }
  }
}

const skillCounter = (userId: string) => {
  const numSkills = selectedSkills.value.find(s => s.userId === userId)?.skillIds.length || 0;
  return numSkills > 0 ? `${numSkills} skills assigned` : 'Assign Skills';
}

function showTooltip(event: MouseEvent, text: string) {
  tooltip.value = {
    text,
    x: event.clientX + 10,
    y: event.clientY + 10,
    visible: true,
  };
}

function hideTooltip() {
  tooltip.value.visible = false;
}

function getUserSkills(userId: string): string[] {
  return selectedSkills.value.find(s => s.userId === userId)?.skillIds || [];
}

function setUserSkills(userId: string, skillIds: string[]) {
  const entry = selectedSkills.value.find(s => s.userId === userId);
  if (entry) {
    entry.skillIds = skillIds;
  } else {
    selectedSkills.value.push({ userId, skillIds });
  }
  console.log(`Skills for user ${userId} set to:`, skillIds);
}

function toggleSkill(userId: string, skillId: string) {
  const current = getUserSkills(userId);
  if (current.includes(skillId)) {
    setUserSkills(userId, current.filter(id => id !== skillId));
  } else {
    setUserSkills(userId, [...current, skillId]);
  }
}

let mockSkills: Skill[] = [
  {
    id: "1",
    skill: "Effective Communication",
    definition: "Clearly conveys information and ideas to individuals or groups.",
    theme: "interpersonal"
  },
  {
    id: "2",
    skill: "Team Leadership",
    definition: "Guides and motivates a group to achieve goals.",
    theme: "leadership"
  },
  {
    id: "3",
    skill: "Critical Thinking",
    definition: "Objectively analyzes and evaluates issues to form a judgment.",
    theme: "analytical thinking"
  },
  {
    id: "4",
    skill: "Problem Solving",
    definition: "Identifies and resolves complex problems in a timely manner.",
    theme: "analytical thinking"
  },
  {
    id: "5",
    skill: "Time Management",
    definition: "Effectively prioritizes tasks to maximize productivity.",
    theme: "execution"
  },
  {
    id: "6",
    skill: "Conflict Resolution",
    definition: "Handles disagreements constructively and diplomatically.",
    theme: "interpersonal"
  },
  {
    id: "7",
    skill: "Strategic Planning",
    definition: "Develops long-term strategies to achieve organizational goals.",
    theme: "leadership"
  },
  {
    id: "8",
    skill: "Attention to Detail",
    definition: "Ensures accuracy and thoroughness in all work.",
    theme: "execution"
  },
  {
    id: "9",
    skill: "Adaptability",
    definition: "Adjusts effectively to changing environments and demands.",
    theme: "interpersonal"
  },
  {
    id: "10",
    skill: "Decision Making",
    definition: "Makes timely and sound decisions even under pressure.",
    theme: "leadership"
  },
  {
    id: "11",
    skill: "Data Analysis",
    definition: "Interprets and draws conclusions from data sets.",
    theme: "analytical thinking"
  },
  {
    id: "12",
    skill: "Project Execution",
    definition: "Drives projects to completion efficiently and effectively.",
    theme: "execution"
  }
];

const mockUsers: User[] = [
  {
    id: "1",
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
    id: "2",
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
    id: "3",
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
    id: "4",
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
    id: "5",
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
    id: "6",
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
    id: "7",
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
    id: "8",
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
    id: "9",
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
    id: "10",
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
    id: "11",
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
    id: "12",
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
    id: "13",
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
    id: "14",
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
    id: "15",
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