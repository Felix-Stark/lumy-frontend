<template>
    <section class="flex flex-col md:flex-row w-full gap-6">
        <div class="bg-white shadow-lg rounded-lg p-8 w-full flex justify-center items-center">
            <div class="relative h-48">
                <Doughnut :data="data" :options="options" />
                <!-- Center text -->
                <div class="absolute inset-0 flex flex-col items-center justify-end text-2xl font-bold" style="margin-top: 40px">
                    <h2 class="font-bold text-5xl text-gray-700 ">{{ currentPercentage }}%</h2>
                    <p class="text-gray-500 text-sm -mt-1">Positive sentiment</p>
                </div>
            </div>

        </div>
        <div class="bg-white relative flex items-center justify-between gap-8 shadow-md rounded-lg p-8 w-full">
            <div class="h-48">
                <Doughnut :data="allTimeData" :options="allTimeOptions" />
            </div>
            <!-- Legend -->
            <div class="text-sm space-y-2">
                <div class="flex items-center space-x-2">
                    <span class="w-3 h-3 rounded-full bg-lumy-purple"></span>
                    <span>Feedback Given <i>({{ summary?.feedback_given_count || 0 }})</i></span>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="w-3 h-3 rounded-full bg-[#60a5fa]"></span>
                    <span>Feedback Requested <i>({{ summary?.feedback_requested_count }})</i></span>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="w-3 h-3 rounded-full bg-[#3b82f6]"></span>
                    <span>Feedback Received <i>({{ summary?.feedback_received_count || 0 }})</i></span>
                </div>
            </div>

        </div>
    </section>
    <section class="flex justify-between items-center">
        <div class="flex gap-4 items-center bg-white shadow-md rounded-lg">
            <Listbox>
                <Float
                placement="bottom-start"
                :flip="true"
                :offset="4"
                >
                <ListboxButton class="flex items-center px-4 py-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lumy-purple">
                    <span class="block ">
                         Filter by Skill
                    </span>
                    <ChevronDown class="ml-2 size-4"/>
                </ListboxButton>
                    <ListboxOptions v-model="filteredSkill" class="max-h-60 overflow-y-auto">
                        <ListboxOption
                        v-for="s in summary?.skills_summary"
                        :key="s.skill_id"
                        :value="s.name"
                        class="cursor-pointer text-wrap hover:bg-purple-50"
                        >
                            {{ s.name }}
                        </ListboxOption>
                    </ListboxOptions>
                </Float>
            </Listbox>
            <Listbox v-model="filteredSubmitter">
                <Float>
                <ListboxButton class="flex items-center px-4 py-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lumy-purple">
                    <span>
                        Filter by Peer
                    </span>
                    <ChevronDown class="ml-2 size-4"/>
                </ListboxButton>
                    <ListboxOptions>
                        <ListboxOption
                        v-for="submitter in submitters"
                        :key="submitter.id"
                        :value="submitter"
                        class="cursor-pointer text-wrap hover:bg-purple-50"
                        >
                            {{ submitter.name }}
                        </ListboxOption>
                    </ListboxOptions>
                </Float>
            </Listbox>
            <Listbox v-model="filteredSentiment">
                <ListboxButton class="flex items-center px-4 py-2 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lumy-purple">
                    <span>
                        Filter by Sentiment
                    </span>
                    <ChevronDown class="ml-2 size-4"/>
                </ListboxButton>
                <Float>
                    <ListboxOptions>
                        <ListboxOption
                        v-for="sentiment in ['positive', 'neutral', 'negative']"
                        :key="sentiment"
                        :value="sentiment"
                        class="cursor-pointer text-wrap hover:bg-purple-50"
                        >
                            {{ sentiment }}
                        </ListboxOption>
                    </ListboxOptions>
                </Float>
            </Listbox>
        </div>

    </section>
    <section class="flex flex-col lg:flex-row lg:flex-wrap justify-evenly w-full mt-6">
        <div v-if="feedbackList.length === 0" class="text-gray-500">No feedback available.</div>
        <div v-else v-for="feedback in feedbackList" :key="feedback.id" class="flex flex-col bg-white shadow-md rounded-lg p-8 w-full lg:max-w-2/5">
            <p class="font-light text-sm text-gray-600">{{ feedback.feedback_request?.recipient }}</p>
            <p class="text-gray-800">{{ feedback.content }}</p>
            <div class="mt-2 text-sm text-gray-500 flex justify-between">
                <span>Sentiment: <strong :class="feedback.sentiment === 'positive' ? 'text-green-600' : feedback.sentiment === 'negative' ? 'text-red-600' : 'text-yellow-600'">{{ feedback.sentiment }}</strong></span>
                <span>{{ formatFeedbackDate(feedback.created_at, { relative: false}) }}</span>
            </div>
        </div>
    </section>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { Chart, registerables } from 'chart.js'
import { Doughnut } from 'vue-chartjs';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { Float } from '@headlessui-float/vue';
import { useUserStore } from '@/stores/userStore';
import { useFeedbackStore } from '@/stores/feedbackStore';
import type { UserSummary, SkillSummary, FeedbackSubmission } from '@/types.ts';
import { ChevronDown } from 'lucide-vue-next';
import { useDateFormat } from '@/composables/useDateFormat';
const { formatFeedbackDate } = useDateFormat();

type Submitter = {id: number, name: string, avatar: string, is_active: boolean}
Chart.register(...registerables);
const userStore = useUserStore();
const feedbackStore = useFeedbackStore();
const summary = ref<UserSummary | null>();
const feedbackList = ref<FeedbackSubmission[]>([]);
const filteredSkill = ref<string | null>(null);
const filteredSubmitter = ref<Submitter | null>(null);
const filteredSentiment = ref<string | null>(null);
const submitters = computed(() => {
    return feedbackList.value.map(fb => fb.feedback_request?.recipient) as Submitter[];
});
const filter = computed(() => {
   switch (true) {
    case filteredSkill.value !== null:
        return feedbackList.value.filter(fb => fb.feedback_request?.skill.skill === filteredSkill.value);
    case filteredSubmitter.value !== null:
        return feedbackList.value.filter(fb => fb.feedback_request?.recipient.id === filteredSubmitter.value?.id);
    case filteredSentiment.value !== null:
        return feedbackList.value.filter(fb => fb.sentiment === filteredSentiment.value);
    default:
        return feedbackList.value;
   }
})

const positiveSentiments = computed(() => {
    const positive = feedbackList.value.filter(fb => fb.sentiment === 'positive');
    console.log('positive array: ', positive);
    const decimal = (positive.length / feedbackList.value.length);
    return Number(decimal * 100).toFixed(0) as unknown as number;
})

// this will animate from 0 -> targetPercentage
const currentPercentage = ref(0);

onMounted(async () => {
    if (!summary.value) {
        await userStore.getMeSummary();
        summary.value = userStore.meSummary;
    }
    if (feedbackStore.submissions.length === 0) {
        await feedbackStore.fetchSubmissions();
        feedbackList.value = feedbackStore.submissions;
    }
    console.log('Feedback List:', feedbackList.value);
    console.log('summary: ', summary.value);
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

});

const data = computed(() => {
    return {
        datasets: [
            {
                data: [positiveSentiments.value, 100 - positiveSentiments.value],
                backgroundColor: ["#7FE47E", "#e5e7eb"], // green + gray
                borderWidth: 0,
                borderRadius: 5,
                cutout: "70%", // thickness of the arc
                circumference: 180, // half circle
                rotation: 270, // start at bottom center
            },
        ],
    };
});

const options = {
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


const allTimeData = computed(() => {
    if (!summary.value) return { datasets: [] }

    const feedbackRequested = summary.value?.feedback_requested_count || 0;
    const feedbackGiven = summary.value.feedback_given_count || 0
    const feedbackReceived = summary.value.feedback_received_count || 0
    const all = [feedbackGiven, feedbackRequested, feedbackReceived]
    const rawMax = Math.max(...all, 10) // avoid 0
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)))
    const roundedMax = Math.ceil(rawMax / magnitude) * magnitude

    return {
        datasets: [
            {
    label: 'Feedback Given',
    data: [feedbackGiven, roundedMax - feedbackGiven],
    backgroundColor: ['#9b5cff', '#e5e5e5'],
    borderWidth: 0,
    cutout: '65%',   // controls inner radius
    radius: '100%', // full size
  },
  {
    label: 'Feedback Requested',
    data: [feedbackRequested, roundedMax - feedbackRequested],
    backgroundColor: ['#60a5fa', '#f1f1f1'],
    borderWidth: 0,
    cutout: '45%',
    radius: '80%',
  },
  {
    label: 'Feedback Received',
    data: [feedbackReceived, roundedMax - feedbackReceived],
    backgroundColor: ['#2563eb', '#f5f5f5'],
    borderWidth: 0,
    cutout: '25%',
    radius: '60%',
  }
        ]
    }
})


const allTimeOptions = {
    responsive: true,
    plugins: {
        legend: {
            display: false,
        },
    },
    animation: {
        animateRotate: true,
        animateScale: false,
        duration: 1500,
    },
}


</script>