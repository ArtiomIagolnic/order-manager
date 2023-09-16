<template>
    <div class="flex mb-4">
        <input v-model="filters" @input="resetFilter" type="text"
            class="w-2/3 border border-gray-300 rounded-md py-2 px-4 flex-grow" :placeholder="placeHolder" required />
        <button @click="search"
            class="w-1/3 bg-white border-b border-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-white dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-white dark:hover:border-gray-300 dark:hover:text-gray-800 font-bold py-2 px-4 ml-2 rounded">
            Search
        </button>
    </div>
</template>
<script>

export default {
    props: {
        placeHolder: {
            type: String,
            required: true,
            default: ''
        },
        storeGetter: {
            type: Function,
            required: true,
            default: null
        }
    },
    data() {
        return {
            filters: ''
        }
    },
    emits: ['filtered-results'],
    methods: {
        resetFilter() {
            if (!this.filters) {
                this.filters = ''
                this.search()
            }
        },
        async search() {
            if (this.filters.trim() !== '') {
                const filteredData = await this.storeGetter(this.filters)
                this.$emit('filtered-results', filteredData)
            } else {
                const filteredData = await this.storeGetter()
                this.$emit('filtered-results', filteredData)
            }
        }
    }
}
</script>
