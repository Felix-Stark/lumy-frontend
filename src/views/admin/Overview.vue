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
  <section id="chart-container" class="w-full flex items-center mt-6">
    <div class="w-2/3 bg-white rounded-xl shadow-lg">
      <Line :data="lineData" :options="lineOptions" />
    </div>
    <div class="bg-white rounded-xl shadow-md p-6">
      <Doughnut :data="sentScoreData" :options="sentScoreOptions" />
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
const counts = adminStore.teamSummary?.submitted_per_month?.map(m => m.count) || [];
const maxY = Math.max(...counts, 0);
const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
    tooltip: { enabled: true },
  },
  scales: {
    y: {
      beginAtZero: true,
      min: 0,
      max: maxY,
      ticks: {
        stepSize: 1, // since count is usually whole numbers
      },
    },
  },
};

const sentScoreData = computed(() => {
  return {
    datasets: [
      {
        data: [adminStore.teamSummary?.positive_feedback_percentage ?? 0, 100 - (adminStore.teamSummary?.positive_feedback_percentage ?? 0)],
        backgroundColor: ["#7FE47E", "#e5e7eb"],
        borderWidth: 0,
        borderRadius: 5,
        cutout: "80%", // thickness of the arc
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