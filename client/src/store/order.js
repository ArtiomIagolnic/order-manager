import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useNotificationStore } from "@/store/notifications";
import { useProductStore } from "@/store/product";
import axios from "axios";

export const useOrderStore = defineStore("order", {
  state: () => ({
    orders: [],
  }),
  actions: {
    async getOrders(filters) {
      if (!filters) {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/orders/all"
          );
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
          const { customer, date, displayedId } = order;

          return (
            customer.toString().toLowerCase().includes(searchValue) ||
            date.toString().includes(searchValue) ||
            displayedId.toString().toLowerCase().includes(searchValue)
          );
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
        await axios.post("http://localhost:8000/api/orders/add", newOrder);

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
        await axios.delete(
          `http://localhost:8000/api/orders/delete/${order}`,
          order
        );
        useNotificationStore().addNotification({
          type: "success",
          message: "Order was deleted successfully",
        });
      } catch (error) {
        useNotificationStore().addNotification({
          type: "failed",
          message: `An error occurred while deleting order: ${error.message}`,
        });
      }
     
    },
    async updateOrder(updatedOrder) {
      try {
        await axios.put(
          "http://localhost:8000/api/orders/update",
          updatedOrder
        );
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
  },
});
