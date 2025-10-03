<template>
    <div class="w-full grid grid-cols-3 auto-rows-fr gap-8">
        <TeamCard
        v-for="m in adminStore.managers"
        :avatar="m.manager.avatar"
        :teamLead="m.manager.name"
        :role="m.manager.role"
        :numberOfDR="m.employees.length"
        btnText="Manage team"
        @manage-team="triggerModal(m.manager)"
        />
    </div>
    <Dialog :open="isOpen" @close="() => isOpen = false" class="relative z-50">
		<div class="fixed inset-0 bg-black/30" aria-hidden="true" />
		<div class="fixed inset-0 flex w-screen items-center justify-center p-4">
			<DialogPanel class="w-full flex flex-col gap-6 max-w-lg max-h-150 overflow-auto rounded-lg bg-white p-8">
				<DialogTitle class="text-2xl font-semibold">Manage direct reports for: {{ selectedManager?.name }}</DialogTitle>
				<DialogDescription>
				    Set which employees report to this manager
				</DialogDescription>
                <hr class="w-full border border-gray-300"/>
                <div class="flex flex-col gap-6 w-full">
                    <Combobox>
                        <div class="relative w-full">
                            <ComboboxInput
                            class="border p-2 border-gray-300  outline-lumy-purple w-full rounded-lg"
                            placeholder="Search user or pick from list"
                            :displayValue="() => query"
                            @change="query = $event.target.value"
                            />
                            <button @click="clearQuery" class="rounded-full absolute right-2 mt-[10px] cursor-pointer">
                            <XCircleIcon class="text-gray-500" />
                            </button>
                        </div>
                    </Combobox>
                    <div v-for="u in filteredUsers" class="flex items-center justify-between w-full">
                        <p>{{ u.name }}</p>
                        <p class="text-thin text-gray-600">Current manager: {{ findManager(u.manager_id || 0) }}</p>
                        <button :disabled="loading" v-if="u.manager_id" @click="unAssign(u.id)" class="text-sm bg-lumy-danger px-4 py-2 text-white rounded-lg cursor-pointer">Remove</button>
                        <button v-else :disabled="loading" @click="assign(u.id)" class="text-sm bg-lumy-green px-4 py-2 text-white rounded-lg cursor-pointer">Assign</button>
                    </div>
                    <BaseToast
                        text="Changes saved successfully!"
                        bgClass="bg-green-500"
                        :show="success"
                        :duration="3000"
                        @close="success = false"
                    />
                </div>
			</DialogPanel>
	    </div>
	</Dialog>
</template>

<script setup lang="ts">
import {
	  Dialog,
	  DialogPanel,
	  DialogTitle,
	  DialogDescription,
      Combobox,
      ComboboxInput
	} from '@headlessui/vue'
import { ref, computed, onMounted } from 'vue';
import TeamCard from '@/components/settings/TeamCard.vue';
import BaseToast from '@/components/base/BaseToast.vue';
import { useAdminStore } from '@/stores/adminStore';
import { useUserStore } from '@/stores/userStore';
import type { User } from '@/types';
import api from '@/services/api';

const userStore = useUserStore();
const adminStore = useAdminStore();
const selectedManager = ref<User>();
const isOpen = ref(false)
const query = ref('');
const success = ref(false);
const loading = ref(false)
const users = computed<User[]>(() => userStore.users)
const filteredUsers = computed<User[]>(() => {
    return query.value === ''
        ? users.value
        : users.value.filter((user: User) => {
            return user.name.toLowerCase().includes(query.value.toLowerCase());
        });
});
const clearQuery = () => {
  query.value = '';
};
onMounted( async() => {
    await adminStore.getManagers();
    await userStore.getUsers(false);
})

function triggerModal(manager: User) {
    selectedManager.value = manager;
    isOpen.value = true
}

const findManager = (id: number) => {
    const cm = adminStore.managers?.find(m => m.manager.id === id);
    if(cm) {
        return cm.manager.name
    } else { return 'Not assigned'}
};

async function assign(id: number) {
    loading.value = true;
    try {
        const res = await api.patch(`/users/${id}/manager`, { "manager_id": selectedManager.value?.id});
        if (res.status === 200) {
            await userStore.getUsers(false);
        }
        console.log('assign res: ', res);
        console.log('id: ', id);
        console.log('manager id: ', selectedManager.value?.id);
    } catch(err: any) {
        console.error('Unable to assign employee: ', err);
    } finally {
        loading.value = false
    }
}
async function unAssign(id: number) {
    loading.value = true;
    try {
        const res = await api.patch(`/users/${id}/manager`, { "manager_id": null });
        if (res.status === 200) {
            await userStore.getUsers(false);
            success.value = true;
        }
    } catch(err:any) {
        console.error('Unable to unassign employee: ', err);
    } finally {
        loading.value = false;
    }
}
</script>