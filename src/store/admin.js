import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', {
    state: () => ({
        customers: []
    }),

    getters: {
        all: (state => state.customers)
    },

    actions: {
        initializeCustomers() {
            try {
                const existingCustomers = JSON.parse(localStorage.getItem('customers') || '[]')
                this.customers = existingCustomers
            } catch (error) {
                console.log(error.message)
            }
        },
        addCustomer(data) {
            try {

                const existingCustomers = this.customers

                const newCustomer = {
                    ...data,
                    id: existingCustomers.length > 0 ? existingCustomers[existingCustomers.length - 1].id + 1 : 1,
                }

                existingCustomers.push(newCustomer)

                localStorage.setItem('customers', JSON.stringify(existingCustomers))

                this.customers = existingCustomers

                console.log('success')
            } catch (error) {
                console.log(error.message)
            }
        },
        search(query) {


            const filteredCustomers = this.customers.filter((customer) => {
                const searchValue = query.toLowerCase().trim()
                const { id, firstName, lastName, boughtProduct } = customer


                return (id.toString().includes(searchValue) ||
                    firstName.toString().toLowerCase().includes(searchValue)) ||
                    lastName.toString().toLowerCase().includes(searchValue) ||
                    boughtProduct.toString().toLowerCase().includes(searchValue)
            })

            return filteredCustomers

        },

        // Call the initializeCustomers action when the store is created
        // to update the state with the value from localStorage
        initialize() {
            this.initializeCustomers()
        },
    }
})