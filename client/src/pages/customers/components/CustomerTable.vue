<template >
    <!-- mobile version -->
    <div class="container">
        <div v-if="windowWidth < 640">

            <table v-for="(customer, i) in displayedCustomers" :key="customer.id"
                class="w-full flex flex-row flex-no-wrap rounded-lg overflow-hidden my-5">

                <thead class="text-white w-1/2">
                    <tr class="bg-teal-400 flex flex-col flex-no wrap rounded-l-lg mb-2">
                        <th class="p-2 text-left text-m">Nr</th>
                        <th class="p-2 text-left text-m">Name</th>
                        <th class="p-2 text-left text-m">Age</th>
                        <th class="p-2 text-left text-m">Address</th>
                        <th class="p-2 text-left text-m" width="110px">Actions</th>
                    </tr>
                </thead>

                <tbody class="flex-1 w-1/2">
                    <tr class="flex flex-col flex-no wrap mb-2">
                        <td class="border-grey-light border hover:bg-gray-100 p-2">{{ i + 1 }}</td>
                        <td class="border-grey-light border hover:bg-gray-100 p-2 truncate">{{ customer.firstName + ' ' +
                            customer.lastName }}</td>
                        <td class="border-grey-light border hover-bg-gray-100 p-2 truncate">{{ customer.age }}</td>
                        <td class="border-grey-light border hover-bg-gray-100 p-2 truncate">{{ customer.billingAdress }}
                        </td>
                        <td class="border-grey-light border hover:bg-gray-100 p-2 flex justify-around">
                            <button @click="emitUpdateCustomer(customer)"
                                class="text-blue-400 hover:text-blue-600 hover:font-medium cursor-pointer">Update</button>
                            <button @click="emitDeleteCustomer(customer)"
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
                        <th class="p-3 text-left">Nr</th>
                        <th class="p-3 text-left">Name</th>
                        <th class="p-3 text-left">Age</th>
                        <th class="p-3 text-left">Billing Address</th>
                        <th class="p-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody class="flex-none">
                    <tr v-for="(customer, i) in displayedCustomers" :key="customer.id" class=" flex-col flex-no wrap mb-0">
                        <td class="border-grey-light border hover:bg-gray-100 p-3">{{ i + 1 }}</td>
                        <td class="border-grey-light border hover:bg-gray-100 p-3 truncate">{{ customer.firstName + ' ' +
                            customer.lastName }}</td>
                        <td class="border-grey-light border hover:bg-gray-100 p-3 truncate">{{ customer.age }}</td>
                        <td class="border-grey-light border hover:bg-gray-100 p-3 truncate">{{ customer.billingAdress }}
                        </td>
                        <td class="border-grey-light border hover:bg-gray-100 p-3 flex justify-around">
                            <button @click="emitUpdateCustomer(customer)"
                                class="text-blue-400 hover:text-blue-600 hover:font-medium cursor-pointer">Update</button>
                            <button @click="emitDeleteCustomer(customer)"
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
        displayedCustomers:
            { type: Array, default: [] }
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
        emitUpdateCustomer(customer) {
            this.$emit('update-customer', customer)
        },
        emitDeleteCustomer(customer) {
            this.$emit('delete-customer', customer)
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