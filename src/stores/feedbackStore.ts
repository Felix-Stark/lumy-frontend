import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "../services/api.ts";
import type { FeedbackSubmission, FeedbackSubmissionFull } from "../types.ts";

export const useFeedbackStore = defineStore("feedback", () => {
  const submissions = ref<FeedbackSubmission[]>([]);
  const subsGiven = ref<FeedbackSubmissionFull[]>([])
  const loading = ref(false);

  async function fetchSubmissions() {
    loading.value = true;
    try {
      const res = await api.get("/submissions");
      if (res.status === 200) {
        submissions.value = res.data;
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      loading.value = false;
    }
  }

  async function getSubmissionsGiven() {
    loading.value = true;
    try {
      const res = await api.get('/submissions_given');
      if(res.status === 200) {
        subsGiven.value = res.data;
      }
    } catch (err:any) {
      console.error('Error in getSubmissionsGiven: ', err)
    }
  }

  return {
    submissions,
    loading,
    subsGiven,
    fetchSubmissions,
    getSubmissionsGiven,
  };
});