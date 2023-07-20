<template>
  <!-- Modal -->

  <CustomerModal
    :modalTitle="modalTitle"
    :handleModalAction="handleModalAction"
    :modalActionLabel="modalActionLabel"
    @openModal="openModal"
    @closeModal="closeModal"
  >
    <div>
      <label for="firstName" class="text-gray-700">First Name:</label>
      <input
        type="text"
        id="firstName"
        v-model="customer.firstName"
        required
        class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      />
    </div>
    <div>
      <label for="lastName" class="text-gray-700">Last Name:</label>
      <input
        type="text"
        id="lastName"
        v-model="customer.lastName"
        required
        class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      />
    </div>
    <div>
      <label for="age" class="text-gray-700">Age:</label>
      <input
        type="number"
        id="age"
        v-model="customer.age"
        required
        class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      />
    </div>
    <div>
      <label for="boughtProduct" class="text-gray-700">
        Bought Product:
      </label>
      <input
        type="text"
        id="boughtProduct"
        v-model="customer.boughtProduct"
        required
        class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
      />
    </div>
  </CustomerModal>

  <!-- Search Field -->
  <div class="flex mb-4">
    <input
      v-model="filters"
      @input="resetFilter"
      type="text"
      class="border border-gray-300 rounded-md py-2 px-4 flex-grow"
      placeholder="Search Customer"
      required
    />
    <button
      @click="filteredCustomers"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-2 rounded"
    >
      Search
    </button>
  </div>
  <p v-if="showNoDataMessage" class="text-red-500 text-center mt-4">
    No data found.
  </p>
  <!-- Customer Table -->
  <table class="min-w-full">
    <thead>
      <tr>
        <th class="py-2 px-4 text-left">Nr.</th>
        <th class="py-2 px-4 text-left">First Name</th>
        <th class="py-2 px-4 text-left">Last Name</th>
        <th class="py-2 px-4 text-left">Age</th>
        <th class="py-2 px-4 text-left">Bought Product</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(customer, i) in displayedCustomers" :key="customer.id">
        <td class="py-2 px-4">{{ i + 1 }}</td>
        <td class="py-2 px-4">{{ customer.firstName }}</td>
        <td class="py-2 px-4">{{ customer.lastName }}</td>
        <td class="py-2 px-4">{{ customer.age }}</td>
        <td class="py-2 px-4">{{ customer.boughtProduct }}</td>
        <div class="buttons flex p-1">
          <button
            @openModal="openModal(customer)"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
          >
            Update
          </button>
          <button
            @click="deleteCustomer(customer)"
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
        </div>
      </tr>
    </tbody>
  </table>
  <div class="flex justify-end">
    <button
      v-if="canLoadMore"
      @click="loadMoreCustomers"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded"
    >
      Load More
    </button>
  </div>
</template>

<script>
import { useAdminStore } from '@/store/admin.js'
import CustomerModal from './components/CustomerModal.vue'
export default {
  components: {
    CustomerModal,
  },
  data() {
    return {
      customer: {
        firstName: '',
        lastName: '',
        age: '',
        boughtProduct: '',
      },
      customers: [],
      filters: '',
      pageSize: 10,
      displayedCustomers: [],
      loadedCustomersCount: 0,
      modalTitle: '',
      modalActionLabel: '',

      showNoDataMessage: false,
    }
  },
  mounted() {
    this.loadCustomers()
  },
  computed: {
    adminStore() {
      return useAdminStore()
    },
    canLoadMore() {
      return this.loadedCustomersCount < this.customers.length
    },
  },
  methods: {
    some() {
      console.log(arguments)
    },
    loadCustomers() {
      this.customers = this.adminStore.getCustomers()
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
      if (this.filters && !this.showNoDataMessage) {
        this.displayedCustomers = this.adminStore.getCustomers(this.filters)
        this.showNoDataMessage = this.customers.length === 0
      } else {
        this.displayedCustomers = this.adminStore.getCustomers()
        this.showNoDataMessage = false
      }
    },
    resetFilter() {
      if (!this.filters) {
        this.filters = ''
        this.filteredCustomers()
      }
    },

    addCustomer() {
      this.adminStore.addCustomer(this.customer)

      this.customer.firstName = ''
      this.customer.lastName = ''
      this.customer.age = ''
      this.customer.boughtProduct = ''

      this.closeModal()
    },
    updateCustomer(customer) {
      this.adminStore.updateCustomer(customer)
      this.closeModal()
      this.loadCustomers()
    },
    deleteCustomer(customer) {
      this.adminStore.deleteCustomer(customer)
      this.loadCustomers()
    },
    handleModalAction() {
      if (this.modalTitle === 'Add new customer') {
        this.addCustomer()
      } else if (this.modalTitle === 'Update customer') {
        this.updateCustomer(this.customer)
      }
    },
    openModal(customer) {
      if (customer) {
        this.modalTitle = 'Update customer'
        this.modalActionLabel = 'Update customer'

        this.customer = { ...customer }
      } else {
        this.modalTitle = 'Add new customer'
        this.modalActionLabel = 'Add customer'

        this.customer.firstName = ''
        this.customer.lastName = ''
        this.customer.age = ''
        this.customer.boughtProduct = ''
      }
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
  },
}
</script>
