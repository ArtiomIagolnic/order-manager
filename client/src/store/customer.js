import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useNotificationStore } from "@/store/notifications";
import { useOrderStore } from "./order";
import api from "./api/api.js";
import { saveAs } from "file-saver";

export const useCustomerStore = defineStore("customer", {
  state: () => ({
    customers: [],
  }),

  actions: {
    async getCustomers(filters) {
      try {
        const response = await api.get("/api/customers/all");
        this.customers = response.data || [];

        if (filters) {
          const searchValue = filters.toLowerCase().trim();

          this.customers = this.customers.filter((customer) => {
            const { firstName, lastName } = customer;

            return (
              firstName.toString().toLowerCase().includes(searchValue) ||
              lastName.toString().toLowerCase().includes(searchValue)
            );
          });
        }
        return this.customers;
      } catch (error) {
        useNotificationStore().addNotification({
          type: "failed",
          message: `An error occurred while getting customers: ${error.message}`,
        });
        return [];
      }
    },
    async sortCustomers(sortHeader, sortOrder) {
      try {
        const response = await api.get(
          `/api/customers/all?sortHeader=${sortHeader}&sortOrder=${sortOrder}`
        );
        return (this.customers = response.data || []);
      } catch (error) {
        useNotificationStore().addNotification({
          type: "failed",
          message: `An error occurred while sorting customers: ${error.message}`,
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
        await api.post("/api/customers/add", newCustomer);
        useNotificationStore().addNotification({
          type: "success",
          message: "Customer was added successfully",
        });
      } catch (error) {
        useNotificationStore().addNotification({
          type: "failed",
          message: `An error occurred while adding customer: ${error.message}`,
        });
      }
    },
    async updateCustomer(updatedCustomer) {
      try {
        await api.put("/api/customers/update", updatedCustomer);
        useNotificationStore().addNotification({
          type: "success",
          message: "Customer was updated successfully",
        });
      } catch (error) {
        useNotificationStore().addNotification({
          type: "failed",
          message: `An error occurred while updating customer: ${error.message}`,
        });
      }
    },
    async deleteCustomer(customer) {
      try {
        if (customer) {
          const existingOrders = await useOrderStore().getOrders();
          const customersOrdered = [].concat(
            ...existingOrders.map((order) => order.customer.id)
          );

          const customersToDelete = Array.isArray(customer)
            ? customer
            : [customer];

          const customersInOrderSet = new Set(customersOrdered);
          const commonCustomers = customersToDelete.filter((customerId) =>
            customersInOrderSet.has(customerId)
          );

          if (commonCustomers.length > 0) {
            useNotificationStore().addNotification({
              type: "warning",
              message:
                "One or more customers are already in orders, so you can't delete them.",
            });
          } else {
            await api.delete(`/api/customers/delete/${customer}`, customer);
            useNotificationStore().addNotification({
              type: "success",
              message: "Customer was deleted successfully",
            });
          }
        } else {
          useNotificationStore().addNotification({
            type: "warning",
            message: "You didn't select any customer",
          });
        }
      } catch (error) {
        useNotificationStore().addNotification({
          type: "failed",
          message: `An error occurred while deleting customer: ${error.message}`,
        });
      }
    },
    async exportSelected(customer) {
      try {
        if (customer.length > 0) {
          const response = await api.get("/api/customers/export/" + customer, {
            responseType: "blob",
          });
          useNotificationStore().addNotification({
            type: "success",
            message: "Customer was exported successfully",
          });
          const contentDisposition = response.headers.get(
            "Content-Disposition"
          );
          const filenameMatch = contentDisposition.match(
            /filename\s*=\s*["']?([^"']+)/
          );
          const filename = filenameMatch && filenameMatch[1];

          saveAs(response.data, filename);
        } else {
          useNotificationStore().addNotification({
            type: "warning",
            message: "You didn't select any customer",
          });
        }
      } catch (error) {
        useNotificationStore().addNotification({
          type: "failed",
          message: `An error occurred while exporting customer: ${error.message}`,
        });
      }
    },
  },
});
