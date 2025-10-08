<template>
  <transition name="slide">
    <div
      v-if="show"
      :class="[
        'fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded shadow-lg text-white z-50 transition-all',
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
/* slide in from slightly left of centered position, slide out to the right of centered position */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.28s cubic-bezier(.2,.8,.2,1), opacity 0.28s ease;
}

/* start slightly left of centered and invisible */
.slide-enter-from {
  transform: translateX(calc(-50% - 20px)); /* keep the -50% centering and shift left */
  opacity: 0;
}
.slide-enter-to {
  transform: translateX(-50%); /* centered */
  opacity: 1;
}

/* leave from centered */
.slide-leave-from {
  transform: translateX(-50%);
  opacity: 1;
}
/* slide out to the right while preserving centering baseline */
.slide-leave-to {
  transform: translateX(calc(-50% + 20px)); /* move right from centered */
  opacity: 0;
}
/* .fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
} */
</style>