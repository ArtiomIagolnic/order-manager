<template>
    <!-- Modal -->
    <OrderModal :updatedOrder="updatedOrder" :modalActive="openOrderModal" @close-modal="closeModal"
        @orderAdded="loadOrders()" @orderUpdated="loadOrders()" />
    <button @click="openModal()"
        class="w-2/5 bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mb-4 rounded">Add
        new order</button>
    <!-- Search Field -->
    <div class="flex mb-4">
        <input v-model="filters" @input="resetFilter" type="text"
            class="border border-gray-300 rounded-md py-2 px-4 flex-grow" placeholder="Search Orders" required />
        <button @click="filteredOrders"
            class="bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 ml-2 rounded">
            Search
        </button>
    </div>
    <p v-if="showNoDataMessage" class="text-red-500 text-center mt-4">
        No data found.
    </p>
    <p v-if="orders.length === 0" class="text-red-500 text-center mt-4">
        No orders added yet
    </p>

    <!-- Order Table -->
    <div class="overflow-x-auto">
        <table class="min-w-full table-auto">
            <thead>
                <tr>
                    <th class="py-2 px-4 text-left">Order ID</th>
                    <th class="py-2 px-4 text-left">Customer Name</th>
                    <th class="py-2 px-4 text-left">Date</th>
                    <th class="py-2 px-4 text-left">Total Amount</th>
                    <th class="py-2 px-4 text-left">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(order, i) in displayedOrders" :key="order.id">
                    <td class="py-2 px-4">{{ order.displayedId }}</td>
                    <td class="py-2 px-4">{{ order.customer }}</td>
                    <td class="py-2 px-4">{{ order.date }}</td>
                    <td class="py-2 px-4">{{ order.totalAmount }}€</td>
                    <div class="buttons flex p-1">
                        <button @click="openModal(order)"
                            class="bg-green-500 mr-2 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            Update
                        </button>
                        <button @click="deleteOrder(order)"
                            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                            Delete
                        </button>
                    </div>
                </tr>
            </tbody>
        </table>
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
            showNoDataMessage: false
        };
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
        loadOrders() {
            this.orders = this.orderStore.getOrders()
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
        }
    }
};
</script>
  
<style scoped>
/* Add your component-specific styles here */
</style>
  