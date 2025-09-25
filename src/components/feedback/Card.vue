<template>
    <div class="flex flex-col justify-evenly bg-white shadow-md rounded-lg p-8 w-full gap-8 lg:max-w-[48%] xl:p-12 ">
            <p class="text-gray-800">{{ content }}</p>
            <div class=" flex flex-col w-full gap-8">
                <div class="flex items-center gap-4">
                    <img v-if="img"
                        :src="img"
                        alt="User Avatar"
                        class="w-10 h-10 rounded-full object-cover"
                    />
                    <div v-else class="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span class="text-gray-500">No Image</span>
                    </div>
                    <p class="text-gray-600 italic">{{ name }}</p>
                </div>
                <div class="flex align-center gap-4">
                    <p class="font-thin text-gray-600">{{ skill }}</p>
                    <p class="font-thin text-sm ml-6">{{ created_at ? formatFeedbackDate(created_at, { relative: true }) : '' }}</p>
                    <span>
                        <template v-if="sentiment && sentiment === 'positive'">
                            <Smile class="inline size-6 text-green-600"
                                @mouseenter="(e: MouseEvent) => handleMouseEnter(e, 'Positive sentiment')"
                                @mouseleave="handleMouseLeave"
                                />
                        </template>
                        <template v-if="sentiment && sentiment === 'negative'">
                            <Frown class="inline size-6 text-red-600"
                            @mouseenter="(e: MouseEvent) => handleMouseEnter(e, 'Negative sentiment')"
                            @mouseleave="handleMouseLeave"
                            />
                        </template>
                        <template v-if="sentiment && sentiment === 'neutral'">
                            <Annoyed class="inline size-6 text-yellow-600"
                            @mouseenter="(e: MouseEvent) => handleMouseEnter(e, 'Neutral sentiment')"
                            @mouseleave="handleMouseLeave"
                            />
                        </template>
                    </span>
                </div>
            </div>
        </div>
    <Tooltip
    :text="tooltipText"
    :x="tooltipX"
    :y="tooltipY"
    :visible="showTooltip"
    />
</template>
<script setup lang="ts">
import Tooltip from '../base/Tooltip.vue';
import { ref } from 'vue';
import { Smile, Annoyed, Frown } from 'lucide-vue-next';
import { useDateFormat } from '@/composables/useDateFormat';
const { formatFeedbackDate } = useDateFormat();

defineProps<{
    id?: string | number;
    content?: string;
    img?: string; //image url
    name?: string;
    skill?: string;
    sentiment?: string;
    created_at?: string;

}>();

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
</script>