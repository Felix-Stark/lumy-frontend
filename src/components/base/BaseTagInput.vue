<template>
  <div class="flex flex-col gap-2">
    <label v-if="label" class="text-sm text-gray-400">{{ label }}</label>
    <div
      class="flex flex-wrap gap-2 items-center border border-gray-300 rounded p-2 bg-white focus-within:border-lumy-purple transition-all"
      @click="focusInput"
    >
      <span
        v-for="(tag, index) in modelValue"
        :key="index"
        class="bg-lumy-purple/10 text-lumy-purple px-2 py-1 rounded-full text-sm flex items-center gap-1"
      >
        {{ tag }}
        <button
          type="button"
          class="hover:text-red-500"
          @click.stop="removeTag(index)"
        >
          ✕
        </button>
      </span>

      <textarea
        rows="1"
        ref="inputRef"
        v-model="inputValue"
        @keydown.enter.prevent="addTag"
        @keydown.tab.prevent="addTag"
        @keydown.delete="handleDelete"
        placeholder="Add a trait and press Enter"
        class="p-2 rounded border text-gray-600 border-gray-300 w-full outline-lumy-purple"
      />
    </div>
    <p v-if="hint" class="text-xs text-gray-400">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

interface Props {
  modelValue: string[]
  label?: string
  hint?: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue'])

const inputValue = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

const addTag = async () => {
  const value = inputValue.value.trim()
  if (value && !props.modelValue.includes(value)) {
    emit('update:modelValue', [...props.modelValue, value])
  }
  inputValue.value = ''
  await nextTick()
  inputRef.value?.focus()
}

const removeTag = (index: number) => {
  const updated = [...props.modelValue]
  updated.splice(index, 1)
  emit('update:modelValue', updated)
}

const handleDelete = () => {
  if (inputValue.value === '' && props.modelValue.length > 0) {
    removeTag(props.modelValue.length - 1)
  }
}

const focusInput = () => {
  inputRef.value?.focus()
}
</script>
