<template>
    <div class="container">
       
        <div v-if="windowWidth < 640">
             <!-- mobile version -->
            <table class="w-full flex flex-row flex-no-wrap rounded-lg overflow-hidden my-5">

                <thead class="text-white">
                    <tr class="bg-teal-400 flex flex-col flex-no wrap rounded-l-lg mb-2">
                        <slot name="thead"></slot>
                    </tr>
                </thead>
                <tbody class="flex-1">
                    <slot name="trow"></slot>
                </tbody>
            </table>
        </div>

        
        <div v-else>
            <!-- Desktop version -->
            <table class="w-full flex flex-row flex-no-wrap bg-white rounded-lg overflow-hidden shadow-lg my-5">
                <thead class="text-white">
                    <tr class="bg-teal-400 flex-col flex-no wrap table-row rounded-l-lg rounded-none mb-2 sm:mb-0">
                        <slot name="thead"></slot>
                    </tr>
                </thead>
                <tbody class="flex-none">
                    <slot name="trow"></slot>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {

    data() {
        return {
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
    methods: {
        onResize() {
            this.windowWidth = window.innerWidth
        }
    },
}
</script>

<style scoped>
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