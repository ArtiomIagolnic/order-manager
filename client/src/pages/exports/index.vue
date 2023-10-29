<template>
  <!-- Search Field -->
  <SearchComponent
    @filtered-results="updateDisplayedExports"
    :place-holder="'Search exports'"
  />

  <p v-if="showNoDataMessage" class="text-red-500 text-center mt-4">
    No data found.
  </p>

  <!-- Displayed Table -->
  <TableComponent
    :selected-count="selectedCount"
    :items="displayedExports"
    :disabled="true"
    @delete-item="deleteExport"
  >
    <template #mobile-sort-menu>
      <div class="w-full text-left px-4 py-2 text-gray-800">
        <SortIconsComponent
          column="timestamp"
          :sortDirections="sortDirections['timestamp']"
          @sort-column="sortColumn('timestamp')"
        >
          <template #sort-button> Date </template>
        </SortIconsComponent>
      </div>
      <div class="w-full text-left px-4 py-2 text-gray-800">
        <SortIconsComponent
          column="sourceTable"
          :sortDirections="sortDirections['sourceTable']"
          @sort-column="sortColumn('sourceTable')"
        >
          <template #sort-button>Source table</template>
        </SortIconsComponent>
      </div>
      <div class="w-full text-left px-4 py-2 text-gray-800">
        <SortIconsComponent
          column="exportedFile"
          :sortDirections="sortDirections['exportedFile']"
          @sort-column="sortColumn('exportedFile')"
        >
          <template #sort-button> Exported file</template>
        </SortIconsComponent>
      </div>
    </template>
    <template #mobile-card-headers="item">
      <input
        type="checkbox"
        class="form-checkbox h-6 w-6 text-blue-400 transition duration-150 ease-in-out"
        v-model="selectedItems"
        :value="item.item.id"
      />

      <div class="text-gray-700 font-extrabold">Date:</div>
      <div class="text-gray-900">{{ item.item.timestamp }}</div>

      <div class="text-gray-700 font-extrabold">Source table:</div>
      <div class="text-gray-900">{{ item.item.sourceTable }}</div>

      <div class="text-gray-700 font-extrabold">File:</div>
      <div class="text-gray-900">{{ item.item.exportedFile }}</div>
    </template>
    <template #mobile-card-buttons="{ item }">
      <div class="mt-3 space-x-4 flex justify-start">
        <button
          @click="deleteCustomer(item)"
          class="text-red-600 hover:text-red-800 hover:font-medium cursor-pointer"
        >
          Delete
        </button>
      </div>
    </template>

    <template #table-header>
      <div class="w-8 text-left">Nr</div>
      <div class="text-left flex-1">
        <SortIconsComponent
          column="timestamp"
          :sortDirections="sortDirections['timestamp']"
          @sort-column="sortColumn('timestamp')"
        >
          <template #sort-button> Date </template>
        </SortIconsComponent>
      </div>
      <div class="text-left flex-1">
        <SortIconsComponent
          column="sourceTable"
          :sortDirections="sortDirections['sourceTable']"
          @sort-column="sortColumn('sourceTable')"
        >
          <template #sort-button> Source table </template>
        </SortIconsComponent>
      </div>

      <div class="text-left flex-1">
        <SortIconsComponent
          column="exportedFile"
          :sortDirections="sortDirections['exportedFile']"
          @sort-column="sortColumn('exportedFile')"
        >
          <template #sort-button> Exported File </template>
        </SortIconsComponent>
      </div>

      <div class="text-center flex-1">Actions</div>
    </template>
    <template #body-item="{ item, index }">
      <div class="flex items-center p-3 border-b hover:bg-gray-100">
        <div class="w-8 flex items-center">
          <input
            :value="item.id"
            v-model="selectedItems"
            type="checkbox"
            class="form-checkbox form-checkbox h-6 w-6 text-blue-400 transition duration-150 ease-in-out"
          />

          <span class="ml-1">{{ index + 1 }}</span>
        </div>
        <div class="flex-1 p-3">
          {{ item.timestamp }}
        </div>
        <div class="flex-1 p-3">
          {{ item.sourceTable }}
        </div>
        <div class="flex-1 p-3">
          {{ item.exportedFile }}
        </div>
        <div class="flex-1 flex justify-around">
          <button
            @click="deleteExport(item)"
            class="text-red-400 hover:text-red-600 hover:font-medium cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </template>
  </TableComponent>
  <p v-if="exports.length === 0" class="text-red-500 text-center mt-4">
    No export files exported yet
  </p>
  <!-- Load More -->
  <div class="sm:flex sm:justify-end mb-5">
    <button
      v-if="canLoadMore"
      @click="loadMoreExports"
      class="sm:w-2/5 w-full bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mt-4 rounded"
    >
      Load More
    </button>
  </div>
</template>
<script>
import { useExportStore } from "@/store/export.js";
import SearchComponent from "@/components/SearchComponent.vue";
import TableComponent from "@/components/TableComponent.vue";
import SortIconsComponent from "@/components/SortIconsComponent.vue";
export default {
  components: {
    SearchComponent,
    TableComponent,
    SortIconsComponent,
  },
  data() {
    return {
      exports: [],
      pageSize: 10,
      displayedExports: [],
      loadedExportsCount: 0,
      selectedItems: [],
      sortDirections: {
        timestamp: "desc",
        sourceTable: "desc",
        exportedFile: "desc",
      },
      sortHeader: "",
      searchActive: false,
    };
  },
  created() {
    this.loadExports();
  },
  computed: {
    exportStore() {
      return useExportStore();
    },
    canLoadMore() {
      return (
        this.loadedExportsCount < this.exports.length && !this.searchActive
      );
    },
    selectedCount() {
      return this.selectedItems.length;
    },
    showNoDataMessage() {
      return this.displayedExports.length === 0;
    },
  },
  methods: {
    async loadExports() {
      this.exports = await this.exportStore.getExports();
      this.displayedExports = this.exports.slice(0, this.pageSize);
      this.loadedExportsCount = this.displayedExports.length;
    },
    loadMoreExports() {
      const remainingExports = this.exports.slice(
        this.loadedExportsCount,
        this.loadedExportsCount + this.pageSize
      );
      this.displayedExports = [...this.displayedExports, ...remainingExports];
      this.loadedExportsCount += remainingExports.length;
    },
    async updateDisplayedExports(searchFilter) {
      if (searchFilter) {
        const searchValue = searchFilter.toLowerCase();
        this.displayedExports = await this.exportStore.getExports(searchValue);
        this.searchActive = true;
      } else {
        this.loadExports();
        this.searchActive = false;
      }
    },
    async deleteExport(item) {
      if (this.selectedItems.length > 0) {
        await this.exportStore.deleteExport(this.selectedItems.join(","));
        this.selectedItems.length = 0;
      } else {
        await this.exportStore.deleteExport(item.id);
      }
      this.loadExports();
    },
    async sortColumn(column) {
      if (this.sortDirections[column] === "asc") {
        this.sortDirections[column] = "desc";
      } else {
        this.sortDirections[column] = "asc";
      }
      this.sortHeader = column;
      this.sortDirection = this.sortDirections[column];

      await this.exportStore.sortExports(this.sortHeader, this.sortDirection);

      this.displayedExports = this.exportStore.excelExports;
    },
  },
};
</script>