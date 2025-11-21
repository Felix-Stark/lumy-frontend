<template>
<div class="w-3 h-3  rounded-full">
    <button class="rounded-full bg-white">
        <Info class="text-gray-300" />
    </button>
</div>
</template>

<script setup lang="ts">
import Tooltip from './base/Tooltip.vue';
import { Info } from 'lucide-vue-next';

defineProps<{

}>();

</script>