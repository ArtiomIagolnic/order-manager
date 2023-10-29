<template>
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
    :export-selected="exportLink"
    @update-item="openModal"
    @delete-item="deleteOrder"
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
          @sort-column="sortColumn('customer')"
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
          @click="deleteCustomer(item)"
          class="text-red-600 hover:text-red-800 hover:font-medium cursor-pointer"
        >
          Delete
        </button>
        <a
          :href="`http://localhost:8000/api/orders/export/${item.id}`"
          class="text-green-400 hover:text-green-600 hover:font-medium cursor-pointer"
        >
          Export
        </a>
      </div>
    </template>
    <template #table-header>
      <div class="w-8 text-left">Nr</div>
      <div class="text-left flex-1">
        <SortIconsComponent
          column="displayedId"
          :sortDirections="getSortDirection('displayedId')"
          @sort-column="sortColumn('displayedId')"
        >
          <template #sort-button> Order ID </template>
        </SortIconsComponent>
      </div>
      <div class="text-left flex-1">
        <SortIconsComponent
          column="customer.name"
          :sortDirections="getSortDirection('customer.name')"
          @sort-column="sortColumn('customer.name')"
        >
          <template #sort-button> Customer </template>
        </SortIconsComponent>
      </div>
      <div class="text-left flex-1">
        <SortIconsComponent
          column="date"
          :sortDirections="getSortDirection('date')"
          @sort-column="sortColumn('date')"
        >
          <template #sort-button> Date </template>
        </SortIconsComponent>
      </div>
      <div class="text-left flex-1">
        <SortIconsComponent
          column="totalAmount"
          :sortDirections="getSortDirection('totalAmount')"
          @sort-column="sortColumn('totalAmount')"
        >
          <template #sort-button> Total amount </template>
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
            class="form-checkbox text-blue-400 h-5 w-5"
          />
          <span class="ml-1">{{ index + 1 }}</span>
        </div>
        <div class="flex-1 p-3">
          {{ item.displayedId }}
        </div>
        <div class="flex-1 p-3">
          {{ item.customer.name }}
        </div>
        <div class="flex-1 p-3 text-left">
          {{ item.date }}
        </div>
        <div class="flex-1 p-3">
          {{ item.totalAmount }}
        </div>
        <div class="flex-1 flex justify-around">
          <button
            @click="openModal(item)"
            class="text-blue-400 hover:text-blue-600 hover:font-medium cursor-pointer"
          >
            Update
          </button>
          <button
            @click="deleteOrder(item)"
            class="text-red-400 hover:text-red-600 hover:font-medium cursor-pointer ml-1"
          >
            Delete
          </button>
          <a
            :href="`http://localhost:8000/api/orders/export/${item.id}`"
            class="text-green-400 hover:text-green-600 hover:font-medium cursor-pointer ml-1"
          >
            Export
          </a>
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
  },
  data() {
    return {
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
    exportLink() {
      return this.selectedItems.length > 0
        ? `http://localhost:8000/api/orders/export/${this.selectedItems.join(
            ","
          )}`
        : "";
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
    async deleteOrder(order) {
      if (this.selectedItems.length > 0) {
        await this.orderStore.deleteOrder(this.selectedItems.join(","));
        this.selectedItems.length = 0;
      } else {
        await this.orderStore.deleteOrder(order.id);
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
  },
};
</script>
