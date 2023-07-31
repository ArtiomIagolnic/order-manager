<template>
  <!-- Add New Customer Button -->

  <button @click="openModal" :class="classes">
    {{ title }}
  </button>

  <VueFinalModal
    class="mx-auto flex justify-center items-center"
    content-class="mt-8 max-w-lg container mx-auto flex flex-col p-8 bg-white  rounded border border-gray-100"
    v-model="showModal"
  >
    <div class="flex flex-col items-center">
      <slot name="table"></slot>

      <button
        @click="closeModal"
        class="bg-red-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full"
      >
        Cancel
      </button>
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
  props: {
    title: String,
    classes: String,
  },
  methods: {
    openModal() {
      this.$emit('openModal')
      this.showModal = true
    },
    closeModal() {
      this.$emit('closeModal')
      this.showModal = false
    },
  },
  emits: ['openModal', 'closeModal'],
}
</script>
