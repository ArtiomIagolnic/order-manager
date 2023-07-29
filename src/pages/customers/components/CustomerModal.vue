<template>
  <ModalWindow @openModal="openModal()">
    <template #table>
      <h2 class="text-xl font-bold mb-4">{{ modalTitle }}</h2>
      <form @submit.prevent="handleModalAction" class="w-full space-y-4">
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
        <div class="">
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mb-2 rounded w-full"
          >
            {{ modalActionLabel }}
          </button>
        </div>
      </form>
    </template>
  </ModalWindow>
</template>
<script>
import ModalWindow from '@/components/ModalWindow.vue'
import { useAdminStore } from '@/store/admin.js'
export default {
  components: {
    ModalWindow,
  },
  data() {
    return {
      customer: {
        firstName: '',
        lastName: '',
        age: '',
        boughtProduct: '',
      },
      modalActionLabel: '',
      modalTitle: '',
    }
  },
  computed: {
    adminStore() {
      return useAdminStore()
    },
  },
  methods: {
    addCustomer() {
      this.adminStore.addCustomer(this.customer)

      this.customer.firstName = ''
      this.customer.lastName = ''
      this.customer.age = ''
      this.customer.boughtProduct = ''
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
    },
  },
}
</script>
