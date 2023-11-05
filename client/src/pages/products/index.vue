<template>
  <!-- Confirm Action Modal -->
  <ConfirmActionModal
    v-if="showConfirmModal"
    type="danger"
    title="Confirm Action"
    width="sm"
    v-on:close="showConfirmModal = false"
  >
    <p class="text-gray-800">Are you sure you want you delete product(s)?</p>

    <div class="text-right mt-4">
      <button
        @click="showConfirmModal = false"
        class="px-4 py-2 text-sm text-gray-600 focus:outline-none hover:underline"
      >
        Cancel
      </button>
      <button
        @click="deleteProduct()"
        class="mr-2 px-4 py-2 text-sm rounded text-white bg-red-500 focus:outline-none hover:bg-red-400"
      >
        Delete
      </button>
    </div>
  </ConfirmActionModal>

  <!-- Modal -->
  <ProductModal
    :updatedProduct="updatedProduct"
    :modalActive="openProductModal"
    @close-modal="closeModal"
    @productAdded="loadProducts()"
    @productUpdated="loadProducts()"
  />

  <!-- Add new Product -->
  <button
    @click="openModal()"
    class="w-full md:w-2/5 bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mb-4 rounded"
  >
    <font-awesome-icon icon="fa-solid fa-plus" />
    Add new product
  </button>

  <!-- Search field -->
  <SearchComponent
    @filtered-results="updateDisplayedProducts"
    :place-holder="'Search products'"
  />

  <p v-if="showNoDataMessage" class="text-red-500 text-center mt-4">
    No data found.
  </p>

  <!-- Products Table -->
  <TableComponent
    :items="displayedProducts"
    :selectedCount="selectedCount"
    @export-selected="exportProduct"
    @update-item="openModal"
    @delete-item="submitDeleting"
  >
    <!-- Mobile cards -->
    <template #mobile-sort-menu>
      <div class="w-full text-left px-4 py-2 text-gray-800">
        <SortIconsComponent
          column="name"
          :sortDirections="sortDirections['name']"
          @sort-column="sortColumn('name')"
        >
          <template #sort-button>Name </template>
        </SortIconsComponent>
      </div>
      <div class="w-full text-left px-4 py-2 text-gray-800">
        <SortIconsComponent
          column="price"
          :sortDirections="sortDirections['price']"
          @sort-column="sortColumn('price')"
        >
          <template #sort-button>Price</template>
        </SortIconsComponent>
      </div>
      <div class="w-full text-left px-4 py-2 text-gray-800">
        <SortIconsComponent
          column="stock"
          :sortDirections="sortDirections['stock']"
          @sort-column="sortColumn('stock')"
        >
          <template #sort-button> Stock</template>
        </SortIconsComponent>
      </div>
      <div class="w-full text-left px-4 py-2 text-gray-800">
        <SortIconsComponent
          column="sku"
          :sortDirections="sortDirections['sku']"
          @sort-column="sortColumn('sku')"
        >
          <template #sort-button> SKU</template>
        </SortIconsComponent>
      </div>
    </template>
    <template #mobile-card-headers="item">
      <input
        type="checkbox"
        class="form-checkbox h-6 w-6 text-blue-400 transition duration-150 ease-in-out"
        v-model="selectedItems"
        :value="item.item.id"
      />
      <div class="text-gray-700 font-extrabold">Name:</div>
      <div class="text-gray-900">{{ item.item.name }}</div>

      <div class="text-gray-700 font-extrabold">Price:</div>
      <div class="text-gray-900">{{ item.item.price }}</div>

      <div class="text-gray-700 font-extrabold">Stock:</div>
      <div class="text-gray-900">{{ item.item.stock }}</div>

      <div class="text-gray-700 font-extrabold">SKU:</div>
      <div class="text-gray-900">{{ item.item.sku }}</div>
    </template>
    <template #mobile-card-buttons="{ item }">
      <div
        class="bg-gray-200 text-sm py-1 px-1 rounded select-none text-gray-700 inline-block mt-2"
      >
        <button
          @click="openModal(item)"
          class="rounded px-2 py-1 hover:bg-white hover:shadow focus:outline-none"
        >
          Update
        </button>
        <button
          @click="submitDeleting(item)"
          class="rounded px-2 py-1 bg-white shadow font-medium focus:outline-none text-red-400"
        >
          Delete
        </button>
        <button
          @click="exportProduct(item.id)"
          class="rounded px-2 py-1 hover:bg-white hover:shadow focus:outline-none"
        >
          Export
        </button>
      </div>
    </template>

    <!-- Desktop table -->
    <template #table-header>
      <div
        class="bg-teal-400 p-3 flex-no-wrap rounded-l-lg mb-0 text-white grid grid-cols-12 divide-x divide-gray-300"
      >
        <div class="p-2 text-left font-bold col-span-1">Nr</div>
        <div class="p-2 text-left font-bold col-span-2">
          <SortIconsComponent
            column="name"
            :sortDirections="sortDirections['name']"
            @sort-column="sortColumn('name')"
          >
            <template #sort-button> Name</template>
          </SortIconsComponent>
        </div>
        <div class="p-2 text-left font-bold col-span-2">
          <SortIconsComponent
            column="price"
            :sortDirections="sortDirections['price']"
            @sort-column="sortColumn('price')"
          >
            <template #sort-button> Price</template>
          </SortIconsComponent>
        </div>
        <div class="p-2 text-left font-bold col-span-2">
          <SortIconsComponent
            column="stock"
            :sortDirections="sortDirections['stock']"
            @sort-column="sortColumn('stock')"
          >
            <template #sort-button> Stock</template>
          </SortIconsComponent>
        </div>
        <div class="p-2 text-left font-bold col-span-2">
          <SortIconsComponent
            column="sku"
            :sortDirections="sortDirections['sku']"
            @sort-column="sortColumn('sku')"
          >
            <template #sort-button> SKU</template>
          </SortIconsComponent>
        </div>
        <div class="p-2 text-center font-bold col-span-3">Actions</div>
      </div>
    </template>
    <template #body-item="{ item, index }">
      <div
        class="grid grid-cols-12 divide-x divide-gray-300 p-3 border-b hover:bg-gray-100"
      >
        <div class="p-2 text-left col-span-1">
          <input
            :value="item.id"
            v-model="selectedItems"
            type="checkbox"
            class="form-checkbox text-blue-400 h-5 w-5"
          />
          <span class="ml-1">{{ index + 1 }}</span>
        </div>
        <div class="p-2 text-left col-span-2">
          {{ item.name }}
        </div>
        <div class="p-2 text-left col-span-2">
          {{ item.price }}
        </div>
        <div class="p-2 text-left col-span-2">
          {{ item.stock }}
        </div>
        <div class="p-2 text-left col-span-2">
          {{ item.sku }}
        </div>

        <div class="col-span-3">
          <div class="flex justify-center">
            <div
              class="bg-gray-200 text-sm py-1 px-1 rounded select-none text-gray-700 inline-block"
            >
              <button
                @click="openModal(item)"
                class="rounded px-2 py-1 hover:bg-white hover:shadow focus:outline-none"
              >
                Update
              </button>

              <button
                @click="submitDeleting(item)"
                class="rounded px-2 py-1 bg-white shadow font-medium focus:outline-none text-red-400"
              >
                Delete
              </button>

              <button
                @click="exportProduct(item.id)"
                class="rounded px-2 py-1 hover:bg-white hover:shadow focus:outline-none"
              >
                Export
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </TableComponent>

  <p v-if="products.length === 0" class="text-red-500 text-center mt-4">
    No products added yet
  </p>

  <!-- Load More -->
  <div class="sm:flex sm:justify-end mb-5">
    <button
      v-if="canLoadMore"
      @click="loadMoreProducts"
      class="sm:w-2/5 w-full bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mt-4 rounded"
    >
      Load More
    </button>
  </div>
</template>

<script>
import ConfirmActionModal from "@/components/ConfirmActionModal.vue";
import { useProductStore } from "@/store/product.js";
import ProductModal from "./components/ProductModal.vue";
import SearchComponent from "@/components/SearchComponent.vue";
import TableComponent from "@/components/TableComponent.vue";
import SortIconsComponent from "@/components/SortIconsComponent.vue";

export default {
  components: {
    ProductModal,
    SearchComponent,
    TableComponent,
    SortIconsComponent,
    ConfirmActionModal,
  },
  data() {
    return {
      showConfirmModal: false,
      products: [],
      pageSize: 10,
      displayedProducts: [],
      loadedProductsCount: 0,
      updatedProduct: {},
      openProductModal: false,
      selectedItems: [],
      sortDirections: {
        name: "desc",
        price: "desc",
        stock: "desc",
        sku: "desc",
      },
      sortHeader: "",
      searchActive: false,
      itemsToDelete: null,
    };
  },
  created() {
    this.loadProducts();
  },
  computed: {
    productStore() {
      return useProductStore();
    },
    canLoadMore() {
      return (
        this.loadedProductsCount < this.products.length && !this.searchActive
      );
    },
    selectedCount() {
      return this.selectedItems.length;
    },

    showNoDataMessage() {
      return this.displayedProducts.length === 0 && this.searchActive;
    },
  },
  methods: {
    async loadProducts() {
      this.products = await this.productStore.getProducts();
      this.displayedProducts = this.products.slice(0, this.pageSize);
      this.loadedProductsCount = this.displayedProducts.length;
    },
    loadMoreProducts() {
      const remainingProducts = this.products.slice(
        this.loadedProductsCount,
        this.loadedProductsCount + this.pageSize
      );
      this.displayedProducts = [
        ...this.displayedProducts,
        ...remainingProducts,
      ];
      this.loadedProductsCount += remainingProducts.length;
    },
    closeAlert() {
      this.showDeleteAlert = false;
    },
    submitDeleting(item) {
      this.itemsToDelete = item;
      this.showConfirmModal = true;
    },
    async deleteProduct() {
      if (this.itemsToDelete) {
        if (this.selectedItems.length > 0) {
          await this.productStore.deleteProduct(this.selectedItems);
          this.selectedItems.length = 0;
        } else {
          await this.productStore.deleteProduct(this.itemsToDelete.id);
        }
        this.showConfirmModal = false;
        this.itemsToDelete = null;
      }

      this.loadProducts();
    },
    async updateDisplayedProducts(searchFilter) {
      if (searchFilter) {
        const searchValue = searchFilter.toLowerCase();
        this.displayedProducts = await this.productStore.getProducts(
          searchValue
        );
        this.searchActive = true;
      } else {
        this.loadProducts();
        this.searchActive = false;
      }
    },
    openModal(product) {
      if (product) {
        this.updatedProduct = product;
      } else {
        this.updatedProduct = {};
      }
      this.openProductModal = true;
    },
    closeModal() {
      this.openProductModal = false;
    },

    async sortColumn(column) {
      if (this.sortDirections[column] === "asc") {
        this.sortDirections[column] = "desc";
      } else {
        this.sortDirections[column] = "asc";
      }
      this.sortHeader = column;
      this.sortDirection = this.sortDirections[column];

      await this.productStore.sortProducts(this.sortHeader, this.sortDirection);

      this.displayedProducts = this.productStore.products;
    },
    async exportProduct(id) {
      if (id) {
        await this.productStore.exportSelected(id);
      } else {
        await this.productStore.exportSelected(this.selectedItems);
        this.selectedItems = [];
      }
    },
  },
};
</script>
