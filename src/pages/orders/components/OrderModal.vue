<template>
    <div v-show="modalActive" class="fixed inset-0 flex items-center justify-center z-50">
        <div class="bg-black bg-opacity-50 fixed inset-0" @click="$emit('close-modal')"></div>
        <div class="bg-white w-full md:w-2/3 lg:w-1/2 p-6 rounded-lg relative">
            <h2 class="text-xl font-bold mb-4">{{ modalTitle }}</h2>
            <form @submit.prevent="saveOrder" class="space-y-4">
                <div>
                    <label for="customer" class="text-gray-700">Chose a Customer</label>
                    <select id="customer" v-model="order.customer" required
                        class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500">
                        <option v-for="customer in customers" :key="customer.id"
                            :value="customer.firstName + ' ' + customer.lastName">{{ customer.firstName
                                + " " + customer.lastName }}</option>
                    </select>
                </div>
                <div>
                    <label for="date" class="text-gray-700">Order Date</label>
                    <input type="date" id="price" v-model="order.date" required
                        class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500" />
                </div>

                <div>
                    <label for="products" class="text-gray-700">Choose Products</label>
                    <select id="products" v-model="selectedProduct"
                        class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500">
                        <option disabled selected>Select a product</option>
                        <option v-for="product in products" :key="product.id" :value="product.id">{{ product.name }}
                        </option>
                    </select>

                </div>
                <div v-if="selectedProduct">
                    <div v-if="isSoldOut" class="text-red-500">Product Sold Out</div>
                    <p class="text-gray-700">{{ products.find(p => p.id === selectedProduct).name }} Price: €{{
                        selectedProductPrice }}</p>
                    <p class="text-gray-700">Stock: {{ selectedProductStock }}</p>
                    <label class="text-gray-700">{{ products.find(p => p.id === selectedProduct).name }} Quantity (Stock: {{
                        selectedProductStock - quantityToAdd }})</label>
                    <input type="number" v-model="quantityToAdd" required
                        class="block w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        min="0" :max="selectedProductStock" />
                    <p class="text-gray-700">Total Price: €{{ totalProductPrice }}</p>
                    <button @click="addProductToOrder" :disabled="isSoldOut"
                        class="mt-2 bg-blue-500 text-white hover:bg-blue-600 font-bold py-2 px-4 rounded">
                        {{ isSoldOut ? 'Product Sold Out' : 'Add Product' }}
                    </button>
                </div>
                <div v-if="order.products.length > 0">
                    <h3 class="text-xl font-semibold mt-4">Selected Products:</h3>
                    <ul>
                        <li v-for="(product, index) in order.products" :key="index">
                            {{ product.name }} - Quantity: {{ product.quantity }}
                            <button @click="removeProductFromOrder(index)" class="ml-2 text-red-600">Remove</button>
                        </li>
                    </ul>
                </div>

                <div class="">
                    <button type="submit" :class="buttonClass">
                        {{ submitText }}
                    </button>
                </div>
            </form>
            <button @click="$emit('close-modal')"
                class="bg-red-500 text-white hover:bg-blue-600 font-bold py-2 px-4 rounded w-full">Close</button>
        </div>
    </div>
</template>
  
<script>
import { useOrderStore } from '@/store/order.js'
import { useCustomerStore } from '@/store/customer.js'
import { useProductStore } from '@/store/product.js'
export default {
    props: {
        modalActive: {
            type: Boolean,
            default: false
        },
        updatedOrder: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            selectedProduct: null,
            quantityToAdd: 0,
            selectedProductPrice: null,
            selectedProductStock: null,
            validationMessage: ''
        }
    },
    computed: {
        orderStore() {
            return useOrderStore()
        },
        customers() {
            return useCustomerStore().getCustomers()
        },
        products() {
            return useProductStore().getProducts()
        },
        order() {
            if (Object.keys(this.updatedOrder).length > 0) {
                return this.updatedOrder
            } else {
                return {
                    customer: '',
                    date: '',
                    products: []
                }
            }
        },
        totalProductPrice() {
            if (this.selectedProduct && this.quantityToAdd > 0) {
                const productToAdd = this.products.find(p => p.id === this.selectedProduct);
                return (productToAdd.price * this.quantityToAdd).toFixed(2);
            }
            return 0
        },
        isSoldOut() {
            return this.selectedProductStock === 0
        },
        isUpdating() {
            return Object.keys(this.updatedOrder).length > 0
        },
        modalTitle() {
            return this.isUpdating ? 'Update Order' : 'Add new Order'
        },
        submitText() {
            return this.isUpdating ? 'Update Order' : 'Add new Order'
        },
        buttonClass() {
            return this.isUpdating ? 'mb-2 bg-blue-500 text-white hover:bg-blue-600 font-bold py-2 px-4 rounded w-full' : 'w-full mb-2 text-black bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 mb-4 rounded'
        }
    },
    watch: {
        selectedProduct(newVal) {
            if (newVal) {
                const product = this.products.find(p => p.id === newVal);
                this.selectedProductPrice = product.price;
                this.selectedProductStock = product.stock;
            } else {
                this.selectedProductPrice = null;
                this.selectedProductStock = null;
            }
        }
    },
    methods: {
        addProductToOrder() {
            if (this.selectedProduct && this.quantityToAdd > 0) {
                const productToAdd = this.products.find(p => p.id === this.selectedProduct);
                const existingProductIndex = this.order.products.findIndex(p => p.id === this.selectedProduct);

                if (existingProductIndex !== -1) {
                    this.order.products[existingProductIndex].quantity += parseInt(this.quantityToAdd)
                    this.order.products[existingProductIndex].totalPrice = this.order.products[existingProductIndex].quantity * productToAdd.price
                } else {
                    this.order.products.push({
                        id: this.selectedProduct,
                        name: productToAdd.name,
                        price: productToAdd.price,
                        quantity: parseInt(this.quantityToAdd),
                        totalPrice: this.quantityToAdd * productToAdd.price
                    })
                }
                this.order.totalAmount = this.order.products.reduce((total, product) => total + product.totalPrice, 0).toFixed(2)
                this.selectedProduct = null
                this.quantityToAdd = 0
            }
        },
        removeProductFromOrder(index) {
            this.order.products.splice(index, 1)
            this.order.totalAmount = this.order.products.reduce((total, product) => total + product.totalPrice, 0).toFixed(2)
        },
        saveOrder() {
            if (Object.keys(this.updatedOrder).length > 0) {
                this.orderStore.updateOrder(this.order)
                this.$emit('orderUpdated')
                this.$emit('close-modal')
            } else {
                this.orderStore.addOrder(this.order)
                this.$emit('orderAdded')
                this.$emit('close-modal')
            }
        }
    },
    emits: ['orderAdded', 'orderUpdated', 'close-modal']
}
</script>
  