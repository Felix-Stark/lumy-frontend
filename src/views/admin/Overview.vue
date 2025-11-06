<template>
	<DashSkeleton v-if="loading === true" :isOpen="loading" />
	<div v-else class="flex flex-col items-center gap-6 w-full">
  <header v-if="adminStore.teamSummary" class="grid grid-cols-2 md:grid-cols-2 2xl:mx-8 w-full items-stretch gap-6 mt-8">
    <HeadCard :title="adminStore.teamSummary?.feedback_submitted_total || 0" description="Total feedback submitted">
      <Heart class="text-[#EB3B5A] min-w-10 h-auto " fill="currentColor" stroke="currentColor" />
    </HeadCard>
    <HeadCard :title="adminStore.teamSummary?.feedback_requested_total" description="Total feedback requested">
      <CircleAlert class="text-[#304cee] min-w-10 h-auto" stroke="white" fill="currentColor" />
    </HeadCard>
    <HeadCard :title="adminStore.teamSummary?.positive_feedback_percentage+'%' || 0" description="Positive feedback">
      <Smile class="text-lumy-green min-w-10 h-auto" stroke="currentColor" />
    </HeadCard>
    <HeadCard :title="constructiveAverageRounded || 0" description="Constructive feedback">
      <Settings class="text-[#d8ac19] min-w-10 h-auto" stroke="currentColor" />
    </HeadCard>
  </header>
  <section class="w-full flex  items-center gap-8 mt-6">
    <div class="w-full bg-white rounded-lg shadow-md self-stretch h-100 p-6">
      <Line :data="lineData" :options="lineOptions" />
    </div>
    <!-- <div class="bg-white shadow-lg rounded-lg p-8  w-1/3">
        <div class="relative">
            <Doughnut :data="sentScoreData" :options="sentScoreOptions" />
            <div class="absolute inset-0 flex flex-col items-center justify-end text-2xl font-bold">
                <h2 class="font-bold text-5xl text-gray-700 ">{{ currentPercentage }}%</h2>
                <p class="text-gray-500 text-sm -mt-1">Positive sentiment</p>
            </div>
        </div>
    </div> -->
  </section>
  <section class="flex flex-col items-center gap-8 w-full">
    <Combobox>
      <div class="relative w-full px-8">
        <ComboboxInput
          class="border p-2 border-gray-300 outline-lumy-purple w-full rounded-lg"
          placeholder="Search user or pick from list"
          :displayValue="() => query"
          @change="query = $event.target.value"
        />
        <button @click="clearQuery" class="rounded-full absolute right-10 mt-[10px] cursor-pointer">
          <XCircleIcon class="text-gray-500" />
        </button>
      </div>
    </Combobox>
    <div v-if="users" class="flex flex-col gap-8 items-center w-full">
      <DashUser
      v-for="u in filteredUsers"
      :id="u.user_id"
      :avatarUrl="u.avatar"
      :name="u.name"
      :sentSum="u.manager_summary"
      :avgSent="u.average_sentiment_word"
      @setEmployee="() => selectedEmployee(u)"
      />
    </div>
  </section>
</div>
</template>

<script setup lang="ts">
import {
    Combobox,
    ComboboxInput,
  } from '@headlessui/vue';
import DashSkeleton from '@/components/skeletons/DashSkeleton.vue';
import { XCircleIcon } from 'lucide-vue-next';
import HeadCard from '@/components/dashboard/HeadCard.vue';
import DashUser from '@/components/dashboard/DashUser.vue';
import { Doughnut, Line } from 'vue-chartjs';
import { Chart, registerables } from 'chart.js';
import { CircleAlert, Heart, Smile, Settings } from 'lucide-vue-next';
import { ref, computed, onMounted } from 'vue';
import { useAdminStore } from '@/stores/adminStore';
import type { User } from '@/types';
import { useRouter } from 'vue-router'; 

const router = useRouter();

Chart.register(...registerables);
const loading = ref(true);
const adminStore = useAdminStore();
const constructiveAverageRounded = computed(() =>
  Math.round(adminStore.teamSummary?.constructive_feedback_average ?? 0)
);
const currentPercentage = ref(0);
const positiveSentiments = computed(() => adminStore.teamSummary?.positive_feedback_percentage || 0);
const users = computed(() => adminStore.teamUsers)
onMounted(async () => {
  try {
    await adminStore.getTeamSummary();
    await adminStore.getTeamUsers();
  } catch (err:any) {
    console.error('Error loading admin overview data: ', err);
  } finally {
    loading.value = false;
  }
  let progress = 0;
    const duration = 1000; // 1 second animation
    const step = 16; // ~60fps
    const increment = positiveSentiments.value / (duration / step);

    const interval = setInterval(() => {
        progress += increment;
        if (progress >= positiveSentiments.value) {
            currentPercentage.value = positiveSentiments.value;
            clearInterval(interval);
        } else {
            currentPercentage.value = Math.round(progress);
        }
    }, step);
})
const query = ref('');
const filteredUsers = computed(() => {
    return query.value === ''
        ? users.value
        : users.value.filter((user) => {
            return user.name.toLowerCase().includes(query.value.toLowerCase());
        });
});
const clearQuery = () => {
  query.value = '';
};

function selectedEmployee(user: Partial<User>) {
  sessionStorage.setItem('employee', JSON.stringify(user))
  router.push({ name: 'admin-overview-employee' });
}

const lineData = computed(() => {
  const months = adminStore.teamSummary?.submitted_per_month.map(m => m.month) || [];
  const counts = adminStore.teamSummary?.submitted_per_month.map(m => m.count) || [];
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
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
    y: {
      beginAtZero: true,
      max: Math.ceil(maxY * 1.2),
      ticks: {
        stepSize: 1, // since count is usually whole numbers
      },
    },
  },
  }
});


</script>