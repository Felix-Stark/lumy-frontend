import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "../services/api.ts";
import { type FeedbackRequest, type FeedbackSubmission, type FeedbackSubmissionFull } from "../types.ts";

export const useFeedbackStore = defineStore("feedback", () => {
  const submissions = ref<FeedbackSubmission[]>([]);
  const subsGiven = ref<FeedbackSubmissionFull[]>([]);
  const requests = ref<FeedbackRequest[]>([]);
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
  };

  async function getSubmissionsGiven() {
    loading.value = true;
    try {
      const res = await api.get('/submissions_given');
      if(res.status === 200) {
        subsGiven.value = res.data;
      }
    } catch (err:any) {
      console.error('Error in getSubmissionsGiven: ', err)
    } finally {
      loading.value = false;
    }
  };

  async function getRequests() {
    loading.value = true;
    try {
      const res = await api.get('/requests');
      if(res.status === 200) {
        requests.value = await res.data;
        console.log('requests: ', requests.value)
      }
    } catch(err:any) {
      console.error('Error in getRequests: ', err)
    } finally {
      loading.value = false;
    }
  }

  return {
    submissions,
    loading,
    subsGiven,
    requests,
    getRequests,
    fetchSubmissions,
    getSubmissionsGiven,
  };
});