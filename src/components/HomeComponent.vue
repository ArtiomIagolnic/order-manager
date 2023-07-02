<template>
  <div class="mx-auto flex justify-center items-center mt-8">
    <div class="container mx-auto bg-white p-8 rounded-lg shadow">
      <h1 class="text-2xl font-bold mb-4">Customer Management</h1>

      <!-- Add New Customer Button -->
      <button
        @click="openModal"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4 rounded"
      >
        Add New Customer
      </button>

      <!-- Modal -->

      <VueFinalModal
        class="mx-auto flex justify-center items-center"
        content-class="mt-8 max-w-lg container mx-auto flex flex-col p-8 bg-white dark:bg-black rounded border border-gray-100 dark:border-gray-800"
        v-model="showModal"
      >
        <div class="flex flex-col items-center">
          <h2 class="text-xl font-bold mb-4">Add New Customer</h2>
          <form @submit.prevent="addCustomer" class="w-full space-y-4">
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
            <div class="flex justify-between">
              <button
                @click="closeModal"
                class="bg-red-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Add Customer
              </button>
            </div>
          </form>
        </div>
      </VueFinalModal>

      <!-- Search Field -->
      <div class="flex mb-4">
        <input
          v-model="searchQuery"
          type="text"
          class="border border-gray-300 rounded-md py-2 px-4 flex-grow"
          placeholder="Search Customer"
        />
        <button
          @click="filteredCustomers"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-2 rounded"
        >
          Search
        </button>
      </div>

      <!-- Customer Table -->
      <table
        v-if="!searchResults || searchResults.length === 0"
        class="min-w-full"
      >
        <thead>
          <tr>
            <th class="py-2 px-4">ID</th>
            <th class="py-2 px-4">First Name</th>
            <th class="py-2 px-4">Last Name</th>
            <th class="py-2 px-4">Age</th>
            <th class="py-2 px-4">Bought Product</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in customers" :key="customer.id">
            <td class="py-2 px-4">{{ customer.id }}</td>
            <td class="py-2 px-4">{{ customer.firstName }}</td>
            <td class="py-2 px-4">{{ customer.lastName }}</td>
            <td class="py-2 px-4">{{ customer.age }}</td>
            <td class="py-2 px-4">{{ customer.boughtProduct }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Search results table -->
      <table
        v-if="searchQuery && searchResults && searchResults.length > 0"
        class="min-w-full"
      >
        <thead>
          <tr>
            <th class="py-2 px-4">ID</th>
            <th class="py-2 px-4">First Name</th>
            <th class="py-2 px-4">Last Name</th>
            <th class="py-2 px-4">Age</th>
            <th class="py-2 px-4">Bought Product</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in searchResults" :key="customer.id">
            <td class="py-2 px-4">{{ customer.id }}</td>
            <td class="py-2 px-4">{{ customer.firstName }}</td>
            <td class="py-2 px-4">{{ customer.lastName }}</td>
            <td class="py-2 px-4">{{ customer.age }}</td>
            <td class="py-2 px-4">{{ customer.boughtProduct }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { useAdminStore } from '@/store/admin.js'
import { VueFinalModal } from 'vue-final-modal'
export default {
  components: {
    VueFinalModal,
  },
  data() {
    return {
      customer: {
        firstName: '',
        lastName: '',
        age: '',
        boughtProduct: '',
      },
      searchQuery: '',
      searchResults: [],
      adminStore: null,
      showModal: false,
    }
  },
  created() {
    this.adminStore = useAdminStore()
    this.adminStore.initializeCustomers() // Initialize the store when the component is created
  },
  computed: {
    customers() {
      return this.adminStore.all
    },
  },
  methods: {
    addCustomer() {
      this.adminStore.addCustomer(this.customer)

      this.customer.firstName = ''
      this.customer.lastName = ''
      this.customer.age = ''
      this.customer.boughtProduct = ''

      this.closeModal()
    },
    filteredCustomers() {
      if (this.searchQuery) {
        this.searchResults = this.adminStore.search(this.searchQuery)
      } else {
        this.searchResults = []
      }
    },
    openModal() {
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
  },
}
</script>
