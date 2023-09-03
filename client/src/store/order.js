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
          console.error(error.message);
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

        await this.updateProductStock(newOrder.products, "substract");
        useNotificationStore().addNotification({
          type: "success",
          message: "Order was added successfully",
        });
      } catch (error) {
        console.error(error.message);
      }
    },
    async deleteOrder(order) {
      await axios.delete(
        `http://localhost:8000/api/orders/delete/${order.id}`,
        order
      );
      await this.updateProductStock(order.products, "add");
      useNotificationStore().addNotification({
        type: "success",
        message: "Order was deleted successfully",
      });
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
        console.error(error);
      }
    },
    async updateProductStock(productsToUpdate, mode) {
      for (const product of productsToUpdate) {
        try {
          await axios.put(
            "http://localhost:8000/api/products/product-stock",
            product.id,
            product.quantity,
            mode
          );
        } catch (error) {
          console.error(error);
        }
      }
    },
  },
});
