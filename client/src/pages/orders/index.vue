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
    :store-getter="orderStore.getOrders"
    :place-holder="'Search orders'"
  />

  <p v-if="showNoDataMessage" class="text-red-500 text-center mt-4">
    No data found.
  </p>
  <p v-if="orders.length === 0" class="text-red-500 text-center mt-4">
    No orders added yet
  </p>

  <!-- Orders Table -->
  <TableComponent
    :headers="tableHeaders"
    :item-props="itemProps"
    :items="displayedOrders"
    @update-item="openModal"
    @delete-item="deleteOrder"
  >
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
      </div>
    </template>
    <template #body-item="{ item, index }">
      <tr class="flex-col flex-no wrap mb-0">
        <td class="border-grey-light border hover:bg-gray-100 p-3">
          {{ index + 1 }}
        </td>
        <td class="border-grey-light border hover:bg-gray-100 p-3">
          {{ item.displayedId }}
        </td>
        <td class="border-grey-light border hover:bg-gray-100 p-3">
          {{ item.customer }}
        </td>
        <td class="border-grey-light border hover:bg-gray-100 p-3">
          {{ item.date }}
        </td>
        <td class="border-grey-light border hover:bg-gray-100 p-3">
          {{ item.totalAmount }}
        </td>
        <td
          class="border-grey-light border hover:bg-gray-100 p-3 flex justify-around"
        >
          <button
            @click="openModal(item)"
            class="text-blue-400 hover:text-blue-600 hover:font-medium cursor-pointer"
          >
            Update
          </button>
          <button
            @click="deleteCustomer(item)"
            class="text-red-400 hover:text-red-600 hover:font-medium cursor-pointer"
          >
            Delete
          </button>
        </td>
      </tr>
    </template>
  </TableComponent>

  <!-- Load More -->
  <div class="flex justify-end">
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

export default {
  components: {
    OrderModal,
    SearchComponent,
    TableComponent,
  },
  data() {
    return {
      tableHeaders: ["Order ID", "Name", "Date", "Total Amount"],
      itemProps: ["displayedId", "customer", "date", "totalAmount"],
      orders: [],
      updatedOrder: {},
      openOrderModal: false,
      pageSize: 10,
      displayedOrders: [],
      loadedOrdersCount: 0,
      showNoDataMessage: false,
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
      return this.loadedOrdersCount < this.orders.length;
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
    updateDisplayedOrders(filteredOrders) {
      this.displayedOrders = filteredOrders;
      this.showNoDataMessage = this.displayedOrders.length === 0;
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
      await this.orderStore.deleteOrder(order);
      this.loadOrders();
    },
  },
};
</script>
