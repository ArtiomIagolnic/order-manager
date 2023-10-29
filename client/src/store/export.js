import { defineStore } from "pinia";
import { useNotificationStore } from "@/store/notifications";
import axios from "axios";

export const useExportStore = defineStore("export", {
  state: () => ({
    excelExports: [],
  }),

  actions: {
    async getExports(filters) {
      if (!filters) {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/exports/all"
          );
          return (this.excelExports = response.data || []);
        } catch (error) {
          useNotificationStore().addNotification({
            type: "failed",
            message: `An error occurred while getting exports: ${error.message}`,
          });
        }
      } else {
        return this.excelExports.filter((excelExport) => {
          const searchValue = filters.toLowerCase().trim();
          const { timestamp, sourceTable, exportedFile } = excelExport;

          return (
            timestamp.toString().toLowerCase().includes(searchValue) ||
            sourceTable.toString().toLowerCase().includes(searchValue) ||
            exportedFile.toString().toLowerCase().includes(searchValue)
          );
        });
      }
    },

    async sortExports(sortHeader, sortOrder) {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/exports/all?sortHeader=${sortHeader}&sortOrder=${sortOrder}`
        );
        return (this.excelExports = response.data || []);
      } catch (error) {
        useNotificationStore().addNotification({
          type: "failed",
          message: `An error occurred while sorting exports: ${error.message}`,
        });
      }
    },

    async deleteExport(excelExport) {
      try {
        if (excelExport) {
          await axios.delete(
            `http://localhost:8000/api/exports/delete/${excelExport}`,
            excelExport
          );
          useNotificationStore().addNotification({
            type: "success",
            message: "Export was deleted successfully",
          });
        } else {
          useNotificationStore().addNotification({
            type: "warning",
            message: "You didn't selected any export",
          });
        }
      } catch (error) {
        useNotificationStore().addNotification({
          type: "failed",
          message: `An error occurred while deleting export: ${error.message}`,
        });
      }
    },
  },
});
