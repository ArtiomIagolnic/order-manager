<template>
  <!-- Confirm Action Modal -->
  <ConfirmActionModal
    v-if="showConfirmModal"
    type="danger"
    title="Confirm Action"
    width="sm"
    v-on:close="showConfirmModal = false"
  >
    <p class="text-gray-800">Are you sure you want you delete customer(s)?</p>

    <div class="text-right mt-4">
      <button
        @click="showConfirmModal = false"
        class="px-4 py-2 text-sm text-gray-600 focus:outline-none hover:underline"
      >
        Cancel
      </button>
      <button
        @click="deleteOrder()"
        class="mr-2 px-4 py-2 text-sm rounded text-white bg-red-500 focus:outline-none hover:bg-red-400"
      >
        Delete
      </button>
    </div>
  </ConfirmActionModal>
  <!-- Modal -->
  <OrderModal
    :updatedOrder="updatedOrder"
    :modalActive="openOrderModal"
    @close-modal="closeModal"
    @orderAdded="loadOrders()"
    @orderUpdated="loadOrders()"
  />
  <button
    @click="openModal()"
    class="w-full md:w-2/5 bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mb-4 rounded"
  >
    <font-awesome-icon icon="fa-solid fa-cart-plus" />
    Add new order
  </button>

  <!-- Search Field -->
  <SearchComponent
    @filtered-results="updateDisplayedOrders"
    :place-holder="'Search orders'"
  />

  <p v-if="showNoDataMessage" class="text-red-500 text-center mt-4">
    No data found.
  </p>

  <!-- Orders Table -->
  <TableComponent
    :items="displayedOrders"
    :selectedCount="selectedCount"
    @export-selected="exportOrder"
    @update-item="openModal"
    @delete-item="submitDeleting"
  >
    <template #mobile-sort-menu>
      <div class="w-full text-left px-4 py-2 text-gray-800">
        <SortIconsComponent
          column="displayedId"
          :sortDirections="getSortDirection('displayedId')"
          @sort-column="sortColumn('displayedId')"
        >
          <template #sort-button> Order ID </template>
        </SortIconsComponent>
      </div>
      <div class="w-full text-left px-4 py-2 text-gray-800">
        <SortIconsComponent
          column="customer"
          :sortDirections="getSortDirection('customer.name')"
          @sort-column="sortColumn('customer.name')"
        >
          <template #sort-button>Customer</template>
        </SortIconsComponent>
      </div>
      <div class="w-full text-left px-4 py-2 text-gray-800">
        <SortIconsComponent
          column="date"
          :sortDirections="getSortDirection('date')"
          @sort-column="sortColumn('date')"
        >
          <template #sort-button> Date</template>
        </SortIconsComponent>
      </div>
      <div class="w-full text-left px-4 py-2 text-gray-800">
        <SortIconsComponent
          column="totalAmount"
          :sortDirections="getSortDirection('totalAmount')"
          @sort-column="sortColumn('totalAmount')"
        >
          <template #sort-button> Total amount</template>
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
      <div class="text-gray-700 font-extrabold">Order ID:</div>
      <div class="text-gray-900">{{ item.item.displayedId }}</div>

      <div class="text-gray-700 font-extrabold">Customer:</div>
      <div class="text-gray-900">{{ item.item.customer.name }}</div>

      <div class="text-gray-700 font-extrabold">Date:</div>
      <div class="text-gray-900">{{ item.item.date }}</div>

      <div class="text-gray-700 font-extrabold">Total Amount:</div>
      <div class="text-gray-900">{{ item.item.totalAmount }}</div>
    </template>
    <template #mobile-card-buttons="{ item }">
      <div class="mt-3 space-x-4 flex justify-start">
        <button
          @click="openModal(item)"
          class="text-blue-600 hover:text-blue-800 hover:font-medium cursor-pointer"
        >
          Update
        </button>
        <button
          @click="submitDeleting(item)"
          class="text-red-600 hover:text-red-800 hover:font-medium cursor-pointer"
        >
          Delete
        </button>
        <button
          @click="exportOrder(item.id)"
          class="text-green-400 hover:text-green-600 hover:font-medium cursor-pointer"
        >
          Export
        </button>
      </div>
    </template>
    <template #table-header>
      <div
        class="bg-teal-400 p-3 rounded-l-lg mb-0 text-white grid grid-cols-12 divide-x divide-gray-300"
      >
        <div class="p-2 text-left font-bold col-span-1">Nr</div>
        <div class="p-2 text-left font-bold col-span-2">
          <SortIconsComponent
            column="displayedId"
            :sortDirections="getSortDirection('displayedId')"
            @sort-column="sortColumn('displayedId')"
          >
            <template #sort-button> Order ID </template>
          </SortIconsComponent>
        </div>
        <div class="p-2 text-left font-bold col-span-2">
          <SortIconsComponent
            column="customer.name"
            :sortDirections="getSortDirection('customer.name')"
            @sort-column="sortColumn('customer.name')"
          >
            <template #sort-button> Customer </template>
          </SortIconsComponent>
        </div>
        <div class="p-2 text-left font-bold col-span-2">
          <SortIconsComponent
            column="date"
            :sortDirections="getSortDirection('date')"
            @sort-column="sortColumn('date')"
          >
            <template #sort-button> Date </template>
          </SortIconsComponent>
        </div>
        <div class="p-2 text-left font-bold col-span-2">
          <SortIconsComponent
            column="totalAmount"
            :sortDirections="getSortDirection('totalAmount')"
            @sort-column="sortColumn('totalAmount')"
          >
            <template #sort-button> Total amount </template>
          </SortIconsComponent>
        </div>

        <div class="p-2 text-center font-bold col-span-3">Actions</div>
      </div>
    </template>
    <template #body-item="{ item, index }">
      <div
        class="grid grid-cols-12 divide-x divide-gray-300 p-3 border-b hover:bg-gray-100"
      >
        <div class="p-2 text-center col-span-1">
          <input
            :value="item.id"
            v-model="selectedItems"
            type="checkbox"
            class="form-checkbox text-blue-400 h-5 w-5"
          />
          <span class="ml-1">{{ index + 1 }}</span>
        </div>
        <div class="p-2 text-left col-span-2">
          {{ item.displayedId }}
        </div>
        <div class="p-2 text-left col-span-2">
          {{ item.customer.name }}
        </div>
        <div class="p-2 text-left col-span-2">
          {{ item.date }}
        </div>
        <div class="p-2 text-left col-span-2">
          {{ item.totalAmount }}
        </div>
        <div class="p-2 text-center col-span-3">
          <button
            @click="openModal(item)"
            class="text-blue-400 hover:text-blue-600 hover:font-medium cursor-pointer"
          >
            Update
          </button>
          <button
            @click="submitDeleting(item)"
            class="text-red-400 hover:text-red-600 hover:font-medium cursor-pointer ml-1"
          >
            Delete
          </button>
          <button
            @click="exportOrder(item.id)"
            class="text-green-400 hover:text-green-600 hover:font-medium cursor-pointer ml-1"
          >
            Export
          </button>
        </div>
      </div>
    </template>
  </TableComponent>
  <p v-if="orders.length === 0" class="text-red-500 text-center mt-4">
    No orders added yet
  </p>

  <!-- Load More -->
  <div class="sm:flex sm:justify-end mb-5">
    <button
      v-if="canLoadMore"
      @click="loadMoreOrders"
      class="sm:w-2/5 w-full bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mt-4 rounded"
    >
      Load More
    </button>
  </div>
</template>

<script>
import ConfirmActionModal from "@/components/ConfirmActionModal.vue";
import { useOrderStore } from "@/store/order.js";
import OrderModal from "./components/OrderModal.vue";
import SearchComponent from "@/components/SearchComponent.vue";
import TableComponent from "@/components/TableComponent.vue";
import SortIconsComponent from "@/components/SortIconsComponent.vue";

export default {
  components: {
    OrderModal,
    SearchComponent,
    TableComponent,
    SortIconsComponent,
    ConfirmActionModal,
  },
  data() {
    return {
      showConfirmModal: false,
      orders: [],
      updatedOrder: {},
      openOrderModal: false,
      pageSize: 10,
      displayedOrders: [],
      loadedOrdersCount: 0,
      selectedItems: [],
      sortDirections: {
        displayedId: "desc",
        customer: {
          name: "desc",
        },
        date: "desc",
        totalAmount: "desc",
      },
      sortHeader: "",
      searchActive: false,
      itemsToDelete: null,
    };
  },
  created() {
    this.loadOrders();
  },
  computed: {
    orderStore() {
      return useOrderStore();
    },
    canLoadMore() {
      return this.loadedOrdersCount < this.orders.length && !this.searchActive;
    },
    selectedCount() {
      return this.selectedItems.length;
    },
    getSortDirection() {
      return (column) => {
        if (column.includes(".")) {
          const [nestedKey, nestedProperty] = column.split(".");
          return this.sortDirections[nestedKey][nestedProperty];
        } else {
          return this.sortDirections[column];
        }
      };
    },
    showNoDataMessage() {
      return this.displayedOrders.length === 0 && this.searchActive;
    },
  },
  methods: {
    async loadOrders() {
      this.orders = await this.orderStore.getOrders();
      this.displayedOrders = this.orders.slice(0, this.pageSize);
      this.loadedOrdersCount = this.displayedOrders.length;
    },
    loadMoreOrders() {
      const remainingOrders = this.orders.slice(
        this.loadedOrdersCount,
        this.loadedOrdersCount + this.pageSize
      );
      this.displayedOrders = [...this.displayedOrders, ...remainingOrders];
      this.loadedOrdersCount += remainingOrders.length;
    },
    async updateDisplayedOrders(searchFilter) {
      if (searchFilter) {
        const searchValue = searchFilter.toLowerCase();
        this.displayedOrders = await this.orderStore.getOrders(searchValue);
        this.searchActive = true;
      } else {
        this.loadOrders();
        this.searchActive = false;
      }
    },
    openModal(order) {
      if (order) {
        this.updatedOrder = order;
      } else {
        this.updatedOrder = {};
      }
      this.openOrderModal = true;
    },
    closeModal() {
      this.openOrderModal = false;
    },
    submitDeleting(item) {
      this.itemsToDelete = item;
      this.showConfirmModal = true;
    },
    async deleteOrder() {
      if (this.itemsToDelete) {
        if (this.selectedItems.length > 0) {
          await this.orderStore.deleteOrder(this.selectedItems.join(","));
          this.selectedItems.length = 0;
        } else {
          await this.orderStore.deleteOrder(this.itemsToDelete.id);
        }
        this.showConfirmModal = false;
        this.itemsToDelete = null;
      }

      this.loadOrders();
    },
    async sortColumn(column) {
      let sortKey = column;
      let sortDirection = "asc";

      if (column.includes(".")) {
        const [mainKey, nestedProperty] = column.split(".");
        sortKey = mainKey;
        sortDirection = this.sortDirections[mainKey][nestedProperty];
      } else {
        sortDirection = this.sortDirections[column];
      }

      if (sortDirection === "asc") {
        sortDirection = "desc";
      } else {
        sortDirection = "asc";
      }

      // Update the sorting direction in your sortDirections object
      if (column.includes(".")) {
        const [mainKey, nestedProperty] = column.split(".");
        this.sortDirections[mainKey][nestedProperty] = sortDirection;
      } else {
        this.sortDirections[column] = sortDirection;
      }

      // Perform sorting based on the selected column and direction
      await this.orderStore.sortOrders(sortKey, sortDirection);

      // Update the displayed data
      this.displayedOrders = this.orderStore.orders;
    },
    async exportOrder(id) {
      if (id) {
        await this.orderStore.exportSelected(id);
      } else {
        await this.orderStore.exportSelected(this.selectedItems);
        this.selectedItems = [];
      }
    },
  },
};
</script>
