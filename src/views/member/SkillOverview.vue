<template>
    <RequestModal v-if="showReqModal === true" @close="closeModal" />
    <section class="flex justify-between items-center mb-6 w-full">
        <h1 class="font-thin text-2xl text-lumy-secondary">Skill: <span class="font-normal text-lumy-purple">{{ formatName(activeSkill.name) }}</span></h1>
        <BaseButton
            :onAction="() => showReqModal = true"
            btnText="Request feedback"
        />
    </section>
    <section v-if="skillOv?.skill_stale" class="w-full p-8 flex justify-center items-center bg-lumy-danger rounded-lg shadow-md"><div class="rounded-full border-2 mr-2 flex justify-center items-center border-white font-semibold size-6 text-white text-lg">!</div><p class="text-white">It's been a while since you showed this skill some love — go request some fresh feedback!</p></section>
    <section class="w-full bg-white p-8 xl:p-12 text-gray-800 rounded-lg shadow-md">
        <p class="text-xl font-gray-600">{{ skillOv?.skill_definition }}</p>
    </section>
    <section class="flex flex-col items-center w-full bg-white text-gray-800 p-8 xl:p-12 rounded-lg shadow-md">
        <h2 class="text-xl self-start mb-8">Average total sentiment over time</h2>
        <div class="w-full">
            <Line :data="avgSentChart" :options="avgSentOptions" />
        </div>
    </section>
    <section class="flex flex-col justify-center items-center gap-4 w-full 2xl:flex-row bg-white p-8 xl:p-12 rounded-lg shadow-md">
        <div class="w-full h-12">
            <Bar :data="sentOvData" :options="sentOvOptions" />
        </div>
        <div class="flex">
            <div class="flex flex-col items-center mx-4">
                <p class="font-thin">
                    Negative
                </p>
                <div class="flex">
                    <Frown :class="['text-lumy-danger-light size-6']" />
                    <p class="font-thin text-lg text-gray ml-2">{{ skillSent.negSent }}</p>
                </div>
            </div>
            <div class="flex flex-col items-center mx-4">
                <p class="font-thin">
                    Neutral
                </p>
                <div class="flex">
                    <Annoyed :class="['text-lumy-neutral-light size-6']" />
                    <p class="font-thin text-lg text-gray ml-2">{{ skillSent.neuSent }}</p>
                </div>
            </div>
            <div class="flex flex-col items-center mx-4">
                <p class="font-thin">
                    Positive
                </p>
                <div class="flex">
                    <Smile :class="['text-lumy-green-light size-6']" />
                    <p class="font-thin text-lg text-gray ml-2">{{ skillSent.posSent }}</p>
                </div>
            </div>
            <div class="flex flex-col items-center mx-4">
                <p class="font-thin">
                    Total
                </p>
                <p class="font-thin text-lg text-gray">{{ skillSent.total }}</p>
            </div>
            
        </div>
    </section>
    <section class="flex flex-col lg:flex-row lg:flex-wrap justify-between w-full gap-8 space-y-8">
        <div v-if="feedbackList?.length === 0" class="text-gray-500">No feedback available.</div>
        <Card v-else v-for="feedback in feedbackList"
        :id="feedback?.id"
        :content="feedback?.content"
        :img="feedback?.feedback_request?.recipient.avatar"
        :name="feedback?.feedback_request?.recipient.name ? 'From: '+formatName(feedback.feedback_request.recipient.name) : ''"
        :skill="feedback?.feedback_request?.skill.skill"
        :created_at="feedback?.created_at"
        :sentiment="feedback?.sentiment"
        />
    </section>
    <BaseToast 
    :text="toastText" 
    :show="showToast" 
    :bgClass="toastBg"
    :duration="3000"
    />
</template>

<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
import BaseToast from '@/components/base/BaseToast.vue';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import type { SkillSummary, SkillOverview, FeedbackSubmission } from '@/types';
import { Line, Bar } from 'vue-chartjs';
import { Chart, registerables, type ChartOptions } from 'chart.js'
import { useRouter } from 'vue-router';
import { formatName } from '@/composables/formatName';
import api from '@/services/api';
import { Annoyed, Frown, Smile } from 'lucide-vue-next';
import { useDateFormat } from '@/composables/useDateFormat';
import { useErrorStore } from '@/stores/errorStore';
import Card from '@/components/feedback/Card.vue';
import RequestModal from '@/components/feedback/RequestModal.vue';

const errorStore = useErrorStore();
const { formatFeedbackDate } = useDateFormat();
Chart.register(...registerables);
const router = useRouter();
const toastText = ref('');
const showToast = ref(false);
const toastBg = ref('bg-lumy-green')
const activeSkill = computed<SkillSummary>(() => {
    return JSON.parse(sessionStorage.getItem('selectedSkill') || '{}');
});
const feedbackList = ref<FeedbackSubmission[]>();
const showReqModal = ref<boolean>(false);
const skillOv = ref<SkillOverview | null>(null);

onMounted(async() => {
   try {
        if (activeSkill.value && activeSkill.value.skill_id) {
            const response = await api.get(`/me/skill/${activeSkill.value.skill_id}`);
            if (response.status === 200) {
                skillOv.value = response.data;
                feedbackList.value = response.data.feedback_received;
            }
        } else {
            router.push({name:'member-overview'});
        }
    } catch (error) {
        console.error('Error fetching skill overview:', error);
        router.push('/member/overview');
    }
});

function closeModal() {
    showReqModal.value = false;
    toastText.value = 'Feedback request sent!';
    showToast.value = true;
}

const skillSent = computed(() => {
    const total = skillOv.value?.submission_counts.total || 0;
    const negSent = skillOv.value?.submission_counts.by_sentiment.negative || 0;
    const neuSent = skillOv.value?.submission_counts.by_sentiment.neutral || 0;
    const posSent = skillOv.value?.submission_counts.by_sentiment.positive || 0;
    return { negSent, neuSent, posSent, total };
})

const sentOvData = computed(() => {
    

    return {
        labels: ["Sentiments"],
        datasets: [
            {
                label: 'Negative',
                backgroundColor: 'rgba(252, 92, 101, 1)',
                data: [skillSent.value.total ? (skillSent.value.negSent / skillSent.value.total) * 100 : 0],
                borderRadius: 5
            },
            {
                label: 'Neutral',
                backgroundColor: 'rgba(255, 195, 110, 1)',
                data: [skillSent.value.total ? (skillSent.value.neuSent / skillSent.value.total) * 100 : 0],
                borderRadius: 5
            },
            {
                label: 'Positive',
                backgroundColor: 'rgba(127, 228, 126, 1)',
                data: [skillSent.value.total ? (skillSent.value.posSent / skillSent.value.total) * 100 : 0],
                borderRadius: 5
            }
        ]
    }
});

const sentOvOptions: ChartOptions<"bar"> = {
    indexAxis: "y" as const, // horizontal
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }, // hide default legend
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.raw as number}%`,
      },
    },
  },
  scales: {
    x: {
      stacked: true,
      display: false, // hide axis
      min:0,
      max:100,
    },
    y: {
      stacked: true,
      display: false, // hide axis
      ticks: {
        callback: (val: string | number) => `${val}%`,
      },
    },
  },
}

const avgSentChart = computed(() => {
    const avgSent = skillOv.value?.avg_sentiment || {};
	return {
		labels: Object.keys(avgSent), // e.g. ["2025-07", "2025-08", ...]
		datasets: [
			{
				label: 'Average Sentiment',
				data: Object.values(avgSent), // e.g. [0.8, 0.85, ...]
				fill: false,
				borderColor: 'rgba(150, 45, 255, 1)',
				borderDash: [ 5, 5 ],
				tension: 0.4
			}
		]
	};
})

const avgSentOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: { display: false },
    title: { display: false }
  },
  scales: {
    y: {
      min: 0,
      max: 10,
      ticks: { stepSize: 2 }
    }
  }
};

onUnmounted(() => {
    sessionStorage.removeItem('selectedSkill');
})

</script>