<template>
  <!-- Modal -->
  <CustomerModal :updatedCustomer="updatedCustomer" :modalActive="openCustomerModal" @close-modal="closeModal"
    @customerAdded="loadCustomers()" @customerUpdated="loadCustomers()" />
  <button @click="openModal()"
    class="w-full md:w-2/5 bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mb-4 rounded">Add
    new customer</button>
  <!-- Search Field -->
  <div class="flex mb-4">
    <input v-model="filters" @input="resetFilter" type="text"
      class="w-2/3 border border-gray-300 rounded-md py-2 px-4 flex-grow" placeholder="Search Customer" required />
    <button @click="filteredCustomers"
      class="w-1/3 bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 ml-2 rounded">
      Search
    </button>
  </div>
  <p v-if="showNoDataMessage" class="text-red-500 text-center mt-4">
    No data found.
  </p>
  <p v-if="customers.length === 0" class="text-red-500 text-center mt-4">
    No customers added yet
  </p>

  <!-- Customer Table -->
  <div class="overflow-x-auto">
    <table class="min-w-full table-auto">
      <thead>
        <tr>
          <th class="py-2 px-4 text-left">Nr.</th>
          <th class="py-2 px-4 text-left">First Name</th>
          <th class="py-2 px-4 text-left">Last Name</th>
          <th class="py-2 px-4 text-left">Age</th>
          <th class="py-2 px-4 text-left">Billing Adress</th>
          <th class="py-2 px-4 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(customer, i) in displayedCustomers" :key="customer.id">
          <td class="py-2 px-4">{{ i + 1 }}</td>
          <td class="py-2 px-4">{{ customer.firstName }}</td>
          <td class="py-2 px-4">{{ customer.lastName }}</td>
          <td class="py-2 px-4">{{ customer.age }}</td>
          <td class="py-2 px-4">{{ customer.billingAdress }}</td>

          <div class="buttons flex p-1">
            <button @click="openModal(customer)"
              class="bg-green-500 mr-2 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Update
            </button>

            <button @click="deleteCustomer(customer)"
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Delete
            </button>
          </div>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="flex justify-end">
    <button v-if="canLoadMore" @click="loadMoreCustomers"
      class="w-2/5 bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mt-4 rounded">
      Load More
    </button>
  </div>
</template>

<script>
import { useCustomerStore } from '@/store/customer.js'
import { useProductStore } from '@/store/product.js'
import CustomerModal from './components/CustomerModal.vue'

export default {
  components: {
    CustomerModal
  },
  data() {
    return {
      customers: [],
      filters: '',
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
    products() {
      return useProductStore().getProducts()
    },
    canLoadMore() {
      return this.loadedCustomersCount < this.customers.length
    }
  },
  methods: {
    loadCustomers() {
      this.customers = this.customerStore.getCustomers()
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
    filteredCustomers() {
      if (this.filters.trim() !== '') {
        this.displayedCustomers = this.customerStore.getCustomers(this.filters)
      } else {
        this.displayedCustomers = this.customerStore.getCustomers()
      }
      this.showNoDataMessage = this.displayedCustomers.length === 0
    },
    resetFilter() {
      if (!this.filters) {
        this.filters = ''
        this.filteredCustomers()
      }
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
    deleteCustomer(customer) {
      this.customerStore.deleteCustomer(customer)
      this.loadCustomers()
    }
  }
}
</script>
