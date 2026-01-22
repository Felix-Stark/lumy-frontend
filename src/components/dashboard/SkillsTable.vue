<template>
    <div class="overflow-x-auto">
				<table class="min-w-full rounded-lg">
					<thead>
						<tr>
						<th class="px-6 py-4 text-left font-thin text-gray-500">Skill</th>
						<th class="px-6 py-4 text-left font-thin text-gray-500">Sentiment</th>
						<th class="px-6 py-4 text-left font-thin text-gray-500"># of feedback</th>
						<th class="px-6 py-4 text-left font-thin text-gray-500">Last feedback received</th>
						</tr>
					</thead>
					<tbody>
						<tr
						v-for="skill in skillsSummary"
						:key="skill.skill_id"
						class="hover:bg-gray-50 "
						@click="selectedSkill(skill)"
						>
							<td class="px-6 py-4">{{ skill.name }}</td>

							<td v-if="skill.average_sentiment >= 0.60" class="px-6 py-4 text-green-500">
								Strong
							</td>
							<td v-else-if="skill.average_sentiment > 0.40 && skill.average_sentiment < 0.60" class="px-6 py-4 text-yellow-500">
								Medium
							</td>
							<td v-else-if="skill.average_sentiment === 0" class="px-6 py-4 text-gray-500">
								No feedback
							</td>
							<td v-else class="px-6 py-4 text-red-500">
								Weak
							</td>

							<td class="px-6 py-4">{{ skill.feedback_count }}</td>
							<td class="px-6 py-4">
								{{ skill.last_feedback_received ? formatFeedbackDate(skill.last_feedback_received) : 'None' }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
</template>

<script setup lang="ts">
import type { SkillSummary } from '@/types';
import { useDateFormat } from '@/composables/useDateFormat';
const { formatFeedbackDate } = useDateFormat();

defineProps<{
    skillsSummary?: SkillSummary[];
}>()

function selectedSkill(skill: SkillSummary) {
	// sessionStorage.setItem('selectedSkill', JSON.stringify(skill));
	// router.push({ name: 'overview-member-skill' });
}
</script>