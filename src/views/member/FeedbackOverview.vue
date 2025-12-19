<template>
    <FeedbackSkeleton v-if="initLoading" />
        <section class="flex flex-col md:flex-row w-full gap-6 lg:gap-8 my-12 lg:my-20">
            <div class="bg-white shadow-lg rounded-lg p-8 w-full flex justify-center items-center">
                <div v-if="currentPercentage" class="relative h-48">
                    <Doughnut :data="data" :options="options" />
                    <!-- Center text -->
                    <div class="absolute inset-0 flex flex-col items-center justify-end text-2xl font-bold" style="margin-top: 40px">
                        <h2 class="font-bold text-5xl text-gray-700 ">{{ currentPercentage }}%</h2>
                        <p class="text-gray-500 text-sm -mt-1">Positive sentiment</p>
                    </div>
                </div>
                <div class="text-center" v-else>
                    <h3 class="text-lg">You haven't received any feedback yet</h3>
                    <p>Go to your overview, click on a skill and request some feedback to get started. You can also do this in Slack</p>
                    
                </div>
            </div>
            <div class="bg-white relative flex items-center justify-between gap-8 shadow-md rounded-lg p-8 w-full">
                <div class="h-48">
                    <Doughnut :data="allTimeData" :options="allTimeOptions" />
                </div>
                <!-- Legend -->
                <div class="text-sm space-y-2">
                    <div class="flex items-center space-x-2">
                        <span class="w-3 h-3 rounded-full bg-[#60a5fa]"></span>
                        <span>Feedback Requested <i>({{ summary?.feedback_requested_count || 0 }})</i></span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="w-3 h-3 rounded-full bg-[#3b82f6]"></span>
                        <span>Feedback Received <i>({{ summary?.feedback_received_count || 0 }})</i></span>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="w-3 h-3 rounded-full bg-lumy-purple"></span>
                        <span>Feedback Given <i>({{ summary?.feedback_given_count || 0 }})</i></span>
                    </div>
                </div>
            </div>
        </section>
        <section class="flex items-center w-full justify-between">
            <!-- <div class="flex gap-4 items-center bg-white shadow-md rounded-lg">
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
                        <ListboxOptions class="bg-white max-h-60 shadow-lg rounded-bl-lg rounded-br-lg p-2 overflow-y-auto">
                            <ListboxOption
                            v-for="s in summary?.skills_summary"
                            v-slot="{ active, selected }"
                            :key="s.skill_id"
                            :value="s.name"
                            class="cursor-pointer text-wrap p-2 hover:bg-purple-50 w-full"
                            >
                                <span :class="selected ? 'font-sm text-lumy-purple' : 'font-sm'">
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
                        <ListboxOptions class="bg-white max-h-60 p-2 shadow-lg rounded-bl-lg rounded-br-lg overflow-y-auto">
                            <ListboxOption
                            v-for="submitter in submitters"
                            v-slot="{ active, selected }"
                            :key="submitter.id"
                            :value="submitter.id"
                            class="cursor-pointer text-wrap p-2 hover:bg-purple-50 w-full"
                            >
                                <span :class="selected ? 'font-sm text-lumy-purple' : 'font-sm'">
                                    {{ formatName(submitter.name) }}
                                </span>
                            </ListboxOption>
                        </ListboxOptions>
                    </Float>
                </Listbox>
                <Listbox v-if="currentFilter !== 'requests'" v-model="filteredSentiment">
                    <Float
                    placement="bottom"
                    :flip="true"
                    :offset="2"
                    >
                        <ListboxButton class="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-gray-50 focus:outline-none cursor-pointer">
                            <span class="block">
                                Filter by Sentiment
                            </span>
                            <ChevronDown class="ml-2 size-4"/>
                        </ListboxButton>
                        <ListboxOptions class="bg-white bottom-2 shadow-lg rounded-bl-lg rounded-br-lg max-h-60 p-2 overflow-auto">
                            <ListboxOption
                            v-for="sentiment in ['positive', 'neutral', 'negative']"
                            v-slot="{ active, selected }"
                            :key="sentiment"
                            :value="sentiment"
                            class="cursor-pointer w-full text-wrap p-2 hover:bg-purple-50"
                            >
                                <span :class="selected ? 'font-sm text-lumy-purple' : 'font-sm'">
                                    {{ formatName(sentiment) }}
                                </span>
                            </ListboxOption>
                        </ListboxOptions>
                    </Float>
                </Listbox>
                <Listbox v-if="currentFilter === 'requests'" v-model="filteredStatus">
                    <Float
                    placement="bottom-end"
                    :flip="true"
                    :offset="2"
                    >
                        <ListboxButton class="flex items-center px-4 py-2 text-sm rounded-lg hover:bg-gray-50 focus:outline-none cursor-pointer">
                            <span class="block">
                                Filter by Status
                            </span>
                            <ChevronDown class="ml-2 size-4"/>
                        </ListboxButton>
                        <ListboxOptions class="bg-white shadow-lg rounded-bl-lg rounded-br-lg max-h-60 p-2 overflow-y-auto w-full">
                            <ListboxOption
                            v-for="status in ['answered', 'pending']"
                            v-slot="{ active, selected }"
                            :key="status"
                            :value="status"
                            class="cursor-pointer w-full text-wrap p-2 hover:bg-purple-50"
                            >
                                <span :class="selected ? 'font-medium text-lumy-purple' : 'font-normal'">
                                    {{ formatName(status) }}
                                </span>
                            </ListboxOption>
                        </ListboxOptions>
                    </Float>
                </Listbox>
                <div v-if="filteredSentiment || filteredSkill || filteredSubmitter" class="bg-white rounded-lg">
                    <button @click="filteredSkill = null; filteredSubmitter = null; filteredSentiment = null; filteredStatus = null;" class="px-4 py-2 text-sm rounded-lg hover:bg-gray-50 cursor-pointer">
                        Clear Filters
                    </button>
                </div>
            </div> -->
            <div class="flex gap-4 items-center bg-white shadow-md rounded-lg">
                <button :class="['cursor-pointer px-4 py-2 text-sm hover:bg-gray-300 rounded-lg', currentFilter === 'received' ? 'bg-lumy-secondary text-white' : '']" @click="setFilter('received')">
                    Received
                </button>
                <button :class="['cursor-pointer px-4 py-2 text-sm hover:bg-gray-300 rounded-lg', currentFilter === 'given' ? 'bg-lumy-secondary text-white' : '']" @click="setFilter('given')">
                    Given
                </button>
                <button :class="['cursor-pointer px-4 py-2 text-sm hover:bg-gray-300 rounded-lg', currentFilter === 'requests' ? 'bg-lumy-secondary text-white' : '']" @click="setFilter('requests')">
                    Requests
                </button>
            </div>
        </section>
        <div v-if="filteredSentiment || filteredSkill || filteredSubmitter " class="flex gap-2 w-full">
            <p class="text-sm">Filter by: </p><span class="ml-2 bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full" v-if="filteredSkill">Skill: {{ filteredSkill }}</span><span v-if="filteredSubmitter" class="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">Peer: {{ filterPeersList }}</span><span v-if="filteredSentiment" class="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">Sentiment: {{ formatName(filteredSentiment) }}</span><span v-if="filteredStatus" class="bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full">Status: {{ formatName(filteredStatus) }}</span>
        </div>
        <div v-else class="flex flex-col items-center gap-6 w-full lg:my-10">
        <section class="flex flex-col lg:flex-row lg:flex-wrap justify-between w-full gap-8 space-y-8">
            <div v-if="currentFilter === 'received' && filter.length === 0" class="text-gray-500">
                No feedback available.
            </div>
            <div v-if="currentFilter === 'given' && peerFilter.length === 0" class="text-gray-500">
                No feedback available.
            </div>
            <div v-if="currentFilter === 'requests' && reqFilter.length === 0" class="text-gray-500">
                No feedback available.
            </div>

            <Card v-if="currentFilter === 'received'" v-for="feedback in filter"
            :id="feedback?.id"
            :content="feedback?.content"
            :img="feedback?.feedback_request?.recipient.avatar"
            :name="feedback?.feedback_request?.recipient.name ? 'From: '+formatName(feedback.feedback_request.recipient.name) : ''"
            :skill="feedback?.feedback_request?.skill.skill"
            :created_at="feedback?.created_at"
            :sentiment="feedback?.sentiment"
            />
            <Card v-if="currentFilter === 'given'" v-for="feedback in peerFilter"
            :id="feedback?.id"
            :content="feedback?.content"
            :img="feedback?.feedback_request?.sender.avatar"
            :name="feedback?.feedback_request?.sender.name ? 'To: '+formatName(feedback.feedback_request.sender.name) : ''"
            :skill="feedback?.feedback_request?.skill.skill"
            :created_at="feedback?.created_at"
            :sentiment="feedback?.sentiment"
            />
            <Card v-if="currentFilter === 'requests'" v-for="req in reqFilter"
            :id="req.id"
            :content="req.message"
            :img="req.recipient.avatar"
            :name="'To: '+formatName(req.recipient.name)"
            :skill="req.skill.skill"
            :created_at="req.created_at"
            :updated_at="req.updated_at"
            :status="req.status"
            />
        </section>
    </div>
</template>

<script lang="ts" setup>
import FeedbackSkeleton from '@/components/skeletons/FeedbackSkeleton.vue';
import { computed, ref, onMounted } from 'vue'
import Card from '@/components/feedback/Card.vue';
import { Chart, registerables } from 'chart.js'
import { Doughnut } from 'vue-chartjs';
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { Float } from '@headlessui-float/vue';
import { useUserStore } from '@/stores/userStore';
import { useFeedbackStore } from '@/stores/feedbackStore';
import { type UserSummary, type FeedbackSubmission, type FeedbackSubmissionFull, type FeedbackRequest } from '@/types.ts';
import { ChevronDown } from 'lucide-vue-next';

type Submitter = {id: number, name: string, avatar: string, is_active: boolean}
Chart.register(...registerables);
const initLoading = ref(true);
const userStore = useUserStore();
const feedbackStore = useFeedbackStore();
const summary = ref<UserSummary | null>();
const feedbackList = ref<Partial <FeedbackSubmission[]> | FeedbackSubmissionFull[]>([]);
const filteredSkill = ref<string | null>(null);
const filteredSubmitter = ref<number | null>(null);
const filteredSentiment = ref<string | null>(null);
const filteredStatus = ref<string | null>(null)
const feedbackGiven = ref<FeedbackSubmissionFull[]>([]);
const feedbackReq = ref<FeedbackRequest[]>([]);
const formatName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
}
const submitters = computed<Submitter[]>(() => {
  const map = new Map<number, Submitter>()
  if (currentFilter.value === 'received') {
    for (const fb of feedbackList.value) {
    const r = fb?.feedback_request?.recipient
    if (r && !map.has(r.id)) map.set(r.id, r)
    }
  }
  if (currentFilter.value === 'given') {
    for (const fb of feedbackStore.subsGiven) {
        const r = fb?.feedback_request?.sender
        if (r && !map.has(r.id)) map.set(r.id, r)
    }
  }
  if (currentFilter.value === 'requests') {
    for (const fb of feedbackReq.value) {
        const r = fb?.recipient
        if (r && !map.has(r.id)) map.set(r.id, r)
    }
  }
  return Array.from(map.values())
});

const filterPeersList = computed(() => {
    if (currentFilter.value === 'given') {
        return formatName(feedbackStore.subsGiven.find((f) => f?.feedback_request?.sender.id === filteredSubmitter.value)?.feedback_request?.sender.name ?? '')
    }
    if (currentFilter.value === 'received') {
        return formatName(feedbackList.value.find((f) => f?.feedback_request?.recipient.id === filteredSubmitter.value)?.feedback_request?.recipient.name ?? '');
    };
    if (currentFilter.value === 'requests') {
        return formatName(feedbackReq.value.find((f) => f?.recipient.id === filteredSubmitter.value)?.recipient.name ?? '');
    };
})

onMounted(async () => {
    try {
        if (!summary.value) {
        await userStore.getMeSummary();
        summary.value = userStore.meSummary;
        }
        if (feedbackList.value.length < 1) {
            await feedbackStore.fetchSubmissions();
            feedbackList.value = feedbackStore.submissions;
        }
        if (feedbackGiven.value.length < 1) {
            await feedbackStore.getSubmissionsGiven();
        }
        if(feedbackReq.value.length < 1) {
            await feedbackStore.getRequests();
            feedbackReq.value = feedbackStore.requests;
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
    } catch (err: any) {
        console.error('Error fetching feedback data: ', err);
    } finally {
        initLoading.value = false;
    }
});
// FILTERS
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
        feedbackReq.value = feedbackStore.requests
    }
}

const reqFilter = computed(() => {
  const results = feedbackReq.value.filter(fb => {
    const matchesSkill =
      !filteredSkill.value ||
      fb?.skill.skill === filteredSkill.value;

    const matchesSubmitter =
      !filteredSubmitter.value ||
      fb?.recipient.id === filteredSubmitter.value;

    const matchesStatus =
      !filteredStatus.value || fb?.status === filteredStatus.value;

    return matchesSkill && matchesSubmitter && matchesStatus;
  });
  return results.slice().sort((a, b) => {
    const aTime = a?.created_at ? new Date(a.created_at).getTime() : 0;
    const bTime = b?.created_at ? new Date(b.created_at).getTime() : 0;
    return bTime - aTime;
  });
});
const filter = computed(() => {
  const results = feedbackList.value.filter(fb => {
    const matchesSkill =
      !filteredSkill.value ||
      fb?.feedback_request?.skill.skill === filteredSkill.value;

    const matchesSubmitter =
      !filteredSubmitter.value ||
      fb?.feedback_request?.recipient.id === filteredSubmitter.value;

    const matchesSentiment =
      !filteredSentiment.value || fb?.sentiment === filteredSentiment.value;

    return matchesSkill && matchesSubmitter && matchesSentiment;
  });
  return results.slice().sort((a, b) => {
    const aTime = a?.created_at ? new Date(a.created_at).getTime() : 0;
    const bTime = b?.created_at ? new Date(b.created_at).getTime() : 0;
    return bTime - aTime;
  });
});
const peerFilter = computed(() => {
  const results = feedbackStore.subsGiven.filter(fb => {
    const matchesSkill =
      !filteredSkill.value ||
      fb?.feedback_request?.skill.skill === filteredSkill.value;

    const matchesSubmitter =
      !filteredSubmitter.value ||
      fb?.feedback_request?.sender.id === filteredSubmitter.value;

    const matchesSentiment =
      !filteredSentiment.value || fb?.sentiment === filteredSentiment.value;

    return matchesSkill && matchesSubmitter && matchesSentiment;
  });
  return results.slice().sort((a, b) => {
    const aTime = a?.created_at ? new Date(a.created_at).getTime() : 0;
    const bTime = b?.created_at ? new Date(b.created_at).getTime() : 0;
    return bTime - aTime;
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
                label: 'Feedback Requested',
                data: [feedbackRequested, total - feedbackRequested],
                backgroundColor: ['#60a5fa', '#f1f1f1'],
                borderWidth: 0,
                cutout: '65%',
                radius: '100%',
            },
            {
                label: 'Feedback Received',
                data: [feedbackReceived, total - feedbackReceived],
                backgroundColor: ['#2563eb', '#f5f5f5'],
                borderWidth: 0,
                cutout: '45%',
                radius: '80%',
            },
            {
                label: 'Feedback Given',
                data: [feedbackGiven, total - feedbackGiven],
                backgroundColor: ['#9b5cff', '#e5e5e5'],
                borderWidth: 0,
                cutout: '25%',   // controls inner radius
                radius: '60%', // full size
            },
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