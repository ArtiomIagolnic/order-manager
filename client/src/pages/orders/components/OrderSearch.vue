<template>
    <div class="flex mb-4">
        <input v-model="filters" @input="resetFilter" type="text"
            class="w-2/3 border border-gray-300 rounded-md py-2 px-4 flex-grow" placeholder="Search Orders" required />
        <button @click="filteredOrders"
            class="w-1/3 bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 ml-2 rounded">
            Search
        </button>
    </div>
</template>
<script>
import { useOrderStore } from '@/store/order.js';
export default {
    data() {
        return {
            filters: ''
        }
    },
    methods: {
        resetFilter() {
            if (!this.filters) {
                this.filters = ''
                this.filteredOrders()
            }
        },
        async filteredOrders() {
            if (this.filters.trim() !== '') {
                const filteredOrders = await useOrderStore().getOrders(this.filters)
                this.$emit('filtered-orders', filteredOrders)
            } else {
                const filteredOrders = await useOrderStore().getOrders()
                this.$emit('filtered-orders', filteredOrders)
            }
        },
    }
}
</script>
