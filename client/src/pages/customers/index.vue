<template>
  <!-- Modal -->
  <CustomerModal
    :updatedCustomer="updatedCustomer"
    :modalActive="openCustomerModal"
    @close-modal="closeModal"
    @customerAdded="loadCustomers()"
    @customerUpdated="loadCustomers()"
  />

  <button
    @click="openModal()"
    class="w-full md:w-2/5 bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mb-4 rounded"
  >
    Add new customer
  </button>

  <!-- Search Field -->
  <SearchComponent
    @filtered-results="updateDisplayedCustomers"
    :store-getter="customerStore.getCustomers"
    :place-holder="'Search customers'"
  />

  <p v-if="showNoDataMessage" class="text-red-500 text-center mt-4">
    No data found.
  </p>

  <!-- Displayed Table -->
  <TableComponent
    :headers="tableHeaders"
    :items="displayedCustomers"
    :item-props="itemProps"
    :selectedCount="selectedCount"
    :export-selected="exportLink"
    @update-item="openModal"
    @delete-item="deleteCustomer"
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
          <input
            :value="item.id"
            v-model="selectedItems"
            type="checkbox"
            class="form-checkbox text-blue-400 h-5 w-5"
          />
          <span class="ml-2">{{ index + 1 }}</span>
        </td>
        <td class="border-grey-light border hover:bg-gray-100 p-3">
          {{ item.fullName }}
        </td>
        <td class="border-grey-light border hover:bg-gray-100 p-3">
          {{ item.age }}
        </td>
        <td class="border-grey-light border hover:bg-gray-100 p-3">
          {{ item.billingAdress }}
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
          <a
            :href="`http://localhost:8000/api/customers/export/${item.id}`"
            class="text-green-400 hover:text-green-600 hover:font-medium cursor-pointer"
          >
            Export
          </a>
        </td>
      </tr>
    </template>
  </TableComponent>

  <p v-if="customers.length === 0" class="text-red-500 text-center mt-4">
    No customers added yet
  </p>

  <!-- Load More -->
  <div class="sm:flex sm:justify-end">
    <button
      v-if="canLoadMore"
      @click="loadMoreCustomers"
      class="sm:w-2/5 w-full bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mt-4 rounded"
    >
      Load More
    </button>
  </div>
</template>

<script>
import { useCustomerStore } from "@/store/customer.js";
import CustomerModal from "./components/CustomerModal.vue";
import SearchComponent from "@/components/SearchComponent.vue";
import TableComponent from "@/components/TableComponent.vue";

export default {
  components: {
    CustomerModal,
    SearchComponent,
    TableComponent,
  },
  data() {
    return {
      tableHeaders: ["Name", "Age", "Billing Address", "Actions"],
      itemProps: ["fullName", "age", "billingAdress"],
      customers: [],
      pageSize: 10,
      displayedCustomers: [],
      loadedCustomersCount: 0,
      showNoDataMessage: false,
      updatedCustomer: {},
      openCustomerModal: false,
      selectedItems: [],
      exportLink: "",
    };
  },
  watch: {
    selectedItems: {
      handler: function () {
        this.exportLink =
          "http://localhost:8000/api/customers/export/" +
          this.selectedItems.join(",");
      },
      deep: true,
    },
  },
  created() {
    this.loadCustomers();
  },
  computed: {
    customerStore() {
      return useCustomerStore();
    },
    canLoadMore() {
      return this.loadedCustomersCount < this.customers.length;
    },
    selectedCount() {
      return this.selectedItems.length;
    },
  },
  methods: {
    async loadCustomers() {
      this.customers = await this.customerStore.getCustomers();
      this.customers.forEach((customer) => {
        customer.fullName = `${customer.firstName} ${customer.lastName}`;
      });

      this.displayedCustomers = this.customers.slice(0, this.pageSize);
      this.loadedCustomersCount = this.displayedCustomers.length;
    },
    loadMoreCustomers() {
      const remainingCustomers = this.customers.slice(
        this.loadedCustomersCount,
        this.loadedCustomersCount + this.pageSize
      );
      this.displayedCustomers = [
        ...this.displayedCustomers,
        ...remainingCustomers,
      ];
      this.loadedCustomersCount += remainingCustomers.length;
    },
    updateDisplayedCustomers(filteredResults) {
      this.displayedCustomers = filteredResults;
      this.showNoDataMessage = this.displayedCustomers.length === 0;
    },
    openModal(customer) {
      if (customer) {
        this.updatedCustomer = customer;
      } else {
        this.updatedCustomer = {};
      }
      this.openCustomerModal = true;
    },
    closeModal() {
      this.openCustomerModal = false;
    },
    async deleteCustomer(customer) {
      if (this.selectedItems.length > 0) {
        await this.customerStore.deleteCustomer(this.selectedItems.join(","));
        this.selectedItems.length = 0;
      } else {
        await this.customerStore.deleteCustomer(customer.id);
      }
      this.loadCustomers();
    },
  },
};
</script>
