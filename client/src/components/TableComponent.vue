<template>
  <div class="container">
    <!-- mobile version -->
    <div class="bg-white md:hidden">
      <div class="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            <div v-for="(header, index) in headers" :key="index" class="mt-2">
              <div class="text-gray-700 font-extrabold">{{ header }}:</div>
              <div class="text-gray-900">{{ item[itemProps[index]] }}</div>
            </div>
            <slot name="mobile-card-buttons" :item="item"></slot>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop version -->
    <div class="hidden md:block">
      <!-- Panel with options -->

      <div class="flex items-center justify-between mb-4">
        <div class="text-gray-700">{{ selectedCount }} selected</div>

        <!-- if clicked outside the panel, it closes -->
        <div
          v-show="isMenuOpen"
          @click="isMenuOpen = false"
          class="fixed inset-0 z-10"
        ></div>

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
            @click.away="isMenuOpen = false"
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

      <table
        class="desktop-table w-full border-collapse border border-gray-200 rounded-lg overflow-hidden shadow-lg my-5"
      >
        <thead class="text-white">
          <tr
            class="bg-teal-400 flex-col flex-no wrap table-row rounded-l-lg rounded-none mb-0"
          >
            <th class="p-3 text-left">Nr</th>
            <th
              v-for="(header, index) in headers"
              :key="index"
              class="p-3 text-left"
            >
              {{ header }}
            </th>
          </tr>
        </thead>

        <tbody class="flex-none">
          <slot
            name="body-item"
            v-for="(item, i) in items"
            :key="item.id"
            :item="item"
            :index="i"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isMenuOpen: false,
    };
  },
  props: {
    headers: {
      type: Array,
      required: true,
      default: [],
    },
    items: {
      type: Array,
      required: true,
      default: [],
    },
    itemProps: {
      type: Array,
      required: true,
      default: [],
    },
    selectedCount: {
      type: Number,
      default: 0,
    },
    exportSelected: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
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
    deleteSelected(item) {
      this.$emit("delete-item", item);
    },
  },
};
</script>

<style>
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
