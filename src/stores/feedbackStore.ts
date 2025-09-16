import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "../services/api.ts";
import type { FeedbackSubmission } from "../types.ts";

export const useFeedbackStore = defineStore("feedback", () => {
  const submissions = ref<FeedbackSubmission[]>([]);
  const loading = ref(false);

  async function fetchSubmissions() {
    loading.value = true;
    console.log("Fetching feedback submissions...");
    try {
      const res = await api.get("/submissions");
      if (res.status === 200) {
        submissions.value = res.data;
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      loading.value = false;
      console.log('submissions in store: ', submissions.value);
    }
  }

  return {
    submissions,
    loading,
    fetchSubmissions,
  };
});