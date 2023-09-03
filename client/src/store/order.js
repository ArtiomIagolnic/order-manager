import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useNotificationStore } from "@/store/notifications";
import { useProductStore } from "@/store/product";

export const useOrderStore = defineStore("order", {
  state: () => ({
    orders: [],
  }),
  actions: {
    getOrders(filters) {
      if (!filters) {
        try {
          return (this.orders = JSON.parse(
            localStorage.getItem("orders") || "[]"
          ));
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
    addOrder(data) {
      try {
        const existingOrders = this.orders;
        const orderId = uuidv4();

        const newOrder = {
          ...data,
          displayedId: this.generateReadableOrderId(),
          id: orderId,
        };
        existingOrders.push(newOrder);
        localStorage.setItem("orders", JSON.stringify(existingOrders));
        this.updateProductStock(newOrder.products, "substract");
        useNotificationStore().addNotification({
          type: "success",
          message: "Order was added successfully",
        });
      } catch (error) {
        console.error(error.message);
      }
    },
    deleteOrder(order) {
      const indexOfOrder = this.orders.indexOf(order);
      if (indexOfOrder > -1) {
        this.orders.splice(indexOfOrder, 1);
        localStorage.setItem("orders", JSON.stringify(this.orders));
        this.updateProductStock(order.products, "add");
        useNotificationStore().addNotification({
          type: "success",
          message: "Order was deleted successfully",
        });
      }
    },
    updateOrder(updatedOrder) {
      try {
        const index = this.orders.findIndex(
          (order) => order.id === updatedOrder.id
        );
        if (index > -1) {
          const prevOrder = this.orders[index];
          this.orders[index] = updatedOrder;
          localStorage.setItem("orders", JSON.stringify(this.orders));
          useNotificationStore().addNotification({
            type: "success",
            message: "Order was updated successfully",
          });

          const productStore = useProductStore();
          for (const product of updatedOrder.products) {
            const prevProduct = prevOrder.products.find(
              (prevProd) => prevProd.id === product.id
            );
            if (prevProduct) {
              const quantityDifference =
                product.quantity - prevProduct.quantity;
              if (quantityDifference !== 0) {
                const existingProduct = productStore.getProductById(product.id);
                if (existingProduct) {
                  existingProduct.stock -= quantityDifference;
                  productStore.updateProduct(existingProduct);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    updateProductStock(productsToUpdate, mode) {
      const productStore = useProductStore();
      for (const product of productsToUpdate) {
        productStore.updateProductStock(product.id, product.quantity, mode);
      }
    },
  },
});
