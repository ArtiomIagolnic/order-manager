import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useNotificationStore } from "@/store/notifications";
import api from "./api/api.js";

export const useOrderStore = defineStore("order", {
  state: () => ({
    orders: [],
  }),
  actions: {
    async getOrders(filters) {
      if (!filters) {
        try {
          const response = await api.get("/api/orders/all");
          return (this.orders = response.data || []);
        } catch (error) {
          useNotificationStore().addNotification({
            type: "failed",
            message: `An error occurred while getting orders: ${error.message}`,
          });
        }
      } else {
        return this.orders.filter((order) => {
          const searchValue = filters.toLowerCase().trim();
          const customerName = order.customer.name;
          const { date, displayedId, totalAmount } = order;

          return (
            customerName.toString().toLowerCase().includes(searchValue) ||
            date.toString().includes(searchValue) ||
            displayedId.toString().toLowerCase().includes(searchValue) ||
            totalAmount.toString().toLowerCase().includes(searchValue)
          );
        });
      }
    },
    async sortOrders(sortHeader, sortOrder) {
      try {
        const response = await api.get(
          `/api/orders/all?sortHeader=${sortHeader}&sortOrder=${sortOrder}`
        );
        return (this.orders = response.data || []);
      } catch (error) {
        useNotificationStore().addNotification({
          type: "failed",
          message: `An error occurred while sorting orders: ${error.message}`,
        });
      }
    },
    generateReadableOrderId() {
      const uuid = uuidv4();
      return `OR-${uuid.substring(0, 5)}`;
    },
    async addOrder(data) {
      try {
        const orderId = uuidv4();
        const newOrder = {
          ...data,
          displayedId: this.generateReadableOrderId(),
          id: orderId,
        };
        await api.post("/api/orders/add", newOrder);

        useNotificationStore().addNotification({
          type: "success",
          message: "Order was added successfully",
        });
      } catch (error) {
        useNotificationStore().addNotification({
          type: "failed",
          message: `An error occurred while adding order: ${error.message}`,
        });
      }
    },
    async deleteOrder(order) {
      try {
        if (order) {
          await api.delete(`/api/orders/delete/${order}`, order);
          useNotificationStore().addNotification({
            type: "success",
            message: "Order was deleted successfully",
          });
        } else {
          useNotificationStore().addNotification({
            type: "warning",
            message: "You din't select any orders",
          });
        }
      } catch (error) {
        useNotificationStore().addNotification({
          type: "failed",
          message: `An error occurred while deleting order: ${error.message}`,
        });
      }
    },

    async updateOrder(updatedOrder) {
      try {
        await api.put("/api/orders/update", updatedOrder);
        useNotificationStore().addNotification({
          type: "success",
          message: "Order was updated successfully",
        });
      } catch (error) {
        useNotificationStore().addNotification({
          type: "failed",
          message: `An error occurred while updating order: ${error.message}`,
        });
      }
    },
    async exportSelected(order) {
      try {
        if (order.length > 0) {
          const response = await api.get("/api/orders/export/" + order, {
            responseType: "blob",
          });

          useNotificationStore().addNotification({
            type: "success",
            message: "Customer was exported successfully",
          });
          saveAs(response.data, "orders-export.xlsx");
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
