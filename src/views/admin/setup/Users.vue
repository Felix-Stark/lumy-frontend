<template>
	<div class="flex flex-col justify-center min-w-2xl h-full p-4">
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
	  <div v-if="loading" class="w-20 h-20 bg-purple-500"></div>
    <div v-if="users" class="flex flex-col items-center mt-3">
      <UserListItem
        v-for="user in users"
        :avatarUrl="user.avatar"
        :name="user.name"
        :title="user.title"
        v-model:role="user.role"
        :isActive="user.isActive"
        :id="user.id"
        @update:role="role => handleRoleChange(user.id, role)"
      />
    </div>
    <button
      class="bg-purple-500 hover:bg-purple-400 place-self-center min-w-3xs max-w-3xs mt-10 text-white font-bold py-2 px-4 rounded-md cursor-pointer transition duration-200 ease-in-out"
      @click="router.push('/admin/setup/skills')"
      >Next</button>
	</div>
</template>

<script setup lang="ts">
import UserListItem from '@/components/base/UserListItem.vue';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import api from '@/services/api.vue';
import { useUserStore } from '@/stores/userStore';
import type { User } from '@/types';
const userStore = useUserStore();
const users = ref<User[]>(userStore.users || []);
onMounted(async () => {
  loading.value = true;
  try {
    if(!userStore.account) {
      userStore.getUsers().finally(() => {
        loading.value = false;
      });
    }
    const response = await api.get('/users');
    users.value = response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    loading.value = false;
  }
});
const handleRoleChange = async (id: string, role: string) => {
  console.log(`Updating role for user ${id} to ${role}`);
  const updateRole = await api.patch(`/users/${id}`, {      
    role: role,
   });
}
const router = useRouter();
const loading = ref(false);


// const users = ref([
//   {
//     avatarUrl: "https://secure.gravatar.com/avatar/fa1137d973c97355a15665ef02eb0ff9.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0025-192.png",
//     email: "felix.b.stark@gmail.com",
//     id: "1",
//     name: "Felix Stark",
//     title: "Code monkey",
//     role: "admin",
//     isActive: true
//   },
//   {
//     avatarUrl: "https://secure.gravatar.com/avatar/fa1137d973c97355a15665ef02eb0ff9.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0025-192.png",
//     email: "felix.b.stark@gmail.com",
//     id: "3",
//     name: "Jack Sparrow",
//     title: "Pirate captain",
//     role: "member",
//     isActive: true
//   },
//   {
//     avatarUrl: "https://secure.gravatar.com/avatar/fa1137d973c97355a15665ef02eb0ff9.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0025-192.png",
//     email: "felix.b.stark@gmail.com",
//     id: "4",
//     name: "Hampus Vemvet",
//     title: "Okänd",
//     role: "member",
//     isActive: true
//   },
//   {
//     avatarUrl: "https://secure.gravatar.com/avatar/fa1137d973c97355a15665ef02eb0ff9.jpg?s=192&d=https%3A%2F%2Fa.slack-edge.com%2Fdf10d%2Fimg%2Favatars%2Fava_0025-192.png",
//     email: "felix.b.stark@gmail.com",
//     id: "5",
//     name: "Dr Gonzo",
//     title: "Journalist",
//     role: "admin",
//     isActive: true
//   },
//   {
//     avatarUrl: "https://avatars.slack-edge.com/2025-05-13/8894308249666_c06031f8a477492d2fcc_192.jpg",
//     email: "oscarklink@gmail.com",
//     id: "2",
//     name: "Oscar Klink",
//     title: "Backend wizard",
//     role: "admin",
//     isActive: true
//   }
// ])
</script>
