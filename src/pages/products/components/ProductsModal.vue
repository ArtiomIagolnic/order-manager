<template>
  <div v-show="modalActive" class="fixed inset-0 flex items-center justify-center z-50">
    <div class="bg-black bg-opacity-50 fixed inset-0" @click="$emit('close-modal')"></div>
    <div class="bg-white w-full md:w-2/3 lg:w-1/2 p-6 rounded-lg relative">
      <h2 class="text-xl font-bold mb-4">{{ modalTitle }}</h2>
      <form @submit.prevent="saveProduct" class="space-y-4">
        <div>
          <label for="name" class="text-gray-700">Name</label>
          <input type="text" id="name" v-model="product.name" required
            class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label for="price" class="text-gray-700">Price</label>
          <input type="number" id="price" v-model="product.price" required
            class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label for="stock" class="text-gray-700">Stock</label>
          <input type="number" id="stock" v-model="product.stock" required
            class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label for="sku" class="text-gray-700">SKU</label>
          <input type="text" id="sku" v-model="product.sku" required
            class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
        </div>
        <div class="">
          <button type="submit" :class="buttonClass">
            {{ submitText }}
          </button>
        </div>
      </form>
      <button @click="$emit('close-modal')"
        class="bg-red-500 text-white hover:bg-blue-600 font-bold py-2 px-4 rounded w-full">Close</button>
    </div>
  </div>
</template>

<script>
import { useProductStore } from '@/store/product.js'
export default {
  props: {
    modalActive: {
      type: Boolean,
      default: false
    },
    updatedProduct: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    productStore() {
      return useProductStore()
    },
    product() {
      if (Object.keys(this.updatedProduct).length > 0) {
        return this.updatedProduct
      } else {
        return {
          name: '',
          price: '',
          stock: '',
          sku: ''
        }
      }
    },
    isUpdating() {
      return Object.keys(this.updatedProduct).length > 0
    },
    modalTitle() {
      return this.isUpdating ? 'Update Product' : 'Add new Product'
    },
    submitText() {
      return this.isUpdating ? 'Update Product' : 'Add new Product'
    },
    buttonClass() {
      return this.isUpdating ? 'mb-2 bg-blue-500 text-white hover:bg-blue-600 font-bold py-2 px-4 rounded w-full' : 'w-full mb-2 text-black bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mb-4 rounded'
    }
  },
  watch: {
    updatedProduct(newVal) {
      this.product = newVal;
    }
  },
  methods: {
    saveProduct() {
      if (Object.keys(this.updatedProduct).length > 0) {
        this.productStore.updateProduct(this.product)
        this.$emit('productUpdated')
        this.$emit('close-modal')
      } else {
        this.productStore.addProduct(this.product)
        this.$emit('productAdded')
        this.$emit('close-modal')
      }
    }
  },
  emits: ['productAdded', 'productUpdated', 'close-modal']
}
</script>
