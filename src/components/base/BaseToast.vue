<template>
  <transition name="fade">
    <div
      v-if="show"
      :class="[
        'fixed bottom-8 mx-auto px-6 py-3 rounded shadow-lg text-white z-50 transition-all',
        bgClass
      ]"
      role="alert"
    >
      {{ text }}
    </div>
  </transition>
</template>

<script setup lang="ts">
// import this where needed set props for text and show. Toast will automatically close after 3 seconds unless duration is set. Change bgClass to set background color.
import { watch, onUnmounted, onMounted } from 'vue'

const props = defineProps<{
  text: string
  bgClass?: string // e.g. 'bg-green-600'
  show: boolean
  duration?: number // in ms, default 3000
}>()

const emit = defineEmits(['close'])
let timeout: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  if (props.show && props.duration) {
    timeout = setTimeout(() => {
      // Emit an event to close the toast after the duration
      emit('close')
    }, props.duration ?? 3000)
  }
})

const clear = () => {
  if (timeout) clearTimeout(timeout)
  timeout = null
}

watch(
  () => props.show,
  (val) => {
    clear()
    if (val) {
      timeout = setTimeout(() => {
        emit('close')
      }, props.duration ?? 3000)
    }
  }
)

onUnmounted(clear)

</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>