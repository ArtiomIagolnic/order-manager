<template>
  <div
    v-show="modalActive"
    class="fixed inset-0 flex items-center justify-center z-50"
  >
    <div
      class="bg-black bg-opacity-50 fixed inset-0"
      @click="$emit('close-modal')"
    ></div>
    <div class="bg-white w-full sm:w-2/3 lg:w-1/2 p-6 rounded-lg relative">
      <h2 class="text-xl font-bold mb-4">{{ modalTitle }}</h2>
      <form @submit.prevent="saveCustomer" class="space-y-4">
        <div>
          <label for="firstName" class="text-gray-700">First Name:</label>
          <input
            type="text"
            id="firstName"
            v-model="customer.firstName"
            required
            class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label for="lastName" class="text-gray-700">Last Name:</label>
          <input
            type="text"
            id="lastName"
            v-model="customer.lastName"
            required
            class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label for="age" class="text-gray-700">Age:</label>
          <input
            type="number"
            id="age"
            v-model="customer.age"
            required
            class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label for="shippAdress" class="text-gray-700"
            >Shipping Adress:</label
          >
          <input
            type="text"
            id="shippAdress"
            v-model="customer.shippingAdress"
            required
            class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label for="billAdress" class="text-gray-700">Billing Adress:</label>
          <input
            type="text"
            id="billAdress"
            v-model="customer.billingAdress"
            required
            class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
        <div class="">
          <button
            type="submit"
            :class="buttonClass"
            class="mb-2 bg-blue-500 hover:bg-blue-600 font-bold py-2 px-4 rounded w-full"
          >
            {{ submitText }}
          </button>
        </div>
      </form>

      <button
        @click="$emit('close-modal')"
        class="bg-red-500 text-white hover:bg-blue-600 font-bold py-2 px-4 rounded w-full"
      >
        Close
      </button>
    </div>
  </div>
</template>
<script>
import { useCustomerStore } from "@/store/customer.js";

export default {
  props: {
    updatedCustomer: {
      type: Object,
      default() {
        return {};
      },
    },
    modalActive: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    customerStore() {
      return useCustomerStore();
    },
    customer() {
      if (Object.keys(this.updatedCustomer).length > 0) {
        return this.updatedCustomer;
      } else {
        return {
          firstName: "",
          lastName: "",
          age: "",
          shippingAdress: "",
          billingAdress: "",
        };
      }
    },
    isUpdating() {
      return Object.keys(this.updatedCustomer).length > 0;
    },
    modalTitle() {
      return this.isUpdating ? "Update Customer" : "Add new Customer";
    },
    submitText() {
      return this.isUpdating ? "Update Customer" : "Add new Customer";
    },
    buttonClass() {
      return this.isUpdating
        ? "mb-2 bg-blue-500 text-white hover:bg-blue-600 font-bold py-2 px-4 rounded w-full"
        : "w-full mb-2 text-black bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mb-4 rounded";
    },
  },
  methods: {
    async saveCustomer() {
      if (Object.keys(this.updatedCustomer).length > 0) {
        await this.customerStore.updateCustomer(this.customer);
        this.$emit("customerUpdated");
        this.$emit("close-modal");
      } else {
        await this.customerStore.addCustomer(this.customer);
        this.$emit("customerAdded");
        this.$emit("close-modal");
      }
    },
  },
  emits: ["customerAdded", "customerUpdated", "close-modal"],
};
</script>
