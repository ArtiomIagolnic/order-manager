<template>
  <!-- Confirm Action Modal -->
  <ConfirmActionModal
    v-if="showConfirmModal"
    type="danger"
    title="Confirm Action"
    width="sm"
    v-on:close="showConfirmModal = false"
  >
    <p class="text-gray-800">Are you sure you want you delete export(s)?</p>

    <div class="text-right mt-4">
      <button
        @click="showConfirmModal = false"
        class="px-4 py-2 text-sm text-gray-600 focus:outline-none hover:underline"
      >
        Cancel
      </button>
      <button
        @click="deleteExport()"
        class="mr-2 px-4 py-2 text-sm rounded text-white bg-red-500 focus:outline-none hover:bg-red-400"
      >
        Delete
      </button>
    </div>
  </ConfirmActionModal>
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
    @delete-item="submitDeleting"
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
      <div class="text-gray-900">
        <a :href="item.item.exportedFileUrl">
          {{ item.item.exportedFile }}
        </a>
      </div>
    </template>
    <template #mobile-card-buttons="{ item }">
      <div
        class="bg-gray-200 text-sm py-1 px-1 rounded select-none text-gray-700 inline-block mt-2"
      >
        <button
          @click="submitDeleting(item)"
          class="rounded px-2 py-1 bg-white shadow font-medium focus:outline-none text-red-400"
        >
          Delete
        </button>
      </div>
    </template>

    <template #table-header>
      <div
        class="bg-teal-400 p-3 flex-no-wrap rounded-l-lg mb-0 text-white grid grid-cols-10 divide-x divide-gray-300"
      >
        <div class="p-2 text-left font-bold col-span-1">Nr</div>
        <div class="p-2 text-left font-bold col-span-2">
          <SortIconsComponent
            column="timestamp"
            :sortDirections="sortDirections['timestamp']"
            @sort-column="sortColumn('timestamp')"
          >
            <template #sort-button> Date </template>
          </SortIconsComponent>
        </div>
        <div class="p-2 text-left font-bold col-span-2">
          <SortIconsComponent
            column="sourceTable"
            :sortDirections="sortDirections['sourceTable']"
            @sort-column="sortColumn('sourceTable')"
          >
            <template #sort-button> Source table </template>
          </SortIconsComponent>
        </div>

        <div class="p-2 text-left font-bold col-span-3">
          <SortIconsComponent
            column="exportedFile"
            :sortDirections="sortDirections['exportedFile']"
            @sort-column="sortColumn('exportedFile')"
          >
            <template #sort-button> Exported File </template>
          </SortIconsComponent>
        </div>

        <div class="p-2 text-center font-bold col-span-2">Actions</div>
      </div>
    </template>
    <template #body-item="{ item, index }">
      <div
        class="grid grid-cols-10 divide-x divide-gray-300 p-3 border-b hover:bg-gray-100"
      >
        <div class="p-2 text-left col-span-1">
          <input
            :value="item.id"
            v-model="selectedItems"
            type="checkbox"
            class="form-checkbox form-checkbox h-6 w-6 text-blue-400 transition duration-150 ease-in-out"
          />

          <span class="ml-1">{{ index + 1 }}</span>
        </div>
        <div class="p-2 text-left col-span-2">
          {{ item.timestamp }}
        </div>
        <div class="p-2 text-left col-span-2">
          {{ item.sourceTable }}
        </div>
        <div class="p-2 text-left col-span-3 overflow-x-auto">
          <a :href="item.exportedFileUrl">
            {{ item.exportedFile }}
          </a>
        </div>
        <div class="col-span-2">
          <div class="flex justify-center">
            <div
              class="bg-gray-200 text-sm py-1 px-1 rounded select-none text-gray-700 inline-block"
            >
              <button
                @click="submitDeleting(item)"
                class="rounded px-2 py-1 bg-white shadow font-medium focus:outline-none text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
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
import ConfirmActionModal from "@/components/ConfirmActionModal.vue";
import { useExportStore } from "@/store/export.js";
import SearchComponent from "@/components/SearchComponent.vue";
import TableComponent from "@/components/TableComponent.vue";
import SortIconsComponent from "@/components/SortIconsComponent.vue";
export default {
  components: {
    SearchComponent,
    TableComponent,
    SortIconsComponent,
    ConfirmActionModal,
  },
  data() {
    return {
      showDeleteAlert: false,
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
      itemToDelete: null,
      showConfirmModal: false,
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
      return this.displayedExports.length === 0 && this.searchActive;
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
    submitDeleting(item) {
      this.itemToDelete = item;
      this.showConfirmModal = true;
    },
    async deleteExport() {
      if (this.itemToDelete) {
        if (this.selectedItems.length > 0) {
          await this.exportStore.deleteExport(this.selectedItems.join(","));
          this.selectedItems.length = 0;
        } else {
          await this.exportStore.deleteExport(this.itemToDelete.id);
        }
        this.itemToDelete = null;
        this.showConfirmModal = false;
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
