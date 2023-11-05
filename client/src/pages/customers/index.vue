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
        @click="deleteCustomer()"
        class="mr-2 px-4 py-2 text-sm rounded text-white bg-red-500 focus:outline-none hover:bg-red-400"
      >
        Delete
      </button>
    </div>
  </ConfirmActionModal>

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
    <font-awesome-icon icon="fa-solid fa-user-plus" />
    Add new customer
  </button>

  <!-- Search Field -->
  <SearchComponent
    @filtered-results="updateDisplayedCustomers"
    :place-holder="'Search customers'"
  />

  <p v-if="showNoDataMessage" class="text-red-500 text-center mt-4">
    No data found.
  </p>

  <!-- Displayed Table -->
  <TableComponent
    :items="displayedCustomers"
    :selectedCount="selectedCount"
    @export-selected="exportCustomer"
    @update-item="openModal"
    @delete-item="submitDeleting"
  >
    <!-- Mobile Sorting Menu -->
    <template #mobile-sort-menu>
      <div class="w-full text-left px-4 py-2 text-gray-800">
        <SortIconsComponent
          column="firstName"
          :sortDirections="sortDirections['firstName']"
          @sort-column="sortColumn('firstName')"
        >
          <template #sort-button> First name </template>
        </SortIconsComponent>
      </div>
      <div class="w-full text-left px-4 py-2 text-gray-800">
        <SortIconsComponent
          column="lastName"
          :sortDirections="sortDirections['lastName']"
          @sort-column="sortColumn('lastName')"
        >
          <template #sort-button> Last name</template>
        </SortIconsComponent>
      </div>
      <div class="w-full text-left px-4 py-2 text-gray-800">
        <SortIconsComponent
          column="age"
          :sortDirections="sortDirections['age']"
          @sort-column="sortColumn('age')"
        >
          <template #sort-button> Age</template>
        </SortIconsComponent>
      </div>
      <div class="w-full text-left px-4 py-2 text-gray-800">
        <SortIconsComponent
          column="billingAdress"
          :sortDirections="sortDirections['billingAdress']"
          @sort-column="sortColumn('billingAdress')"
        >
          <template #sort-button> Billing Adress</template>
        </SortIconsComponent>
      </div>
    </template>
    <!-- Mobile Card Headers -->
    <template #mobile-card-headers="item">
      <div class="mb-3">
        <input
          type="checkbox"
          class="form-checkbox h-6 w-6 text-blue-400 transition duration-150 ease-in-out"
          v-model="selectedItems"
          :value="item.item.id"
        />
      </div>
      <div class="text-gray-700 font-extrabold mb-1">First name:</div>
      <div class="text-gray-900">{{ item.item.firstName }}</div>
      <div class="text-gray-700 font-extrabold mb-1">Last name:</div>
      <div class="text-gray-900">{{ item.item.lastName }}</div>
      <div class="text-gray-700 font-extrabold mb-1">Age:</div>
      <div class="text-gray-900">{{ item.item.age }}</div>
      <div class="text-gray-700 font-extrabold mb-1">Billing Address:</div>
      <div class="text-gray-900">{{ item.item.billingAdress }}</div>
    </template>
    <!-- Mobile Card Buttons -->
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
          @click="exportCustomer(item.id)"
          class="text-green-400 hover:text-green-600 hover:font-medium cursor-pointer"
        >
          Export
        </button>
      </div>
    </template>

    <!-- Table Header -->

    <template #table-header>
      <div
        class="bg-teal-400 p-3 flex-no-wrap rounded-l-lg mb-0 text-white grid grid-cols-12 divide-x divide-gray-300"
      >
        <div class="p-2 text-left font-bold col-span-1">Nr</div>
        <div class="p-2 text-left font-bold col-span-2">
          <SortIconsComponent
            column="firstName"
            :sortDirections="sortDirections['firstName']"
            @sort-column="sortColumn('firstName')"
          >
            <template #sort-button>First name</template>
          </SortIconsComponent>
        </div>
        <div class="p-2 text-left font-bold col-span-2">
          <SortIconsComponent
            column="lastName"
            :sortDirections="sortDirections['lastName']"
            @sort-column="sortColumn('lastName')"
          >
            <template #sort-button>Last name</template>
          </SortIconsComponent>
        </div>
        <div class="p-2 text-left font-bold col-span-2">
          <SortIconsComponent
            column="age"
            :sortDirections="sortDirections['age']"
            @sort-column="sortColumn('age')"
          >
            <template #sort-button>Age</template>
          </SortIconsComponent>
        </div>
        <div class="p-2 text-left font-bold col-span-2">
          <SortIconsComponent
            column="billingAdress"
            :sortDirections="sortDirections['billingAdress']"
            @sort-column="sortColumn('billingAdress')"
          >
            <template #sort-button>Billing address</template>
          </SortIconsComponent>
        </div>

        <div class="p-2 text-center font-bold col-span-3">Actions</div>
      </div>
    </template>

    <!-- Body Item -->
    <template #body-item="{ item, index }">
      <div
        class="grid grid-cols-12 divide-x divide-gray-300 p-3 border-b hover:bg-gray-100"
      >
        <div class="p-2 text-left col-span-1">
          <input
            :value="item.id"
            v-model="selectedItems"
            type="checkbox"
            class="form-checkbox text-blue-400 h-5 w-5"
          />
          <span class="ml-1">{{ index + 1 }}</span>
        </div>
        <div class="p-2 text-left col-span-2">
          {{ item.firstName }}
        </div>
        <div class="p-2 text-left col-span-2">
          {{ item.lastName }}
        </div>
        <div class="p-2 text-left col-span-2">
          {{ item.age }}
        </div>
        <div class="p-2 text-left col-span-2">
          {{ item.billingAdress }}
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
            @click="exportCustomer(item.id)"
            class="text-green-400 hover:text-green-600 hover:font-medium cursor-pointer ml-1"
          >
            Export
          </button>
        </div>
      </div>
    </template>
  </TableComponent>

  <p v-if="customers.length === 0" class="text-red-500 text-center mt-4">
    No customers added yet
  </p>

  <!-- Load More -->
  <div class="sm:flex sm:justify-end mb-5">
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
import ConfirmActionModal from "@/components/ConfirmActionModal.vue";
import { useCustomerStore } from "@/store/customer.js";
import CustomerModal from "./components/CustomerModal.vue";
import SearchComponent from "@/components/SearchComponent.vue";
import TableComponent from "@/components/TableComponent.vue";
import SortIconsComponent from "@/components/SortIconsComponent.vue";

export default {
  components: {
    ConfirmActionModal,
    CustomerModal,
    SearchComponent,
    TableComponent,
    SortIconsComponent,
  },
  data() {
    return {
      showDeleteAlert: false,
      customers: [],
      pageSize: 10,
      displayedCustomers: [],
      loadedCustomersCount: 0,
      updatedCustomer: {},
      openCustomerModal: false,
      selectedItems: [],
      sortDirections: {
        firstName: "desc",
        lastName: "desc",
        age: "desc",
        billingAdress: "desc",
      },
      sortHeader: "",
      searchActive: false,
      itemToDelete: null,
      showConfirmModal: false,
    };
  },
  // Load initial customer data
  created() {
    this.loadCustomers();
  },
  computed: {
    customerStore() {
      return useCustomerStore();
    },
    // Check if more customers can be loaded
    canLoadMore() {
      return (
        this.loadedCustomersCount < this.customers.length && !this.searchActive
      );
    },
    selectedCount() {
      // Count of selected items
      return this.selectedItems.length;
    },
    showNoDataMessage() {
      // Determine if a "No data found" message should be displayed
      return this.displayedCustomers.length === 0 && this.searchActive;
    },
  },
  methods: {
    // Function to load customers from the API
    async loadCustomers() {
      this.customers = await this.customerStore.getCustomers();
      this.displayedCustomers = this.customers.slice(0, this.pageSize);
      this.loadedCustomersCount = this.displayedCustomers.length;
    },
    loadMoreCustomers() {
      // Load more customers as the user requests
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
    // Update displayed customers based on search filter
    async updateDisplayedCustomers(searchFilter) {
      if (searchFilter) {
        const searchValue = searchFilter.toLowerCase();
        this.displayedCustomers = await this.customerStore.getCustomers(
          searchValue
        );
        this.searchActive = true;
      } else {
        this.loadCustomers();
        this.searchActive = false;
      }
    },
    openModal(customer) {
      // Open the modal to add or update a customer
      if (customer) {
        this.updatedCustomer = customer;
      } else {
        this.updatedCustomer = {};
      }
      this.openCustomerModal = true;
    },
    closeModal() {
      // Close the customer modal
      this.openCustomerModal = false;
    },
    submitDeleting(item) {
      this.itemToDelete = item;
      this.showConfirmModal = true;
    },
    // Delete customer(s)
    async deleteCustomer() {
      if (this.itemToDelete) {
        if (this.selectedItems.length > 0) {
          await this.customerStore.deleteCustomer(this.selectedItems);
          this.selectedItems.length = 0;
        } else {
          await this.customerStore.deleteCustomer(this.itemToDelete.id);
        }
        this.itemToDelete = null;
        this.showConfirmModal = false;
      }

      this.loadCustomers();
    },
    async sortColumn(column) {
      // Sort the customers based on the selected column
      if (this.sortDirections[column] === "asc") {
        this.sortDirections[column] = "desc";
      } else {
        this.sortDirections[column] = "asc";
      }
      this.sortHeader = column;
      this.sortDirection = this.sortDirections[column];

      await this.customerStore.sortCustomers(
        this.sortHeader,
        this.sortDirection
      );

      this.filteredCustomers = this.customerStore.customers;
      // Update displayed customers from filtered customers
      this.displayedCustomers = this.filteredCustomers.slice(0, this.pageSize);
      this.loadedCustomersCount = this.displayedCustomers.length;
    },
    async exportCustomer(id) {
      if (id) {
        await this.customerStore.exportSelected(id);
      } else {
        await this.customerStore.exportSelected(this.selectedItems);
        this.selectedItems = [];
      }
    },
  },
};
</script>
