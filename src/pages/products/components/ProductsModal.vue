<template>
  <ModalWindow @openModal="openModal" :forceClose="changedVal" title="Add new product"
    classes="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4 rounded">
    <template #table>
      <h2 class="text-xl font-bold mb-4">Add new product</h2>
      <form @submit.prevent="addProduct" class="w-full space-y-4">
        <div>
          <label for="name" class="text-gray-700">Name</label>
          <input type="text" id="name" v-model="product.name" required
            class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label for="price" class="text-gray-700">Price</label>
          <input type="text" id="price" v-model="product.price" required
            class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label for="stock" class="text-gray-700">Stock</label>
          <input type="text" id="stock" v-model="product.stock" required
            class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label for="sku" class="text-gray-700">SKU</label>
          <input type="number" id="sku" v-model="product.sku" required
            class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
        </div>
        <div class="">
          <button type="submit" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mb-2 rounded w-full">
            Add new product
          </button>
        </div>
      </form>
    </template>
  </ModalWindow>
</template>

<script>
import ModalWindow from '@/components/ModalWindow.vue'
import { useProductStore } from '@/store/product.js'
export default {
  components: {
    ModalWindow
  },
  data() {
    return {
      product: {
        name: '',
        price: '',
        stock: '',
        sku: ''
      },
      changedVal: false
    }
  },
  computed: {
    productStore() {
      return useProductStore()
    }
  },
  methods: {
    openModal() {
      this.product.name = ''
      this.product.price = ''
      this.product.stock = ''
      this.product.sku = ''
    },
    addProduct() {
      this.productStore.addProduct(this.product)
      //Close modal window due changing value
      this.changedVal = !this.changedVal
      this.product.name = ''
      this.product.price = ''
      this.product.stock = ''
      this.product.sku = ''
      this.$emit('productAdded')
    }
  },
  emits: ['productAdded']
}
</script>
