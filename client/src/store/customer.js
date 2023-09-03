import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useNotificationStore } from "@/store/notifications";
import axios from "axios";

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customers: [],
  }),

  actions: {
    async getCustomers(filters) {
      if (!filters) {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/customers/all"
          );
          return (this.customers = response.data || []);
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
        const customerId = uuidv4();
        const newCustomer = {
          ...data,
          id: customerId,
        };
        await axios.post(
          "http://localhost:8000/api/customers/add",
          newCustomer
        );

        useNotificationStore().addNotification({
          type: "success",
          message: "Customer was added successfully",
        });
      } catch (error) {
        console.error(error.message);
      }
    },
    async updateCustomer(updatedCustomer) {
      try {
        await axios.put(
          "http://localhost:8000/api/customers/update",
          updatedCustomer
        );
        useNotificationStore().addNotification({
          type: "success",
          message: "Customer was updated successfully",
        });
      } catch (error) {
        console.error();
      }
    },
    async deleteCustomer(customer) {
      try {
        await axios.delete(
          `http://localhost:8000/api/customers/delete/${customer.id}`,
          customer
        );
        useNotificationStore().addNotification({
          type: "success",
          message: "Customer was deleted successfully",
        });
      } catch (error) {
        console.error();
      }
    },
  },
});
