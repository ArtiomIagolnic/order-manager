<template>
    <div class="container">
        <div v-if="windowWidth < 640">
            <table v-for="(order, i) in displayedOrders" :key="order.id"
                class="w-full flex flex-row flex-no-wrap rounded-lg overflow-hidden my-5">

                <thead class="text-white w-1/2">
                    <tr class="bg-teal-400 flex flex-col flex-no wrap rounded-l-lg mb-2">
                        <th class="p-3 text-left">Order ID</th>
                        <th class="p-3 text-left">Name</th>
                        <th class="p-3 text-left">Date</th>
                        <th class="p-3 text-left">Total Amount</th>
                        <th class="p-3 text-left">Actions</th>
                    </tr>
                </thead>

                <tbody class="flex-1 w-1/2">
                    <tr class="flex flex-col flex-no wrap mb-2">
                        <td class="border-grey-light border hover:bg-gray-100 p-3">{{ order.displayedId }}</td>
                        <td class="border-grey-light border hover:bg-gray-100 p-3 truncate">{{ order.customer }}</td>
                        <td class="border-grey-light border hover-bg-gray-100 p-3 truncate">{{ order.date }}</td>
                        <td class="border-grey-light border hover-bg-gray-100 p-3 truncate"> {{ order.totalAmount }}€
                        </td>
                        <td class="border-grey-light border hover:bg-gray-100 p-3 flex justify-between">
                            <button @click="emitUpdateOrder(order)"
                                class="text-blue-400 hover:text-blue-600 hover:font-medium cursor-pointer">Update</button>
                            <button @click="emitDeleteOrder(order)"
                                class="text-red-400 hover:text-red-600 hover:font-medium cursor-pointer">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Desktop version -->
        <div v-else>
            <table class="w-full flex flex-row flex-no-wrap bg-white rounded-lg overflow-hidden shadow-lg my-5">
                <thead class="text-white">
                    <tr class="bg-teal-400 flex-col flex-no wrap table-row rounded-l-lg rounded-none mb-0">
                        <th class="py-3 px-4 text-left">Order ID</th>
                        <th class="py-3 px-4 text-left">Customer Name</th>
                        <th class="py-3 px-4 text-left">Date</th>
                        <th class="py-3 px-4 text-left">Total Amount</th>
                        <th class="py-3 px-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody class="flex-none">
                    <tr v-for="(order, i) in displayedOrders" :key="order.id" class="flex-col flex-no wrap mb-0">
                        <td class="border-grey-light border hover:bg-gray-100 p-3">{{ order.displayedId }}</td>
                        <td class="border-grey-light border hover:bg-gray-100 p-3 truncate">{{ order.customer }}</td>
                        <td class="border-grey-light border hover-bg-gray-100 p-3 truncate">{{ order.date }}</td>
                        <td class="border-grey-light border hover-bg-gray-100 p-3 truncate"> {{ order.totalAmount }}€
                        </td>
                        <div class="border-grey-light border hover:bg-gray-100 p-3 flex justify-between">
                            <button @click="emitUpdateOrder(order)"
                                class="text-blue-400 hover:text-blue-600 hover:font-medium cursor-pointer">Update</button>
                            <button @click="emitDeleteOrder(order)"
                                class="text-red-400 hover:text-red-600 hover:font-medium cursor-pointer">Delete</button>
                        </div>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        displayedOrders: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            windowWidth: window.innerWidth
        }
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize);
        })
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
    },
    methods: {
        emitUpdateOrder(order) {
            this.$emit('update-order', order)
        },
        emitDeleteOrder(order) {
            this.$emit('delete-order', order)
        },
        onResize() {
            this.windowWidth = window.innerWidth
        }
    }
}
</script>

<style>
html,
body {
    height: 100%;
}

@media (min-width: 640px) {
    table {
        display: inline-table !important;
    }

    thead tr:not(:first-child) {
        display: none;
    }
}

td:not(:last-child) {
    border-bottom: 0;
}

th:not(:last-child) {
    border-bottom: 2px solid rgba(0, 0, 0, .1);
}
</style>
  