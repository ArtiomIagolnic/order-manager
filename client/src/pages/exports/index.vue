<template>
  <!-- Search Field -->
  <SearchComponent
    @filtered-results="updateDisplayedExports"
    :store-getter="exportStore.getExports"
    :place-holder="'Search exports'"
  />

  <p v-if="showNoDataMessage" class="text-red-500 text-center mt-4">
    No data found.
  </p>

  <!-- Displayed Table -->
  <TableComponent
    :selected-count="selectedCount"
    :headers="tableHeaders"
    :item-props="itemProps"
    :items="displayedExports"
    :disabled="true"
    @delete-item="deleteExport"
  >
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
      <th class="p-3 text-left">Nr</th>
      <th class="p-3 text-left">
        Date
        <SortIconsComponent
          column="timestamp"
          :sortDirections="sortDirections['timestamp']"
          @sort-column="sortColumn('timestamp')"
        />
      </th>
      <th class="p-3 text-left">
        Source table
        <SortIconsComponent
          column="sourceTable"
          :sortDirections="sortDirections['sourceTable']"
          @sort-column="sortColumn('sourceTable')"
        />
      </th>

      <th class="p-3 text-left">
        Exported File
        <SortIconsComponent
          column="exportedFile"
          :sortDirections="sortDirections['exportedFile']"
          @sort-column="sortColumn('exportedFile')"
        />
      </th>

      <th class="p-3 text-center">Actions</th>
    </template>
    <template #body-item="{ item, index }">
      <tr class="flex-col flex-no wrap mb-0">
        <td class="border-grey-light border hover:bg-gray-100 p-3">
          <input
            :value="item.id"
            v-model="selectedItems"
            type="checkbox"
            class="form-checkbox form-checkbox h-6 w-6 text-blue-400 transition duration-150 ease-in-out"
          />

          <span class="ml-2">{{ index + 1 }}</span>
        </td>
        <td class="border-grey-light border hover:bg-gray-100 p-3">
          {{ item.timestamp }}
        </td>
        <td class="border-grey-light border hover:bg-gray-100 p-3">
          {{ item.sourceTable }}
        </td>
        <td class="border-grey-light border hover:bg-gray-100 p-3">
          {{ item.exportedFile }}
        </td>
        <td
          class="border-grey-light border hover:bg-gray-100 py-6 flex justify-around"
        >
          <button
            @click="deleteExport(item)"
            class="text-red-400 hover:text-red-600 hover:font-medium cursor-pointer"
          >
            Delete
          </button>
        </td>
      </tr>
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
      tableHeaders: ["Date", "Source table", "Exported file", "Ations"],
      itemProps: ["timestamp", "sourceTable", "exportedFile"],
      exports: [],
      pageSize: 10,
      displayedExports: [],
      loadedExportsCount: 0,
      showNoDataMessage: false,
      selectedItems: [],
      sortDirections: {
        timestamp: "desc",
        sourceTable: "desc",
        exportedFile: "desc",
      },
      sortHeader: "",
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
      return this.loadedExportsCount < this.exports.length;
    },
    selectedCount() {
      return this.selectedItems.length;
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
    updateDisplayedExports(filteredExports) {
      this.displayedExports = filteredExports;
      this.showNoDataMessage = this.displayedExports.length === 0;
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
