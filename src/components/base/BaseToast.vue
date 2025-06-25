<template>
  <transition name="fade">
    <div
      v-if="visible"
      :class="[
        'fixed bottom-8 right-8 px-6 py-3 rounded shadow-lg text-white z-50 transition-all',
        bgClass
      ]"
      role="alert"
    >
      {{ text }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps<{
  text: string
  bgClass?: string // e.g. 'bg-green-600'
  show: boolean
  duration?: number // in ms, default 3000
}>()

const visible = ref(false)
let timeout: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.show,
  (val) => {
    if (val) {
      visible.value = true
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => {
        visible.value = false
      }, props.duration ?? 3000)
    } else {
      visible.value = false
      if (timeout) clearTimeout(timeout)
    }
  }
)

onUnmounted(() => {
  if (timeout) clearTimeout(timeout)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>