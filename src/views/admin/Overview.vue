<template>
  <header v-if="adminStore.teamSummary" class="grid grid-cols-2 md:grid-cols-2 2xl:mx-8 w-full items-stretch gap-6 mt-8">
    <HeadCard :title="adminStore?.teamSummary?.feedback_submitted_total || 0" description="Total feedback submitted">
      <Heart class="text-[#EB3B5A] min-w-10 h-auto " fill="currentColor" stroke="currentColor" />
    </HeadCard>
    <HeadCard title="92" description="Coaching alerts">
      <CircleAlert class="text-[#304cee] min-w-10 h-auto" stroke="white" fill="currentColor" />
    </HeadCard>
    <HeadCard :title="adminStore?.teamSummary?.feedback_requested_total || 0" description="Total feedback requested">
      <Smile class="text-lumy-green min-w-10 h-auto" stroke="currentColor" />
    </HeadCard>
    <HeadCard :title="constructiveAverageRounded || 0" description="Constructive feedback">
      <Settings class="text-[#d8ac19] min-w-10 h-auto" stroke="currentColor" />
    </HeadCard>
  </header>
  <section class="w-full flex items-center gap-8 mt-6">
    <div class="w-full bg-white rounded-xl shadow-lg p-6">
      <Line :data="lineData" :options="lineOptions" />
    </div>
    <div class="bg-white relative flex-1 rounded-xl shadow-md p-6">
      <Doughnut :data="sentScoreData" :options="sentScoreOptions" />
      <div class="absolute inset-0 flex flex-col items-center justify-end text-2xl font-bold" style="margin-top: 40px">
          <h2 class="font-bold text-5xl text-gray-700 ">{{ adminStore.teamSummary?.positive_feedback_percentage }}%</h2>
          <p class="text-gray-500 text-sm -mt-1">Positive sentiment</p>
      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
import HeadCard from '@/components/dashboard/HeadCard.vue';
import { Doughnut, Line } from 'vue-chartjs';
import { Chart, registerables } from 'chart.js';
import { CircleAlert, Heart, Smile, Settings } from 'lucide-vue-next';
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/adminStore';


Chart.register(...registerables);
const adminStore = useAdminStore();
const constructiveAverageRounded = computed(() =>
  Math.round(adminStore.teamSummary?.constructive_feedback_average ?? 0)
)
onMounted(async () => {
  await adminStore.getTeamSummary();
})

const lineData = computed(() => {
  const months = adminStore.teamSummary?.submitted_per_month.map(m => m.month) || [];
  const counts = adminStore.teamSummary?.submitted_per_month.map(m => m.count) || [];
  console.log('months + counts: ', months, counts)
  return {
    labels: months,
    datasets: [
      {
        label: "Feedback submitted",
        data: counts,
        borderColor: "#7c3aed", // lumy-purple
        backgroundColor: "rgba(124, 58, 237, 0.2)",
        tension: 0.3, // smooth curve
        fill: true,
        pointBackgroundColor: "#7c3aed",
      },
    ],
  };
});
const lineOptions = computed(() => {
  const counts = adminStore.teamSummary?.submitted_per_month?.map(m => m.count) || [];
  const maxY = Math.max(...counts, 0);
  return {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
    y: {
      beginAtZero: true,
      min: 0,
      max: maxY + 10,
      ticks: {
        stepSize: 1, // since count is usually whole numbers
      },
    },
  },
  }
});

const sentScoreData = computed(() => {
  return {
    datasets: [
      {
        data: [adminStore.teamSummary?.positive_feedback_percentage ?? 0, 100 - (adminStore.teamSummary?.positive_feedback_percentage ?? 0)],
        backgroundColor: ["#7FE47E", "#e5e7eb"],
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#FFFFF',
        cutout: "90%", // thickness of the arc
        circumference: 180, // half circle
        rotation: 270, // start at bottom center
      }
    ]
  }
});

const sentScoreOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        tooltip: { enabled: false },
        legend: { display: false },
    },
    animation: {
        animateRotate: false,
        animateScale: false
    }
};

</script>