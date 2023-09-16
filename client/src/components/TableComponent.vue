<template >
    <!-- mobile version -->
    <div class="container">
        <div v-if="windowWidth < 640">
            <table v-for="(item, i) in items" :key="item.id"
                class="w-full flex flex-row flex-no-wrap rounded-lg overflow-hidden my-5">

                <thead class="text-white w-1/2">
                    <tr class="bg-teal-400 flex flex-col flex-no wrap rounded-l-lg mb-2">
                        <th class="p-2 text-left text-m">Nr.</th>
                        <th v-for="header, index in headers" :key="index" class="p-2 text-left text-m">{{ header }}</th>
                        <th class="p-2 text-left text-m" width="110px">Actions</th>
                    </tr>
                </thead>

                <tbody class="flex-1 w-1/2">
                    <tr class="flex flex-col flex-no wrap mb-2">
                        <td class="border-grey-light border hover:bg-gray-100 p-2">{{ i + 1 }}</td>
                        <td v-for="prop, index in itemProps" :key="index"
                            class="border-grey-light border hover:bg-gray-100 p-2">{{ item[prop] }}</td>

                        <td class="border-grey-light border hover:bg-gray-100 p-2 flex justify-around">
                            <button @click="emitUpdate(item)"
                                class="text-blue-400 hover:text-blue-600 hover:font-medium cursor-pointer">Update</button>
                            <button @click="emitDelete(item)"
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
                        <th v-for="header, index in headers" :key="index" class="p-3 text-left">{{ header }}</th>
                        <th class="p-3 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody class="flex-none">
                    <tr v-for="(item, i) in items" :key="item.id" class=" flex-col flex-no wrap mb-0">
                        <td class="border-grey-light border hover:bg-gray-100 p-3">{{ i + 1 }}</td>
                        <td v-for="prop, index in itemProps" :key="index"
                            class="border-grey-light border hover:bg-gray-100 p-3">{{ item[prop] }}</td>

                        <td class="border-grey-light border hover:bg-gray-100 p-3 flex justify-around">
                            <button @click="emitUpdate(item)"
                                class="text-blue-400 hover:text-blue-600 hover:font-medium cursor-pointer">Update</button>
                            <button @click="emitDelete(item)"
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
        headers: {
            type: Array,
            required: true,
            default: []
        },
        items:
        {
            type: Array,
            required: true,
            default: []
        },
        itemProps: {
            type: Array,
            required: true,
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
        emitUpdate(item) {
            this.$emit('update-item', item)
        },
        emitDelete(item) {
            this.$emit('delete-item', item)
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
