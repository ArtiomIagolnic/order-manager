<template>
  <div class="container mx-auto p-4">
    <div>
      <h2 class="text-2xl font-bold mb-4">Log Entries</h2>

      <SearchComponent
        @filtered-results="updateDisplayedLogs"
        :place-holder="'Search logs'"
      />
    </div>
    <p v-if="showNoDataMessage" class="text-red-500 text-center mt-4">
      No data found.
    </p>
    <div v-if="logs.length === 0" class="mt-4">
      <p class="text-red-500 text-center">No logs yet</p>
    </div>

    <th class="p-3 text-left">
      <SortIconsComponent
        column="timestamp"
        :sortDirections="sortDirections['timestamp']"
        @sort-column="sortColumn('timestamp')"
      >
        <template #sort-button>Sort by date</template>
      </SortIconsComponent>
    </th>

    <ul class="mt-4">
      <li
        v-for="(log, index) in displayedLogs"
        :key="index"
        class="py-2 px-4 border rounded mb-4 bg-white shadow w-full"
      >
        <div class="text-base sm:text-lg md:text-xl font-semibold">
          {{ log.timestamp }} - {{ log.event }}
        </div>
      </li>
    </ul>

    <!-- Load More -->
    <div class="sm:flex sm:justify-end mb-5">
      <button
        v-if="canLoadMore"
        @click="loadMoreLogs"
        class="sm:w-2/5 w-full bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 rounded"
      >
        Load More
      </button>
    </div>
  </div>
</template>

<script>
import SearchComponent from "@/components/SearchComponent.vue";
import SortIconsComponent from "@/components/SortIconsComponent.vue";
import { useLogsStore } from "@/store/logs.js";

export default {
  components: {
    SearchComponent,
    SortIconsComponent,
  },
  data() {
    return {
      logs: [],
      pageSize: 10,
      displayedLogs: [],
      loadedLogsCount: 0,
      sortDirections: {
        timestamp: "desc",
      },
      sortHeader: "",
      searchActive: false,
    };
  },
  created() {
    this.loadLogs();
  },
  computed: {
    logsStore() {
      return useLogsStore();
    },
    canLoadMore() {
      return this.loadedLogsCount < this.logs.length && !this.searchActive;
    },
    showNoDataMessage() {
      return this.displayedLogs.length === 0 && this.searchActive;
    },
  },
  methods: {
    async loadLogs() {
      this.logs = await this.logsStore.getLogs();
      this.displayedLogs = this.logs.slice(0, this.pageSize);
      this.loadedLogsCount = this.displayedLogs.length;
    },
    loadMoreLogs() {
      const remainingLogs = this.logs.slice(
        this.loadedLogsCount,
        this.loadedLogsCount + this.pageSize
      );
      this.displayedLogs = [...this.displayedLogs, ...remainingLogs];
      this.loadedLogsCount += remainingLogs.length;
    },
    async updateDisplayedLogs(searchFilter) {
      if (searchFilter) {
        const searchValue = searchFilter.toLowerCase();
        this.displayedLogs = await this.logsStore.getLogs(searchValue);
        this.searchActive = true;
      } else {
        this.loadLogs();
        this.searchActive = false;
      }
    },

    async sortColumn(column) {
      if (this.sortDirections[column] === "asc") {
        this.sortDirections[column] = "desc";
      } else {
        this.sortDirections[column] = "asc";
      }
      this.sortHeader = column;
      this.sortDirection = this.sortDirections[column];

      await this.logsStore.sortLogs(this.sortHeader, this.sortDirection);

      this.displayedLogs = this.logsStore.logs;
    },
  },
};
</script>
