<template>
  <!-- Add New Customer Button -->
  <button
    @click="openModal"
    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4 rounded"
  >
    Add New Customer
  </button>
  <!-- Modal -->
  <VueFinalModal
    class="mx-auto flex justify-center items-center"
    content-class="mt-8 max-w-lg container mx-auto flex flex-col p-8 bg-white  rounded border border-gray-100"
    v-model="showModal"
  >
    <div class="flex flex-col items-center">
      <h2 class="text-xl font-bold mb-4">{{ modalTitle }}</h2>
      <form @submit.prevent="handleModalAction" class="w-full space-y-4">
        <slot />
        <div class="flex justify-between">
          <button
            @click="closeModal"
            class="bg-red-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            {{ modalActionLabel }}
          </button>
        </div>
      </form>
    </div>
  </VueFinalModal>
</template>

<script>
import { VueFinalModal } from 'vue-final-modal'

export default {
  components: {
    VueFinalModal,
  },
  data() {
    return {
      showModal: false,
    }
  },
  methods: {
    closeModal() {
      this.$emit('closeModal')
      this.showModal = false
    },
    openModal() {
      this.$emit('openModal')
      this.showModal = true
    },
  },
  props: {
    modalTitle: {
      type: String,
      required: true,
    },
    modalActionLabel: {
      type: String,
      required: true,
    },
    handleModalAction: {
      type: Function,
      required: true,
    },
  },
  emits: ['openModal', 'closeModal']
}
</script>
