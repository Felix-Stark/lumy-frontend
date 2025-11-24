<template>
  <div
    class="w-3 h-3 rounded-full"
    tabindex="0"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @focus="onEnter"
    @blur="onLeave"
    role="button"
    aria-label="Info"
  >
    <Info class="text-gray-300" />
  </div>

  <Tooltip
    :visible="visible"
    :text="text"
    :x="xAlign || 0"
    :y="yAlign || 0"
  />
</template>

<script setup lang="ts">
import Tooltip from './base/Tooltip.vue';
import { Info } from 'lucide-vue-next';
import { ref, watch } from 'vue';

const props = defineProps<{
  text: string;
  showTool?: boolean;
  xAlign?: number;
  yAlign?: number;
}>();

const emit = defineEmits<{
  (e: 'update:showTool', val: boolean): void;
}>();

// local visible state, sync with optional prop and emit updates for v-model:showTool
const visible = ref<boolean>(props.showTool ?? false);

watch(() => props.showTool, (v) => {
  if (typeof v === 'boolean') visible.value = v;
});

function onEnter() {
  visible.value = true;
  emit('update:showTool', true);
}

function onLeave() {
  visible.value = false;
  emit('update:showTool', false);
}
</script>