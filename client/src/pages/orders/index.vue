<template>
    <!-- Modal -->
    <OrderModal :updatedOrder="updatedOrder" :modalActive="openOrderModal" @close-modal="closeModal"
        @orderAdded="loadOrders()" @orderUpdated="loadOrders()" />
    <button @click="openModal()"
        class="w-full md:w-2/5 bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mb-4 rounded">Add
        new order</button>
    <!-- Search Field -->
    <div class="flex mb-4">
        <input v-model="filters" @input="resetFilter" type="text"
            class="w-2/3 border border-gray-300 rounded-md py-2 px-4 flex-grow" placeholder="Search Orders" required />
        <button @click="filteredOrders"
            class="w-1/3 bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 ml-2 rounded">
            Search
        </button>
    </div>
    <p v-if="showNoDataMessage" class="text-red-500 text-center mt-4">
        No data found.
    </p>
    <p v-if="orders.length === 0" class="text-red-500 text-center mt-4">
        No orders added yet
    </p>

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
                            <span @click="openModal(order)"
                                class="text-blue-400 hover:text-blue-600 hover:font-medium cursor-pointer">Update</span>
                            <span @click="deleteOrder(order)"
                                class="text-red-400 hover:text-red-600 hover:font-medium cursor-pointer">Delete</span>
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
                            <button @click="openModal(order)"
                                class="text-blue-400 hover:text-blue-600 hover:font-medium cursor-pointer">Update</button>
                            <button @click="deleteOrder(order)"
                                class="text-red-400 hover:text-red-600 hover:font-medium cursor-pointer">Delete</button>
                        </div>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>



    <div class="flex justify-end">
        <button v-if="canLoadMore" @click="loadMoreOrders"
            class="w-2/5 bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mt-4 rounded">
            Load More
        </button>
    </div>
</template>
  
<script>
import OrderModal from './components/OrderModal.vue';
import { useOrderStore } from '@/store/order.js';
export default {
    components: {
        OrderModal
    },
    data() {
        return {
            orders: [],
            updatedOrder: {},
            openOrderModal: false,
            filters: '',
            pageSize: 10,
            displayedOrders: [],
            loadedOrdersCount: 0,
            showNoDataMessage: false,
            windowWidth: window.innerWidth
        };
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize);
        })
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
    },
    created() {
        this.loadOrders();
    },
    computed: {
        orderStore() {
            return useOrderStore()
        },
        canLoadMore() {
            return this.loadedOrdersCount < this.orders.length;
        }
    },
    methods: {
        async loadOrders() {
            this.orders = await this.orderStore.getOrders()
            this.displayedOrders = this.orders.slice(0, this.pageSize)
            this.loadedOrdersCount = this.displayedOrders.length
        },
        loadMoreOrders() {
            const remainingOrders = this.orders.slice(
                this.loadedOrdersCount,
                this.loadedOrdersCount + this.pageSize
            );
            this.displayedOrders = [...this.displayedOrders, ...remainingOrders];
            this.loadedOrdersCount += remainingOrders.length;
        },
        openModal(order) {
            if (order) {
                this.updatedOrder = order;
            } else {
                this.updatedOrder = {};
            }
            this.openOrderModal = true;
        },
        closeModal() {
            this.openOrderModal = false;
        },
        deleteOrder(order) {
            this.orderStore.deleteOrder(order)
            this.loadOrders();
        },
        resetFilter() {
            if (!this.filters) {
                this.filters = ''
                this.filteredOrders()
            }
        },
        filteredOrders() {
            if (this.filters.trim() !== '') {
                this.displayedOrders = this.orderStore.getOrders(this.filters)
            } else {
                this.displayedOrders = this.orderStore.getOrders();
            }
            this.showNoDataMessage = this.displayedOrders.length === 0;
        },
        onResize() {
            this.windowWidth = window.innerWidth
        }
    }
};
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
  