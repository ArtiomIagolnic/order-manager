import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useNotificationStore } from "@/store/notifications";
import { useOrderStore } from "./order";
import axios from "axios";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [],
  }),
  actions: {
    async getProducts(filters) {
      if (!filters) {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/products/all"
          );
          return (this.products = response.data || []);
        } catch (error) {
          useNotificationStore().addNotification({
            type: "failed",
            message: `An error occurred while getting products: ${error.message}`,
          });
        }
      } else {
        return this.products.filter((product) => {
          const searchValue = filters.toLowerCase().trim();
          const { name, sku } = product;
          return (
            name.toString().toLowerCase().includes(searchValue) ||
            sku.toString().toLowerCase().includes(searchValue)
          );
        });
      }
    },
    async sortProducts(sortHeader, sortOrder) {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/products/all?sortHeader=${sortHeader}&sortOrder=${sortOrder}`
        );
        return (this.products = response.data || []);
      } catch (error) {
        useNotificationStore().addNotification({
          type: "failed",
          message: `An error occurred while sorting products: ${error.message}`,
        });
      }
    },
    async addProduct(data) {
      try {
        const productId = uuidv4();
        const newProduct = {
          ...data,
          id: productId,
        };
        await axios.post("http://localhost:8000/api/products/add", newProduct);
        useNotificationStore().addNotification({
          type: "success",
          message: "Product was added successfully",
        });
      } catch (error) {
        useNotificationStore().addNotification({
          type: "failed",
          message: `An error occurred while adding product: ${error.message}`,
        });
      }
    },
    async deleteProduct(product) {
      try {
        if (product) {
          const existingOrders = await useOrderStore().getOrders();
          const productsInOrders = [].concat(
            ...existingOrders.map((order) =>
              order.products.map((product) => product.id)
            )
          );

          const productsToDelete = Array.isArray(product) ? product : [product];
          const productsInOrdersSet = new Set(productsInOrders);
          const commonProducts = productsToDelete.filter((productId) =>
            productsInOrdersSet.has(productId)
          );
          if (commonProducts.length > 0) {
            useNotificationStore().addNotification({
              type: "warning",
              message:
                "One or more products are already in orders, so you can't delete them.",
            });
          } else {
            await axios.delete(
              `http://localhost:8000/api/products/delete/${product}`,
              product
            );
            useNotificationStore().addNotification({
              type: "success",
              message: "Product(s) were deleted successfully",
            });
          }
        } else {
          useNotificationStore().addNotification({
            type: "warning",
            message: "You didn't select any product",
          });
        }
      } catch (error) {
        useNotificationStore().addNotification({
          type: "failed",
          message: `An error occurred while deleting product: ${error.message}`,
        });
      }
    },
    async updateProduct(updatedProduct) {
      try {
        await axios.put(
          "http://localhost:8000/api/products/update",
          updatedProduct
        );
        useNotificationStore().addNotification({
          type: "success",
          message: "Product was updated successfully",
        });
      } catch (error) {
        useNotificationStore().addNotification({
          type: "failed",
          message: `An error occurred while updating product: ${error.message}`,
        });
      }
    },
  },
});
