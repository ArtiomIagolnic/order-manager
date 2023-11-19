<template>
  <div class="flex mb-4">
    <input
      v-model="filters"
      type="text"
      @input="resetFilter"
      class="w-2/3 border border-gray-300 rounded-md py-2 px-4 flex-grow"
      :placeholder="placeHolder"
      required
    />
    <button
      @click="search"
      class="w-1/3 bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 ml-2 rounded"
    >
      <font-awesome-icon icon="fa-solid fa-magnifying-glass" />
      Search
    </button>
  </div>
</template>
<script>
export default {
  props: {
    placeHolder: {
      type: String,
      required: true,
      default: "",
    },
  },
  data() {
    return {
      filters: "",
    };
  },
  emits: ["filtered-results"],
  computed: {
    // Computed property to reset the filter when the input is empty
    resetFilter() {
      if (!this.filters) {
        this.filters = "";
        this.search();
      }
    },
  },
  methods: {
    search() {
      if (this.filters.trim() !== "") {
        this.$emit("filtered-results", this.filters.trim()); // Emit search filter value
      } else {
        this.$emit("filtered-results", ""); // Emit an empty filter to reset
      }
    },
  },
};
</script>
