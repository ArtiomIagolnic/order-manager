<template>
  <span class="ml-1">
    <button @click="emitSortColumn">
      <slot name="sort-button"></slot>
      <font-awesome-icon
        v-if="sortDirections === 'asc'"
        icon="fa-solid fa-sort-up"
        class="ml-1"
      />
      <font-awesome-icon
        v-else-if="sortDirections === 'desc'"
        icon="fa-solid fa-sort-down"
        class="ml-1"
      />
      <font-awesome-icon v-else icon="fa-solid fa-sort" />
    </button>
  </span>
</template>
<script>
export default {
  props: {
    sortDirections: {
      type: String,
      required: true,
      default: "",
    },
  },
  emits: ["sort-column"],
  methods: {
    emitSortColumn() {
      this.$emit("sort-column");
    },
  },
};
</script>
