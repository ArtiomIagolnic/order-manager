<template>
  <!-- Modal -->
  <CustomerModal :updatedCustomer="updatedCustomer" :modalActive="openCustomerModal" @close-modal="closeModal"
    @customerAdded="loadCustomers()" @customerUpdated="loadCustomers()" />

  <button @click="openModal()"
    class="w-full md:w-2/5 bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mb-4 rounded">Add
    new customer</button>

  <!-- Search Field -->
  <CustomerSearch @filtered-customers="updateDisplayedCustomers" />
  <p v-if="showNoDataMessage" class="text-red-500 text-center mt-4">
    No data found.
  </p>

  <!-- Displayed Table -->
  <CustomerTable :displayedCustomers="displayedCustomers" @update-customer="openModal"
    @delete-customer="deleteCustomer" />

  <p v-if="customers.length === 0" class="text-red-500 text-center mt-4">
    No customers added yet
  </p>

  <!-- Load More -->
  <div class="flex justify-end">
    <button v-if="canLoadMore" @click="loadMoreCustomers"
      class="w-2/5 bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mt-4 rounded">
      Load More
    </button>
  </div>
</template>

<script>
import { useCustomerStore } from '@/store/customer.js'
import CustomerModal from './components/CustomerModal.vue'
import CustomerSearch from './components/CustomerSearch.vue'
import CustomerTable from './components/CustomerTable.vue'

export default {
  components: {
    CustomerModal,
    CustomerSearch,
    CustomerTable
  },
  data() {
    return {
      customers: [],
      pageSize: 10,
      displayedCustomers: [],
      loadedCustomersCount: 0,
      showNoDataMessage: false,
      updatedCustomer: {},
      selectedProduct: {},
      openCustomerModal: false
    }
  },
  created() {
    this.loadCustomers()
  },
  computed: {
    customerStore() {
      return useCustomerStore()
    },
    canLoadMore() {
      return this.loadedCustomersCount < this.customers.length
    }
  },
  methods: {
    async loadCustomers() {
      this.customers = await this.customerStore.getCustomers()
      this.displayedCustomers = this.customers.slice(0, this.pageSize)
      this.loadedCustomersCount = this.displayedCustomers.length
    },
    loadMoreCustomers() {
      const remainingCustomers = this.customers.slice(
        this.loadedCustomersCount,
        this.loadedCustomersCount + this.pageSize,
      )
      this.displayedCustomers = [
        ...this.displayedCustomers,
        ...remainingCustomers,
      ]
      this.loadedCustomersCount += remainingCustomers.length
    },
    updateDisplayedCustomers(filteredCustomers) {
      this.displayedCustomers = filteredCustomers
      this.showNoDataMessage = this.displayedCustomers.length === 0
    },
    openModal(customer) {
      if (customer) {
        this.updatedCustomer = customer
      } else {
        this.updatedCustomer = {}
      }
      this.openCustomerModal = true
    },
    closeModal() {
      this.openCustomerModal = false
    },
    async deleteCustomer(customer) {
      await this.customerStore.deleteCustomer(customer)
      this.loadCustomers()
    }
  }
}
</script>
