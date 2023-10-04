import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useNotificationStore } from "@/store/notifications";
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
        await axios.delete(
          `http://localhost:8000/api/products/delete/${product.id}`,
          product
        );
        useNotificationStore().addNotification({
          type: "success",
          message: "Product was deleted successfully",
        });
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
    async exportProduct(products) {
      try {
        if (products.length === 0) {
          useNotificationStore().addNotification({
            type: "warning",
            message: "Nothing selected",
          });
        } else {
          await axios.post(
            `http://localhost:8000/api/products/export`,
            products
          );
          useNotificationStore().addNotification({
            type: "success",
            message: "Products were exported successfully",
          });
        }
      } catch (error) {
        useNotificationStore().addNotification({
          type: "failed",
          message: `An error occurred while exporting product: ${error.message}`,
        });
      }
    },
  },
});
