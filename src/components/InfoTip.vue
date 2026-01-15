<template>
  <span
    class="rounded-full"
    tabindex="0"
    @mouseenter="(e: MouseEvent) => onEnter(e)"
    @mouseleave="onLeave"
    role="button"
    aria-label="Info"
  >
    <Info class="text-gray-300 w-3 h-3" />
  </span>

  <Tooltip
    :visible="showTool"
    :text="text"
    :x="tooltipX || 0"
    :y="tooltipY || 0"
  />
</template>

<script setup lang="ts">
import Tooltip from './base/Tooltip.vue';
import { Info } from 'lucide-vue-next';
import { ref, watch } from 'vue';

const props = defineProps<{
  text: string;
}>();
const tooltipX = ref(0)
const tooltipY = ref(0)
const showTool = ref(false)

function onEnter(e: MouseEvent) {
  showTool.value = true;
    tooltipX.value = e.clientX - 12 // offset for better positioning
    tooltipY.value = e.clientY + 12
}

function onLeave() {
  showTool.value = false;
}
</script>