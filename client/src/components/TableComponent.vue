<template>
  <div class="container">
    <!-- mobile version -->
    <div class="bg-white md:hidden">
      <div class="sticky-header" :style="{ top: stickyHeaderTop }">
        <div class="px-6 py-4 flex items-center justify-between">
          <div class="text-gray-700">
            {{ selectedCount }}
          </div>
          <div class="flex space-x-4">
            <!-- Sorting button and dropdown-->
            <DropDownMenu>
              <!-- Button content -->
              <template v-slot:button>
                <span
                  class="px-2 py-2 border rounded inline-flex items-center text-sm"
                >
                  <span class="mr-2">Sort</span>

                  <svg
                    class="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M4.516 7.548c.436-.446 1.043-.481 1.576 0L10 11.295l3.908-3.747c.533-.481 1.141-.446 1.574 0 .436.445.408 1.197 0 1.615-.406.418-4.695 4.502-4.695 4.502a1.095 1.095 0 0 1-1.576 0S4.924 9.581 4.516 9.163c-.409-.418-.436-1.17 0-1.615z"
                    />
                  </svg>
                </span>
              </template>

              <!-- Opened dropdown content -->
              <template v-slot:content>
                <slot name="mobile-sort-menu"></slot>
              </template>
            </DropDownMenu>

            <!-- Actions button and dropdown -->
            <DropDownMenu>
              <!-- Button content -->
              <template v-slot:button>
                <span
                  class="px-2 py-2 border rounded inline-flex items-center text-sm"
                >
                  <span class="mr-2">Actions</span>

                  <svg
                    class="w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M4.516 7.548c.436-.446 1.043-.481 1.576 0L10 11.295l3.908-3.747c.533-.481 1.141-.446 1.574 0 .436.445.408 1.197 0 1.615-.406.418-4.695 4.502-4.695 4.502a1.095 1.095 0 0 1-1.576 0S4.924 9.581 4.516 9.163c-.409-.418-.436-1.17 0-1.615z"
                    />
                  </svg>
                </span>
              </template>

              <!-- Opened dropdown content -->
              <template v-slot:content>
                <button
                  @click="deleteSelected"
                  class="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  <font-awesome-icon icon="fa-solid fa-trash" />
                  Delete Selected
                </button>
                <button
                  @click="$emit('exportSelected')"
                  class="text-left block w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
                  :class="disabledClass"
                >
                  <font-awesome-icon icon="fa-solid fa-file-export" />
                  Export Selected as Excel
                </button>
              </template>
            </DropDownMenu>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        <!-- Actions button and dropdown -->
        <DropDownMenu placement="right">
          <!-- Button content -->
          <template v-slot:button>
            <span
              class="px-2 py-2 border rounded inline-flex items-center text-sm"
            >
              <span class="mr-2">Actions</span>

              <svg
                class="w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  d="M4.516 7.548c.436-.446 1.043-.481 1.576 0L10 11.295l3.908-3.747c.533-.481 1.141-.446 1.574 0 .436.445.408 1.197 0 1.615-.406.418-4.695 4.502-4.695 4.502a1.095 1.095 0 0 1-1.576 0S4.924 9.581 4.516 9.163c-.409-.418-.436-1.17 0-1.615z"
                />
              </svg>
            </span>
          </template>

          <!-- Opened dropdown content -->
          <template v-slot:content>
            <button
              @click="deleteSelected"
              class="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              <font-awesome-icon icon="fa-solid fa-trash" />
              Delete Selected
            </button>
            <button
              @click="$emit('exportSelected')"
              class="text-left block w-full px-4 py-2 text-gray-800 hover:bg-gray-100"
              :class="disabledClass"
            >
              <font-awesome-icon icon="fa-solid fa-file-export" />
              Export Selected as Excel
            </button>
          </template>
        </DropDownMenu>
      </div>

      <div
        class="desktop-table w-full rounded-lg overflow-hidden shadow-lg my-5"
      >
        <!-- Table Header -->
        <slot name="table-header"></slot>

        <!-- Table Body -->
        <div class="flex-none">
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
import DropDownMenu from "./DropDownMenu.vue";

export default {
  components: {
    DropDownMenu,
  },
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
