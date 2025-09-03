<template>
  <header class="grid grid-cols-2 md:grid-cols-2 2xl:mx-8 w-full items-stretch gap-6 mt-8">
    <HeadCard
      title="12,000"
      description="Feedback submited"
      @onAction="() => {}"
    >
        <Heart class="text-[#EB3B5A] min-w-10 h-auto " fill="currentColor" stroke="currentColor" />
    </HeadCard>
    <HeadCard
      title="80%"
      description="Feedback submited"
      @onAction="() => {}"
    >
        <Laugh class="text-[#38ff06] min-w-10 h-auto"  stroke="currentColor" />
    </HeadCard>
    <HeadCard
      title="15%"
      description="Constructive feedback"
      @onAction="() => {}"
    >
        <Settings class="text-[#d8ac19] min-w-10 h-auto" stroke="currentColor" />
    </HeadCard>
    <HeadCard
      title="92"
      description="Coaching alerts"
      @onAction="() => {}"
    >
        <CircleAlert class="text-[#304cee] min-w-10 h-auto" stroke="white" fill="currentColor" />
    </HeadCard>
  </header>
  <section id="chart-container" class="w-full h-full mt-6">
    <div class="bg-white rounded-xl shadow-md p-6">
      <p class="text-sm text-gray-500">Feedback submited</p>
      <div id="chart" class="w-full h-full mt-6">
        <BarChart />
      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
import HeadCard from '@/components/dashboard/HeadCard.vue';
import BarChart from '@/components/charts/BarChart.vue';
import { CircleAlert, Heart, Laugh, Settings } from 'lucide-vue-next';
</script>