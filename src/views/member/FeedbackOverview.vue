<template>
    <section class="flex flex-col md:flex-row w-full gap-6 lg:gap-8">
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
                    <span>Feedback Requested <i>({{ summary?.feedback_requested_count || 0 }})</i></span>
                </div>
                <div class="flex items-center space-x-2">
                    <span class="w-3 h-3 rounded-full bg-[#3b82f6]"></span>
                    <span>Feedback Received <i>({{ summary?.feedback_received_count || 0 }})</i></span>
                </div>
            </div>

        </div>
    </section>
    <section class="flex items-center w-full justify-between">
        <div class="flex gap-4 items-center bg-white shadow-md rounded-lg">
            <Listbox v-model="filteredSkill" >
                <Float
                placement="bottom"
                :flip="true"
                :offset="2"
                >
                <ListboxButton class="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-gray-50 focus:outline-none cursor-pointer">
                    <span class="block ">
                         Filter by Skill
                    </span>
                    <ChevronDown class="ml-2 size-4"/>
                </ListboxButton>
                    <ListboxOptions class="bg-white max-h-60 min-w-full shadow-lg p-2 overflow-y-auto">
                        <ListboxOption
                        v-for="s in summary?.skills_summary"
                        v-slot="{ active, selected }"
                        :key="s.skill_id"
                        :value="s.name"
                        class="cursor-pointer text-wrap hover:bg-purple-50"
                        >
                            <span :class="selected ? 'font-medium text-lumy-purple' : 'font-normal'">
                                {{ s.name }}
                            </span>
                        </ListboxOption>
                    </ListboxOptions>
                </Float>
            </Listbox>
            <Listbox v-model="filteredSubmitter">
                <Float
                placement="bottom-end"
                :flip="true"
                :offset="2"
                >
                <ListboxButton class="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-gray-50 focus:outline-none cursor-pointer">
                    <span class="block">
                        Filter by Peer
                    </span>
                    <ChevronDown class="ml-2 size-4"/>
                </ListboxButton>
                    <ListboxOptions class="bg-white max-h-60 min-w-full p-4 shadow-lg overflow-y-auto">
                        <ListboxOption
                        v-for="submitter in submitters"
                        v-slot="{ active, selected }"
                        :key="submitter.id"
                        :value="submitter.id"
                        class="cursor-pointer text-wrap hover:bg-purple-50"
                        >
                            <span :class="selected ? 'font-medium text-lumy-purple' : 'font-normal'">
                                {{ formatName(submitter.name) }}
                            </span>
                        </ListboxOption>
                    </ListboxOptions>
                </Float>
            </Listbox>
            <Listbox v-model="filteredSentiment">
                <Float
                placement="bottom-end"
                :flip="true"
                :offset="2"
                >
                    <ListboxButton class="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-gray-50 focus:outline-none cursor-pointer">
                        <span class="block">
                            Filter by Sentiment
                        </span>
                        <ChevronDown class="ml-2 size-4"/>
                    </ListboxButton>
                    <ListboxOptions class="bg-white min-w-full shadow-lg rounded-bl-lg rounded-br-lg max-h-60 p-4 overflow-y-auto w-full">
                        <ListboxOption
                        v-for="sentiment in ['positive', 'neutral', 'negative']"
                        v-slot="{ active, selected }"
                        :key="sentiment"
                        :value="sentiment"
                        class="cursor-pointer w-full text-wrap hover:bg-purple-50"
                        >
                            <span :class="selected ? 'font-medium text-lumy-purple' : 'font-normal'">
                                {{ formatName(sentiment) }}
                            </span>
                        </ListboxOption>
                    </ListboxOptions>
                </Float>
            </Listbox>
            <div v-if="filteredSentiment || filteredSkill || filteredSubmitter" class="bg-white shadow-md rounded-lg">
                <button @click="filteredSkill = null; filteredSubmitter = null; filteredSentiment = null" class="px-4 py-2 text-sm rounded-lg hover:bg-gray-50 cursor-pointer">
                    Clear Filters
                </button>
            </div>
        </div>
        <div class="flex gap-4 items-center bg-white shadow-md rounded-lg">
            <button class="cursor-pointer px-4 py-2 text-sm hover:bg-gray-50" @click="setFilter('received')">
                Received
            </button>
            <button class="cursor-pointer px-4 py-2 text-sm hover:bg-gray-50" @click="setFilter('given')">
                Given
            </button>
            <button class="cursor-pointer px-4 py-2 text-sm hover:bg-gray-50" @click="setFilter('requests')">
                Requests
            </button>
        </div>
    </section>
    <div v-if="filteredSentiment || filteredSkill || filteredSubmitter " class="flex w-full">
        <p class="text-sm">Filter by: <span class="ml-2" v-if="filteredSkill">Skill: {{ filteredSkill }}</span><span v-if="filteredSubmitter">, Peer: {{ formatName(feedbackList.find((f) => f.feedback_request?.recipient_id === filteredSubmitter)?.feedback_request?.recipient.name ?? '') }}</span>
            <span v-if="filteredSentiment">, Sentiment: {{ formatName(filteredSentiment) }}</span>
        </p>
    </div>
    <section class="flex flex-col lg:flex-row lg:flex-wrap justify-between w-full gap-8 space-y-8">
        <div v-if="feedbackList.length === 0" class="text-gray-500">No feedback available.</div>
        <div v-else-if="currentFilter !== 'requests'" v-for="feedback in filter" :key="feedback.id" class="flex flex-col justify-evenly bg-white shadow-md rounded-lg p-8 w-full gap-8 lg:max-w-[48%] xl:p-12 ">
            <p class="text-gray-800">{{ feedback.content }}</p>
            <div class=" flex flex-col w-full gap-8">
                <div v-if="currentFilter === 'given'" class="flex items-center gap-4">
                    <p class="text-gray-600 italic">To: </p>
                    <img
                        v-if="feedback.feedback_request?.sender.avatar"
                        :src="feedback.feedback_request?.sender.avatar"
                        alt="User Avatar"
                        class="w-10 h-10 rounded-full object-cover"
                    />
                    <div v-else class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span class="text-gray-500">No Image</span>
                    </div>
                    <p class="text-gray-600 italic">{{ feedback.feedback_request?.sender.name ? formatName(feedback.feedback_request?.sender.name) : '' }}</p>
                </div>
                <div v-if="currentFilter !== 'given'" class="flex items-center gap-4">
                    <p class="text-gray-600 italic">From:</p>
                    <img
                        v-if="feedback.feedback_request?.recipient.avatar"
                        :src="feedback.feedback_request?.recipient.avatar"
                        alt="User Avatar"
                        class="w-10 h-10 rounded-full object-cover"
                    />
                    <div v-else class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span class="text-gray-500">No Image</span>
                    </div>
                    <p class="text-gray-600 italic">{{ feedback.feedback_request?.recipient.name ? formatName(feedback.feedback_request?.recipient.name) : '' }}</p>
                </div>
                <div class="flex align-center gap-4">
                    <p class="font-thin text-gray-600">{{ feedback.feedback_request?.skill.skill }}</p>
                    <p class="font-thin text-sm ml-6">{{ formatFeedbackDate(feedback.created_at, { relative: true }) }}</p>
                    <span>
                        <template v-if="feedback.sentiment === 'positive'">
                            <Smile class="inline size-6 text-green-600"
                                @mouseenter="(e: MouseEvent) => handleMouseEnter(e, 'Positive sentiment')"
                                @mouseleave="handleMouseLeave"
                                />
                        </template>
                        <template v-else-if="feedback.sentiment === 'negative'">
                            <Frown class="inline size-6 text-red-600"
                            @mouseenter="(e: MouseEvent) => handleMouseEnter(e, 'Negative sentiment')"
                            @mouseleave="handleMouseLeave"
                            />
                        </template>
                        <template v-else>
                            <Annoyed class="inline size-6 text-yellow-600"
                            @mouseenter="(e: MouseEvent) => handleMouseEnter(e, 'Neutral sentiment')"
                            @mouseleave="handleMouseLeave"
                            />
                        </template>
                    </span>
                </div>
            </div>
        </div>
        <div v-if="currentFilter === 'requests'" v-for="req in feedbackReq" :key="req.id" class="flex flex-col justify-evenly bg-white shadow-md rounded-lg p-8 w-full gap-8 lg:max-w-[48%] xl:p-12 ">
            <p class="text-gray-800">{{ req.message ? req.message : '' }}</p>
            <div class=" flex flex-col w-full gap-8">
                <div class="flex items-center gap-4">
                    <img
                        v-if="req.recipient.avatar"
                        :src="req.recipient.avatar"
                        alt="User Avatar"
                        class="w-10 h-10 rounded-full object-cover"
                    />
                    <div v-else class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span class="text-gray-500">No Image</span>
                    </div>
                    <p class="text-gray-600 italic">To: {{ req.recipient.name }}</p>
                </div>
                <div class="flex items-center gap-4">
                    <p class="text-gray-600 text-sm">Status: {{ req.status }}</p>
                    <p class="font-thin text-sm">{{ formatFeedbackDate(req.created_at, { relative: true }) }}</p>
                </div>
            </div>
        </div>
    </section>
    <Tooltip
    :text="tooltipText"
    :x="tooltipX"
    :y="tooltipY"
    :visible="showTooltip"
    />
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import Tooltip from '@/components/base/Tooltip.vue';
import { Chart, registerables } from 'chart.js'
import { Doughnut } from 'vue-chartjs';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { Float } from '@headlessui-float/vue';
import { useUserStore } from '@/stores/userStore';
import { useFeedbackStore } from '@/stores/feedbackStore';
import { type UserSummary, type SkillSummary, type FeedbackSubmission, type FeedbackSubmissionFull, type FeedbackRequest, type FeedbackRequestEmbedded } from '@/types.ts';
import { ChevronDown, Smile, Annoyed, Frown, Check } from 'lucide-vue-next';
import { useDateFormat } from '@/composables/useDateFormat';
const { formatFeedbackDate } = useDateFormat();

type Submitter = {id: number, name: string, avatar: string, is_active: boolean}
Chart.register(...registerables);
const userStore = useUserStore();
const feedbackStore = useFeedbackStore();
const summary = ref<UserSummary | null>();
const feedbackList = ref<FeedbackSubmission[] | FeedbackSubmissionFull[]>([]);
const filteredSkill = ref<string | null>(null);
const filteredSubmitter = ref<number | null>(null);
const filteredSentiment = ref<string | null>(null);
const feedbackGiven = ref<FeedbackSubmissionFull[]>([]);
const feedbackReq = ref<FeedbackRequestEmbedded[]>([]);

const currentFilter = ref<'received' | 'given' | 'requests'>('received');
const setFilter = async(filter: 'received' | 'given' | 'requests') => {
    currentFilter.value = filter;
    if (filter === 'received') {
        feedbackList.value = feedbackStore.submissions;
    }
    if (filter === 'given') {
        feedbackList.value = feedbackStore.subsGiven;
    }
    if (filter === 'requests') {
        // Optionally handle requests filter

    }
}

const showTooltip = ref(false)
const tooltipText = ref('')
const tooltipX = ref(0)
const tooltipY = ref(0)

function handleMouseEnter(event: MouseEvent, text: string) {
  tooltipText.value = text
  tooltipX.value = event.clientX - 12 // offset for better positioning
  tooltipY.value = event.clientY + 12
  showTooltip.value = true
}
function handleMouseLeave() {
  showTooltip.value = false
}


const formatName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

onMounted(async () => {
    if (!summary.value) {
        await userStore.getMeSummary();
        summary.value = userStore.meSummary;
    }
    if (feedbackList.value.length < 1) {
        await feedbackStore.fetchSubmissions();
        feedbackList.value = feedbackStore.submissions;
        const feedbackReqRaw = feedbackStore.submissions.flatMap((sub) => sub.feedback_request) as FeedbackRequestEmbedded[]
        feedbackReq.value = feedbackReqRaw.filter((req) => req.type !== 'give')
    }
    if (feedbackGiven.value.length < 1) {
        await feedbackStore.getSubmissionsGiven();
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

});
const submitters = computed<Submitter[]>(() => {
  const map = new Map<number, Submitter>()
  for (const fb of feedbackList.value) {
    const r = fb.feedback_request?.recipient
    if (r && !map.has(r.id)) map.set(r.id, r)
  }
  return Array.from(map.values())
})
const filter = computed(() => {
  return feedbackList.value.filter(fb => {
    const matchesSkill =
      !filteredSkill.value ||
      fb.feedback_request?.skill.skill === filteredSkill.value;

    const matchesSubmitter =
      !filteredSubmitter.value ||
      fb.feedback_request?.recipient.id === filteredSubmitter.value;

    const matchesSentiment =
      !filteredSentiment.value || fb.sentiment === filteredSentiment.value;

    return matchesSkill && matchesSubmitter && matchesSentiment;
  });
});

const positiveSentiments = computed(() => {
    const positive = feedbackStore.submissions?.filter(fb => fb.sentiment === 'positive');
    const decimal = (positive.length / feedbackStore.submissions.length);
    return Number(decimal * 100).toFixed(0) as unknown as number;
})

// this will animate from 0 -> targetPercentage
const currentPercentage = ref(0);

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
    
    const total = feedbackGiven + feedbackRequested + feedbackReceived;
    return {
        datasets: [
            {
    label: 'Feedback Given',
    data: [feedbackGiven, total - feedbackGiven],
    backgroundColor: ['#9b5cff', '#e5e5e5'],
    borderWidth: 0,
    cutout: '65%',   // controls inner radius
    radius: '100%', // full size
  },
  {
    label: 'Feedback Requested',
    data: [feedbackRequested, total - feedbackRequested],
    backgroundColor: ['#60a5fa', '#f1f1f1'],
    borderWidth: 0,
    cutout: '45%',
    radius: '80%',
  },
  {
    label: 'Feedback Received',
    data: [feedbackReceived, total - feedbackReceived],
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