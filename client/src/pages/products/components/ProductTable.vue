<template>
    <div class="container">
        <div v-if="windowWidth < 640">
            <table v-for="(product, i) in displayedProducts" :key="product.id"
                class="w-full flex flex-row flex-no-wrap rounded-lg overflow-hidden my-5">

                <thead class="text-white w-1/2">
                    <tr class="bg-teal-400 flex flex-col flex-no wrap rounded-l-lg mb-2">
                        <th class="p-3 text-left">Nr.</th>
                        <th class="p-3 text-left">Name</th>
                        <th class="p-3 text-left">Price</th>
                        <th class="p-3 text-left">Stock</th>
                        <th class="p-3 text-left">SKU</th>
                        <th class="p-3 text-left">Actions</th>
                    </tr>
                </thead>

                <tbody class="flex-1 w-1/2">
                    <tr class="flex flex-col flex-no wrap mb-2">
                        <td class="border-grey-light border hover:bg-gray-100 p-3">{{ i + 1 }}</td>
                        <td class="border-grey-light border hover:bg-gray-100 p-3 truncate">{{ product.name }}</td>
                        <td class="border-grey-light border hover-bg-gray-100 p-3 truncate">{{ product.price }}€</td>
                        <td class="border-grey-light border hover-bg-gray-100 p-3 truncate"> {{ product.stock }}</td>
                        <td class="border-grey-light border hover-bg-gray-100 p-3 truncate"> {{ product.sku }}</td>
                        <td class="border-grey-light border hover:bg-gray-100 p-3 flex justify-between">
                            <button @click="emitUpdateProduct(product)"
                                class="text-blue-400 hover:text-blue-600 hover:font-medium cursor-pointer">Update</button>
                            <button @click="emitDeleteProduct(product)"
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
                        <th class="p-3 text-left">Nr.</th>
                        <th class="p-3 text-left">Name</th>
                        <th class="p-3 text-left">Price</th>
                        <th class="p-3 text-left">Stock</th>
                        <th class="p-3 text-left">SKU</th>
                        <th class="p-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody class="flex-none">
                    <tr v-for="(product, i) in displayedProducts" :key="product.id" class=" flex-col flex-no wrap  mb-0">
                        <td class="border-grey-light border hover:bg-gray-100 p-3">{{ i + 1 }}</td>
                        <td class="border-grey-light border hover:bg-gray-100 p-3 truncate">{{ product.name }}</td>
                        <td class="border-grey-light border hover:bg-gray-100 p-3 truncate">{{ product.price }}€</td>
                        <td class="border-grey-light border hover:bg-gray-100 p-3 truncate">{{ product.stock }}</td>
                        <td class="border-grey-light border hover:bg-gray-100 p-3 truncate">{{ product.sku }}</td>
                        <td class="border-grey-light border hover:bg-gray-100 p-3 flex justify-between">
                            <button @click="emitUpdateProduct(product)"
                                class="text-blue-400 hover:text-blue-600 hover:font-medium cursor-pointer ">Update</button>
                            <button @click="emitDeleteOrder(product)"
                                class="text-red-400 hover:text-red-600 hover:font-medium cursor-pointer">Delete</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        displayedProducts: {
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
        onResize() {
            this.windowWidth = window.innerWidth
        },
        emitUpdateProduct(product) {
            this.$emit('update-product', product)
        },
        emitDeleteProduct(product) {
            this.$emit('delete-product', product)
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