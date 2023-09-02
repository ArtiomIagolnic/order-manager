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

  <!-- mobile version -->
  <div class="container">
    <div v-if="windowWidth < 640">
      <table v-for="(customer, i) in displayedCustomers" :key="customer.id"
        class="w-full flex flex-row flex-no-wrap rounded-lg overflow-hidden my-5">

        <thead class="text-white">
          <tr class="bg-teal-400 flex flex-col flex-no wrap rounded-l-lg mb-2">
            <th class="p-2 text-left text-m">Nr</th>
            <th class="p-2 text-left text-m">Name</th>
            <th class="p-2 text-left text-m">Age</th>
            <th class="p-2 text-left text-m">Address</th>
            <th class="p-2 text-left text-m" width="110px">Actions</th>
          </tr>
        </thead>

        <tbody class="flex-1">
          <tr class="flex flex-col flex-no wrap mb-2">
            <td class="border-grey-light border hover:bg-gray-100 p-2">{{ i + 1 }}</td>
            <td class="border-grey-light border hover:bg-gray-100 p-2 truncate">{{ customer.firstName + ' ' +
              customer.lastName }}</td>
            <td class="border-grey-light border hover-bg-gray-100 p-2 truncate">{{ customer.age }}</td>
            <td class="border-grey-light border hover-bg-gray-100 p-2 truncate">{{ customer.billingAdress }}</td>
            <td class="border-grey-light border hover:bg-gray-100 p-2 flex justify-around">
              <span class="text-blue-400 hover:text-blue-600 hover:font-medium cursor-pointer">Update</span>
              <span class="text-red-400 hover:text-red-600 hover:font-medium cursor-pointer">Delete</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Desktop version -->
    <div v-else>
      <table class="w-full flex flex-row flex-no-wrap bg-white rounded-lg overflow-hidden shadow-lg my-5">
        <thead class="text-white">
          <tr class="bg-teal-400 flex-col flex-no wrap table-row rounded-l-lg rounded-none mb-2 sm:mb-0">
            <th class="p-3 text-left">Nr</th>
            <th class="p-3 text-left">Name</th>
            <th class="p-3 text-left">Age</th>
            <th class="p-3 text-left">Billing Address</th>
            <th class="p-3 text-center" >Actions</th>
          </tr>
        </thead>
        <tbody class="flex-none">
          <tr v-for="(customer, i) in displayedCustomers" :key="customer.id" class=" flex-col flex-no wrap mb-0">
            <td class="border-grey-light border hover:bg-gray-100 p-3">{{ i + 1 }}</td>
            <td class="border-grey-light border hover:bg-gray-100 p-3 truncate">{{ customer.firstName + ' ' +
              customer.lastName }}</td>
            <td class="border-grey-light border hover:bg-gray-100 p-3 truncate">{{ customer.age }}</td>
            <td class="border-grey-light border hover:bg-gray-100 p-3 truncate">{{ customer.billingAdress }}</td>
            <td class="border-grey-light border hover:bg-gray-100 p-3 flex justify-around">
              <button @click="openModal(customer)"
                class="text-blue-400 hover:text-blue-600 hover:font-medium cursor-pointer">Update</button>
              <button @click="deleteOrder(customer)"
                class="text-red-400 hover:text-red-600 hover:font-medium cursor-pointer">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
      openCustomerModal: false,
      windowWidth: window.innerWidth
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize);
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
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
    },

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
    },
    onResize() {
      this.windowWidth = window.innerWidth
    }
  }
}
</script>

<style>
html,
body {
  height: 100%;
}

@media (min-width: 640px) {
  table {
    display: inline-table !important;
  }

  thead tr:not(:first-child) {
    display: none;
  }
}

td:not(:last-child) {
  border-bottom: 0;
}

th:not(:last-child) {
  border-bottom: 2px solid rgba(0, 0, 0, .1);
}
</style>