<template>
  <ProductModal :updatedProduct="updatedProduct" :modalActive="openProductModal" @close-modal="closeModal"
    @productAdded="loadProducts()" @productUpdated="loadProducts()" />

  <!-- Add new Product -->
  <button @click="openModal()"
    class="w-full md:w-2/5 bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mb-4 rounded">Add
    new product</button>


  <!-- Search field -->
  <SearchComponent @filtered-results="updateDisplayedProducts" :store-getter="productStore.getProducts"
    :place-holder="'Search products'" />

  <p v-if="showNoDataMessage" class="text-red-500 text-center mt-4">
    No data found.
  </p>

  <!-- Products Table -->
  <TableComponent :headers="tableHeaders" :item-props="itemProps" :items="displayedProducts" @update-item="openModal"
    @delete-item="deleteProduct" />

  <!-- Load More -->
  <div class="flex justify-end">
    <button v-if="canLoadMore" @click="loadMoreProducts"
      class="bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mt-4 rounded">
      Load More
    </button>
  </div>
</template>

<script>
import { useProductStore } from '@/store/product.js'
import ProductModal from './components/ProductModal.vue'
import SearchComponent from '@/components/SearchComponent.vue'
import TableComponent from '@/components/TableComponent.vue'

export default {
  components: {
    ProductModal,
    SearchComponent,
    TableComponent
  },
  data() {
    return {
      tableHeaders: ['Name', 'Price', 'Stock', 'SKU'],
      itemProps: ['name', 'price', 'stock', 'sku'],
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
    async loadProducts() {
      this.products = await this.productStore.getProducts()
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
    async deleteProduct(product) {
      await this.productStore.deleteProduct(product)
      this.loadProducts()
    },
    updateDisplayedProducts(filteredProducts) {
      this.displayedProducts = filteredProducts
      this.showNoDataMessage = this.displayedProducts.length === 0
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

