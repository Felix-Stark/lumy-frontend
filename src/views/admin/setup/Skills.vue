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