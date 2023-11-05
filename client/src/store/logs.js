import { defineStore } from "pinia";
import { useNotificationStore } from "@/store/notifications";
import api from "./api/api.js";

export const useLogsStore = defineStore("logs", {
  state: () => ({
    logs: [],
  }),

  actions: {
    async getLogs(filters) {
      if (!filters) {
        try {
          const response = await api.get("/api/logs/all");
          return (this.logs = response.data || []);
        } catch (error) {
          useNotificationStore().addNotification({
            type: "failed",
            message: `An error occurred while getting logs: ${error.message}`,
          });
        }
      } else {
        return this.logs.filter((log) => {
          const searchValue = filters.toLowerCase().trim();
          const { event, timestamp } = log;

          return (
            event.toString().toLowerCase().includes(searchValue) ||
            timestamp.toString().toLowerCase().includes(searchValue)
          );
        });
      }
    },
    async sortLogs(sortHeader, sortOrder) {
      try {
        const response = await api.get(
          `/api/logs/all?sortHeader=${sortHeader}&sortOrder=${sortOrder}`
        );
        return (this.logs = response.data || []);
      } catch (error) {
        useNotificationStore().addNotification({
          type: "failed",
          message: `An error occurred while sorting customers: ${error.message}`,
        });
      }
    },
  },
});
