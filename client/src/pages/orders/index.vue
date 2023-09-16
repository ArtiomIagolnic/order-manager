<template>
    <!-- Modal -->
    <OrderModal :updatedOrder="updatedOrder" :modalActive="openOrderModal" @close-modal="closeModal"
        @orderAdded="loadOrders()" @orderUpdated="loadOrders()" />
    <button @click="openModal()"
        class="w-full md:w-2/5 bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mb-4 rounded">Add
        new order</button>

    <!-- Search Field -->
    <OrderSearch @filtered-orders="updateDisplayedOrders" />

    <p v-if="showNoDataMessage" class="text-red-500 text-center mt-4">
        No data found.
    </p>
    <p v-if="orders.length === 0" class="text-red-500 text-center mt-4">
        No orders added yet
    </p>

    <!-- Orders Table -->
    <OrderTable :displayedOrders="displayedOrders" @update-order="openModal" @delete-order="deleteOrder" />
    
    <!-- Load More -->
    <div class="flex justify-end">
        <button v-if="canLoadMore" @click="loadMoreOrders"
            class="w-2/5 bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mt-4 rounded">
            Load More
        </button>
    </div>
</template>
  
<script>
import { useOrderStore } from '@/store/order.js';
import OrderModal from './components/OrderModal.vue';
import OrderSearch from './components/OrderSearch.vue';
import OrderTable from './components/OrderTable.vue';

export default {
    components: {
        OrderModal,
        OrderSearch,
        OrderTable
    },
    data() {
        return {
            orders: [],
            updatedOrder: {},
            openOrderModal: false,
            pageSize: 10,
            displayedOrders: [],
            loadedOrdersCount: 0,
            showNoDataMessage: false
        }
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
        updateDisplayedOrders(filteredOrders) {
            this.displayedOrders = filteredOrders
            this.showNoDataMessage = this.displayedOrders.length === 0
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
        }
    }
}
</script>
  

