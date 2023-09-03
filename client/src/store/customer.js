import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useNotificationStore } from "@/store/notifications";
import axios from "axios";

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customers: [],
  }),
  actions: {
    getCustomers(filters) {
      if (!filters) {
        try {
          return (this.customers = JSON.parse(
            localStorage.getItem("customers") || "[]"
          ));
        } catch (error) {
          console.error(error.message);
        }
      } else {
        return this.customers.filter((customer) => {
          const searchValue = filters.toLowerCase().trim();
          const { firstName, lastName } = customer;

          return (
            firstName.toString().toLowerCase().includes(searchValue) ||
            lastName.toString().toLowerCase().includes(searchValue)
          );
        });
      }
    },
    async addCustomer(data) {
      try {
        const existingCustomers = this.customers;
        const customerId = uuidv4();
        const newCustomer = {
          ...data,
          id: customerId,
        };
        existingCustomers.push(newCustomer);
        localStorage.setItem("customers", JSON.stringify(existingCustomers));
        this.customers = existingCustomers;

        useNotificationStore().addNotification({
          type: "success",
          message: "Customer was added successfully",
        });
      } catch (error) {
        console.error(error.message);
      }
    },
    updateCustomer(updatedCustomer) {
      try {
        const index = this.customers.findIndex(
          (customer) => customer.id === updatedCustomer.id
        );
        if (index > -1) {
          this.customers[index] = updatedCustomer;
          localStorage.setItem("customers", JSON.stringify(this.customers));

          useNotificationStore().addNotification({
            type: "success",
            message: "Customer was updated successfully",
          });
        }
      } catch (error) {
        console.error();
      }
    },
    deleteCustomer(customer) {
      const indexOfCustomer = this.customers.indexOf(customer);
      if (indexOfCustomer > -1) {
        this.customers.splice(indexOfCustomer, 1);
        localStorage.setItem("customers", JSON.stringify(this.customers));

        useNotificationStore().addNotification({
          type: "success",
          message: "Customer was deleted successfully",
        });
      }
    },
  },
});
