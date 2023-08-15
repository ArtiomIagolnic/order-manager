<template>
  <ProductsModal @productAdded="loadProducts()" />
  <div class="overflow-x-auto">
    <table class="min-w-full table-auto">
      <thead>
        <tr>
          <th class="py-2 px-4 text-left">Nr.</th>
          <th class="py-2 px-4 text-left">Name</th>
          <th class="py-2 px-4 text-left">Price</th>
          <th class="py-2 px-4 text-left">Stock</th>
          <th class="py-2 px-4 text-left">SKU</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, i) in displayedProducts" :key="product.id">
          <td class="py-2 px-4">{{ i + 1 }}</td>
          <td class="py-2 px-4">{{ product.name }}</td>
          <td class="py-2 px-4">{{ product.price }}</td>
          <td class="py-2 px-4">{{ product.stock }}</td>
          <td class="py-2 px-4">{{ product.sku }}</td>
          <div class="buttons flex p-1">
            <ModalWindow @openModal="openModal(product)" :forceClose="changedVal" title="Update"
              classes="bg-green-500 mr-2 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              <template #table>
                <h2 class="text-xl font-bold mb-4">Update product</h2>
                <form @submit.prevent="updateProduct" class="w-full space-y-4">
                  <div>
                    <label for="name" class="text-gray-700">
                      Name
                    </label>
                    <input type="text" id="name" v-model="updatedProduct.name" required
                      class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label for="price" class="text-gray-700">Price</label>
                    <input type="text" id="price" v-model="updatedProduct.price" required
                      class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label for="stock" class="text-gray-700">Stock</label>
                    <input type="number" id="stock" v-model="updatedProduct.stock" required
                      class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
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
            <button @click="deleteProduct(product)"
              class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Delete
            </button>
          </div>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="flex justify-end">
    <button v-if="canLoadMore" @click="loadMoreProducts"
      class="bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mt-4 rounded">
      Load More
    </button>
  </div>
</template>

<script>
import { useProductStore } from '@/store/product.js'
import ProductsModal from './components/ProductsModal.vue'
import ModalWindow from '@/components/ModalWindow.vue'
export default {
  components: {
    ProductsModal,
    ModalWindow
  },
  data() {
    return {
      products: [],
      pageSize: 10,
      displayedProducts: [],
      loadedProductsCount: 0,
      showNoDataMessage: false,
      updatedProduct: {},
      changedVal: false
    }
  },
  created() {
    this.loadProducts()
  },
  computed: {
    productStore() {
      return useProductStore()
    },
    canLoadMore() {
      return this.loadedProductsCount < this.products.length
    }
  },
  methods: {
    loadProducts() {
      this.products = this.productStore.getProducts()
      this.displayedProducts = this.products.slice(0, this.pageSize)
      this.loadedProductsCount = this.displayedProducts.length
    },
    loadMoreProducts() {
      const remainingProducts = this.products.slice(
        this.loadedProductsCount,
        this.loadedProductsCount + this.pageSize,
      )
      this.displayedProducts = [...this.displayedProducts, ...remainingProducts]
      this.loadedProductsCount += remainingProducts.length
    },
    deleteProduct(product) {
      this.productStore.deleteProduct(product)
      this.loadProducts()
    },
    openModal(product) {
      this.updatedProduct = JSON.parse(JSON.stringify(product))
    },
    updateProduct() {
      this.productStore.updateProduct(this.updatedProduct)
      //Close modal window due changing value
      this.changedVal = !this.changedVal
      this.loadProducts()
    }
  }
}
</script>
