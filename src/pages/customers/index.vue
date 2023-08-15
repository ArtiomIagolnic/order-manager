<template>
  <!-- Modal -->
  <CustomerModal @customerAdded="loadCustomers()" />
  <!-- Search Field -->
  <div class="flex mb-4">
    <input v-model="filters" @input="resetFilter" type="text"
      class="border border-gray-300 rounded-md py-2 px-4 flex-grow" placeholder="Search Customer" required />
    <button @click="filteredCustomers" class="bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 ml-2 rounded">
      Search
    </button>
  </div>
  <p v-if="showNoDataMessage" class="text-red-500 text-center mt-4">
    No data found.
  </p>
  <p v-if="customers.length===0" class="text-red-500 text-center mt-4">
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
          <th class="py-2 px-4 text-left">Bought Product</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(customer, i) in displayedCustomers" :key="customer.id">
          <td class="py-2 px-4">{{ i + 1 }}</td>
          <td class="py-2 px-4">{{ customer.firstName }}</td>
          <td class="py-2 px-4">{{ customer.lastName }}</td>
          <td class="py-2 px-4">{{ customer.age }}</td>

          <td class="py-2 px-4 ">
            <ModalWindow @openModal="openModal(customer.boughtProduct)" :title="customer.boughtProduct"
              classes=" hover:font-semibold rounded-lg cursor-pointer">
              <template #table>
                <h2 class="text-xl font-bold mb-4">Product</h2>
                <form class="w-full space-y-4 mb-4">
                  <div>
                    <label for="name" class="text-gray-700">
                      Name
                    </label>
                    <input disabled="true" type="text" id="name" v-model="selectedProduct.name"
                      class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label for="price" class="text-gray-700">Price</label>
                    <input disabled="true" type="text" id="price" v-model="selectedProduct.price"
                      class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label for="stock" class="text-gray-700">Stock</label>
                    <input type="number" id="stock" v-model="selectedProduct.stock" disabled="true"
                      class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label for="sku" class="text-gray-700">SKU</label>
                    <input type="number" id="sku" v-model="selectedProduct.sku" disabled="true"
                      class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                  </div>
                </form>
              </template>

            </ModalWindow>
          </td>

          <div class="buttons flex p-1">
            <ModalWindow @openModal="openModal(customer)" :forceClose="changedVal" title="Update"
              classes="bg-green-500 mr-2 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              <template #table>
                <h2 class="text-xl font-bold mb-4">Update customer</h2>
                <form @submit.prevent="updateCustomer" class="w-full space-y-4">
                  <div>
                    <label for="firstName" class="text-gray-700">
                      First Name:
                    </label>
                    <input type="text" id="firstName" v-model="updatedCustomer.firstName" required
                      class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label for="lastName" class="text-gray-700">
                      Last Name:
                    </label>
                    <input type="text" id="lastName" v-model="updatedCustomer.lastName" required
                      class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label for="age" class="text-gray-700">Age:</label>
                    <input type="number" id="age" v-model="updatedCustomer.age" required
                      class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label for="boughtProduct" class="text-gray-700">
                      Bought Product:
                    </label>
                    <select v-model="updatedCustomer.boughtProduct" name="boughtProduct" id="boughtProduct" required
                      class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500">
                      <option v-for="product in products" :key="product.id" :value="product.name">
                        {{ product.name }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <button type="submit"
                      class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mb-2 rounded w-full">
                      Update
                    </button>
                  </div>
                </form>
              </template>
            </ModalWindow>
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
import ModalWindow from '@/components/ModalWindow.vue'
import CustomerModal from './components/CustomerModal.vue'

export default {
  components: {
    CustomerModal,
    ModalWindow
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
      changedVal: false
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
    openModal(data) {
      if (typeof data === 'object') {
        this.updatedCustomer = JSON.parse(JSON.stringify(data))
      } else if (typeof data === 'string') {
        const existingProduct = this.products.find(product => product.name === data)
        if(existingProduct){
          this.selectedProduct = this.getProductByName(data)
        }else{
          this.selectedProduct = {
          name: "Product is not available",
          price: "",
          stock: "",
          sku: "",
        };
        }
      }
    },
    updateCustomer() {
      this.customerStore.updateCustomer(this.updatedCustomer)
      //Close modal window due changing value
      this.changedVal = !this.changedVal
      this.loadCustomers()
    },
    deleteCustomer(customer) {
      this.customerStore.deleteCustomer(customer)
      this.loadCustomers()
    },
    getProductByName(productName) {
      return this.products.find((product) => product.name === productName)
    }
  }
}
</script>
