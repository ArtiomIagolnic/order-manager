<template >
    <div class="container">
        <!-- mobile version -->
        <div class="bg-white md:hidden ">
            <div class="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Loop Through Items -->
                <div v-for="(item, i) in items" :key="item.id" class="bg-white shadow-md rounded-lg overflow-hidden">
                    <div class="px-6 py-4">
                        <div class="flex items-center justify-between">
                            <div class="text-lg font-bold text-teal-400">#{{ i + 1 }}</div>

                        </div>
                        <template v-for="(header, index) in headers" :key="index">
                            <div class="mt-2">
                                <div class="text-gray-700 font-extrabold">{{ header }}:</div>
                                <div class="text-gray-900">{{ item[itemProps[index]] }}</div>
                            </div>
                        </template>
                        <div class="mt-3 space-x-4 flex justify-start">
                            <button @click="emitUpdate(item)"
                                class="text-blue-600 hover:text-blue-800 hover:font-medium cursor-pointer">Update</button>
                            <button @click="emitDelete(item)"
                                class="text-red-600 hover:text-red-800 hover:font-medium cursor-pointer">Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Desktop version -->
        <div class="hidden md:block">
            <table
                class="desktop-table w-full border-collapse border border-gray-200 rounded-lg overflow-hidden shadow-lg my-5">
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

    methods: {
        emitUpdate(item) {
            this.$emit('update-item', item)
        },
        emitDelete(item) {
            this.$emit('delete-item', item)
        }
    }
}
</script>

<style>
@media (min-width: 767px) {
    .desktop-table {
        display: inline-table !important;
    }
}
</style>
