<template>
    <div class="flex mb-4">
        <input v-model="filters" @input="resetFilter" type="text"
            class="w-2/3 border border-gray-300 rounded-md py-2 px-4 flex-grow" placeholder="Search Customer" required />
        <button @click="filteredCustomers"
            class="w-1/3 bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 ml-2 rounded">
            Search
        </button>
    </div>
</template>
<script>
import { useCustomerStore } from '@/store/customer.js'

export default {
    data() {
        return {
            filters: ''
        }
    },
    emits: ['filtered-customers'],
    methods: {
        resetFilter() {
            if (!this.filters) {
                this.filters = ''
                this.filteredCustomers()
            }
        },
        async filteredCustomers() {
            if (this.filters.trim() !== '') {
                const filteredCustomers = await useCustomerStore().getCustomers(this.filters)
                this.$emit('filtered-customers', filteredCustomers)
            } else {
                const filteredCustomers = await useCustomerStore().getCustomers()
                this.$emit('filtered-customers', filteredCustomers)
            }
        }
    }
}
</script>
