<template>
    <div class="flex flex-col justify-between w-full bg-white p-8  rounded-xl shadow-md">
        <article class="flex flex-col gap-8 md:w-1/2">
            <h1 class="font-thin text-2xl text-gray-500">Intelligence settings</h1>
            <div class="flex flex-col gap-4 w-full pl-8 pb-6 border-l border-gray-300">
                <p class="font-thin py-2 text-sm">Toggle AI coaching</p>
                <Switch
                    v-model="toggleCoaching"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-lumy-purple focus:ring-offset-2"
                    :class="toggleCoaching ? 'bg-lumy-green' : 'bg-gray-200'"
                >
                    <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    :class="toggleCoaching ? 'translate-x-6' : 'translate-x-1'"
                    />
                </Switch>
                <p class="font-thin py-2 text-sm">Toggle AI coaching</p>
                <Switch
                    v-model="toggleSuggestions"
                    class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-lumy-purple focus:ring-offset-2"
                    :class="toggleSuggestions ? 'bg-lumy-green' : 'bg-gray-200'"
                >
                    <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    :class="toggleSuggestions ? 'translate-x-6' : 'translate-x-1'"
                    />
                </Switch>
            </div>

        </article>

    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Switch } from '@headlessui/vue'

const toggleCoaching = ref(false);
const toggleSuggestions = ref(false);

onMounted(() => {

})

</script>