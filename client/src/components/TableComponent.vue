<template>
  <div class="container">
    <!-- mobile version -->
    <div class="bg-white md:hidden">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="sticky-header" :style="{ top: stickyHeaderTop }">
          <div class="px-6 py-4 flex items-center justify-between">
            <div class="text-gray-600 text-sm">
              {{ selectedCount }} selected
            </div>
            <div class="flex space-x-4">
              <button
                @click="toggleSortMenu"
                class="px-3 ml-2 py-1 text-white bg-gray-700 hover:bg-gray-800 rounded-md text-sm"
              >
                Sort by
              </button>
              <div
                v-show="isSortMenuOpen"
                class="dropdown-menu right-0 absolute mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-20"
              >
                <slot name="mobile-sort-menu"></slot>
              </div>

              <button
                @click="toggleActionsMenu"
                class="px-3 ml-2 py-1 text-white bg-gray-700 hover:bg-gray-800 rounded-md text-sm"
              >
                Button Actions
              </button>

              <div
                v-show="isMenuOpen"
                class="dropdown-menu right-0 absolute mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-20"
              >
                <ul>
                  <li>
                    <button
                      @click="deleteSelected"
                      class="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Delete Selected
                    </button>
                  </li>
                  <li>
                    <a
                      :href="exportSelected"
                      class="text-left block w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
                      :class="disabledClass"
                    >
                      Export Selected as Excel
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <!-- Loop Through Items -->
        <div
          v-for="(item, i) in items"
          :key="item.id"
          class="bg-white shadow-md rounded-lg overflow-hidden"
        >
          <div class="px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="text-lg font-bold text-teal-400">#{{ i + 1 }}</div>
            </div>

            <div class="mt-2">
              <slot name="mobile-card-headers" :item="item"></slot>
            </div>

            <slot name="mobile-card-buttons" :item="item"></slot>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop version -->
    <div class="hidden md:block">
      <!-- if clicked outside the panel, it closes -->
      <div
        v-show="isMenuOpen"
        @click="isMenuOpen = false"
        class="fixed inset-0 z-10"
      ></div>
      <div class="flex items-center justify-between mb-4">
        <div class="text-gray-700">{{ selectedCount }} selected</div>

        <div class="relative">
          <button
            @click="isMenuOpen = !isMenuOpen"
            class="bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 ml-2 rounded"
          >
            Actions
            <svg
              class="w-4 h-4 inline ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 10.293a1 1 0 011.414 0L10 11.586l1.293-1.293a1 1 0 111.414 1.414l-2 2a1 1 0 01-1.414 0l-2-2a1 1 0 010-1.414 1 1 0 010 1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
          <ul
            v-show="isMenuOpen"
            class="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-10"
          >
            <li>
              <button
                @click="deleteSelected"
                class="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Delete Selected
              </button>
            </li>
            <li>
              <a
                :href="exportSelected"
                class="text-left block w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
                :class="disabledClass"
              >
                Export Selected as Excel
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        class="desktop-table w-full rounded-lg overflow-hidden shadow-lg my-5"
      >
        <!-- Table Header -->
        <div class="bg-teal-400 flex justify-between p-3 flex-no-wrap rounded-l-lg mb-0 text-white">
          <slot name="table-header"></slot>
        </div>

        <!-- Table Body -->
        <div class="flex-none ">
          <slot
            name="body-item"
            v-for="(item, i) in items"
            :key="item.id"
            :item="item"
            :index="i"
          ></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isMenuOpen: false,
      isSortMenuOpen: false,
      stickyHeaderTop: 0,
    };
  },
  props: {
    items: {
      type: Array,
      required: true,
      default: [],
    },

    exportSelected: {
      type: String,
      default: "",
    },

    selectedCount: {
      type: Number,
      default: 0,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    // Listen for the scroll event
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    // Clean up the event listener when the component is destroyed
    window.removeEventListener("scroll", this.handleScroll);
  },
  computed: {
    disabledClass() {
      if (this.disabled) {
        return "disabled-link";
      } else {
        return "";
      }
    },
  },
  methods: {
    toggleSortMenu() {
      this.isSortMenuOpen = !this.isSortMenuOpen;
      this.isMenuOpen = false;
    },
    toggleActionsMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      this.isSortMenuOpen = false;
    },
    deleteSelected(item) {
      this.$emit("delete-item", item);
      this.isMenuOpen = false;
    },
    handleScroll() {
      const scrollY = window.scrollY;
      this.stickyButtonTop = scrollY > 100 ? "0" : "100px";
    },
  },
};
</script>

<style>
.sticky-header {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1; /* Ensure it's above the content */
}
.dropdown-menu {
  top: 100%; /* Position the dropdown below the button */
}
.disabled-link {
  pointer-events: none; /* Disable pointer events */
  color: #ccc; /* Apply a gray color to indicate it's disabled */
  text-decoration: none; /* Remove underline */
}
@media (min-width: 767px) {
  .desktop-table {
    display: inline-table !important;
  }
}
</style>
