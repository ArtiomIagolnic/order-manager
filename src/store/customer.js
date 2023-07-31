import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export const useCustomerStore = defineStore('customer', {
    state: () => ({
        customers: []
    }),
    getters: {
        all: (state => state.customers),
    },
    actions: {
        getCustomers(filters) {
            if (!filters) {
                try {
                    return this.customers = JSON.parse(localStorage.getItem('customers') || '[]')
                } catch (error) {
                    console.error(error.message)
                }
            } else {
                return this.customers.filter((customer) => {
                    const searchValue = filters.toLowerCase().trim()
                    const { firstName, lastName, boughtProduct } = customer

                    return (firstName.toString().toLowerCase().includes(searchValue)) ||
                        lastName.toString().toLowerCase().includes(searchValue) ||
                        boughtProduct.toString().toLowerCase().includes(searchValue)
                })
            }
        },
        addCustomer(data) {
            try {
                const existingCustomers = this.customers
                const customerId = uuidv4()
                const newCustomer = {
                    ...data,
                    id: customerId,
                }
                existingCustomers.push(newCustomer)
                localStorage.setItem('customers', JSON.stringify(existingCustomers))
                this.customers = existingCustomers
            } catch (error) {
                console.error(error.message)
            }
        },
        updateCustomer(updatedCustomer) {
            try {
                const index = this.customers.findIndex((customer) => customer.id === updatedCustomer.id)
                if (index > -1) {
                    this.customers[index] = updatedCustomer
                    localStorage.setItem('customers', JSON.stringify(this.customers))
                }
            } catch (error) {
                console.log(error.message)
            }
        },
        deleteCustomer(customer) {
            const indexOfCustomer = this.customers.indexOf(customer)
            if (indexOfCustomer > -1) {
                this.customers.splice(indexOfCustomer, 1)
                localStorage.setItem('customers', JSON.stringify(this.customers))
            }
        }
    }
})