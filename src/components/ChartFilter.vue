<template>
  <div class="flex items-center gap-6 py-2 px-4">
    <button
      v-for="filter in filters"
      :key="filter.value"
      @click="emit('update:selectedFilter', filter.value)"
      :class="[
        'rounded-lg shadow-md px-4 py-2 cursor-pointer',
        selectedFilter === filter.value ? 'bg-lumy-secondary text-white' : 'bg-white text-lumy-secondary'
      ]"
    >
      {{ filter.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  selectedFilter: string;
}>();

const emit = defineEmits<{
  (e: 'update:selectedFilter', value: string): void;
}>();

const filters = [
  { value: 'month', label: '30 days' },
  { value: 'quarter', label: 'Quarter' },
  { value: 'year', label: 'Year' }
];
</script>