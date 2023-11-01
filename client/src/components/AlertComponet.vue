<template>
  <Transition name="alert">
    <div
      v-show="alertActive"
      class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-30"
    >
      <div
        class="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-md text-center transition-transform"
      >
        <p class="text-lg">Are you sure you want to delete {{ entity }}?</p>
        <div class="flex justify-around mt-4">
          <button
            @click="confirmAction"
            class="w-2/5 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Confirm
          </button>
          <button
            @click="$emit('close-alert')"
            class="w-2/5 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
export default {
  props: {
    entity: {
      type: String,
      default: "",
    },
    alertActive: {
      type: Boolean,
      default: false,
    },
    onConfirm: {
      type: Function,
      default: null,
    },
  },

  methods: {
    confirmAction() {
      this.onConfirm();
    },
  },
};
</script>

<style>
.alert-enter-active,
.alert-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
  /* Transition properties */
}

.alert-enter-from,
.alert-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
