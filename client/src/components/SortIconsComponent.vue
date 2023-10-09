<template>
  <span class="ml-1">
    <button @click="emitSortColumn" v-if="sortDirections === 'asc'">
      <font-awesome-icon icon="fa-solid fa-sort-up" />
    </button>

    <button @click="emitSortColumn" v-if="sortDirections === 'desc'">
      <font-awesome-icon icon="fa-solid fa-sort-down" />
    </button>
    <button v-if="sortDirections === ''">
      <font-awesome-icon icon="fa-solid fa-sort" />
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
