<template>
  <ProductsModal :updatedProduct="updatedProduct" :modalActive="openProductModal" @close-modal="closeModal"
    @productAdded="loadProducts()" @productUpdated="loadProducts()" />

  <button @click="openModal()"
    class="w-full md:w-2/5 bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mb-4 rounded">Add
    new product</button>


  <!-- Search field -->
  <div class="flex mb-4">
    <input v-model="filters" @input="resetFilter" type="text"
      class="w-2/3 border border-gray-300 rounded-md py-2 px-4 flex-grow" placeholder="Search Products" required />
    <button @click="filteredProducts"
      class="w-1/3 bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 ml-2 rounded">
      Search
    </button>
  </div>
  <p v-if="showNoDataMessage" class="text-red-500 text-center mt-4">
    No data found.
  </p>

  <div class="container">
    <div v-if="windowWidth < 640">
      <table v-for="(product, i) in displayedProducts" :key="product.id"
        class="w-full flex flex-row flex-no-wrap rounded-lg overflow-hidden my-5">

        <thead class="text-white w-1/2">
          <tr class="bg-teal-400 flex flex-col flex-no wrap rounded-l-lg mb-2">
            <th class="p-3 text-left">Nr.</th>
            <th class="p-3 text-left">Name</th>
            <th class="p-3 text-left">Price</th>
            <th class="p-3 text-left">Stock</th>
            <th class="p-3 text-left">SKU</th>
            <th class="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody class="flex-1 w-1/2">
          <tr class="flex flex-col flex-no wrap mb-2">
            <td class="border-grey-light border hover:bg-gray-100 p-3">{{ i + 1 }}</td>
            <td class="border-grey-light border hover:bg-gray-100 p-3 truncate">{{ product.name }}</td>
            <td class="border-grey-light border hover-bg-gray-100 p-3 truncate">{{ product.price }}€</td>
            <td class="border-grey-light border hover-bg-gray-100 p-3 truncate"> {{ product.stock }}</td>
            <td class="border-grey-light border hover-bg-gray-100 p-3 truncate"> {{ product.sku }}</td>
            <td class="border-grey-light border hover:bg-gray-100 p-3 flex justify-between">
              <span @click="openModal(product)"
                class="text-blue-400 hover:text-blue-600 hover:font-medium cursor-pointer">Update</span>
              <span @click="deleteOrder(product)"
                class="text-red-400 hover:text-red-600 hover:font-medium cursor-pointer">Delete</span>
            </td>
          </tr>
        </tbody>


      </table>
    </div>

    <!-- Desktop version -->
    <div v-else>
      <table class="w-full flex flex-row flex-no-wrap bg-white rounded-lg overflow-hidden shadow-lg my-5">
        <thead class="text-white">
          <tr class="bg-teal-400 flex-col flex-no wrap table-row rounded-l-lg rounded-none mb-0">
            <th class="p-3 text-left">Nr.</th>
            <th class="p-3 text-left">Name</th>
            <th class="p-3 text-left">Price</th>
            <th class="p-3 text-left">Stock</th>
            <th class="p-3 text-left">SKU</th>
            <th class="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody class="flex-none">
          <tr v-for="(product, i) in displayedProducts" :key="product.id" class=" flex-col flex-no wrap  mb-0">
            <td class="border-grey-light border hover:bg-gray-100 p-3">{{ i + 1 }}</td>
            <td class="border-grey-light border hover:bg-gray-100 p-3 truncate">{{ product.name }}</td>
            <td class="border-grey-light border hover:bg-gray-100 p-3 truncate">{{ product.price }}€</td>
            <td class="border-grey-light border hover:bg-gray-100 p-3 truncate">{{ product.stock }}</td>
            <td class="border-grey-light border hover:bg-gray-100 p-3 truncate">{{ product.sku }}</td>
            <td class="border-grey-light border hover:bg-gray-100 p-3 flex justify-around">
              <button @click="openModal(product)"
                class="text-blue-400 hover:text-blue-600 hover:font-medium cursor-pointer">Update</button>
              <button @click="deleteProduct(product)"
                class="text-red-400 hover:text-red-600 hover:font-medium cursor-pointer">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
      filters: '',
      pageSize: 10,
      displayedProducts: [],
      loadedProductsCount: 0,
      showNoDataMessage: false,
      updatedProduct: {},
      openProductModal: false,
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
    },
    async filteredProducts() {
      if (this.filters.trim() !== '') {
        this.displayedProducts = await this.productStore.getProducts(this.filters)
      } else {
        this.displayedProducts = await this.productStore.getProducts()
      }

      this.showNoDataMessage = this.displayedProducts.length === 0
    },
    resetFilter() {
      if (!this.filters) {
        this.filters = ''
        this.filteredProducts()
      }
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