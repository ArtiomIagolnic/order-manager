<template>
  <ProductsModal :updatedProduct="updatedProduct" :modalActive="openProductModal" @close-modal="closeModal"
    @productAdded="loadProducts()" @productUpdated="loadProducts()" />

  <button @click="openModal()"
    class="w-2/5 bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mb-4 rounded">Add
    new product</button>
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
            <button @click="openModal(product)"
              class="bg-green-500 mr-2 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Update
            </button>
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
export default {
  components: {
    ProductsModal
  },
  data() {
    return {
      products: [],
      pageSize: 10,
      displayedProducts: [],
      loadedProductsCount: 0,
      showNoDataMessage: false,
      updatedProduct: {},
      openProductModal: false
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
      if (product) {
        this.updatedProduct = product
      } else {
        this.updatedProduct = {}
      }
      this.openProductModal = true
    },
    closeModal() {
      this.openProductModal = false
    }
  }
}
</script>
