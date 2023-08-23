import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useNotificationStore } from "@/store/notifications";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [],
  }),

  actions: {
    getProductById(productId) {
      try {
        return this.products.find((product) => product.id === productId);
      } catch (error) {
        console.error(error.message);
      }
    },
    getProducts() {
      try {
        return (this.products = JSON.parse(
          localStorage.getItem("products") || "[]"
        ));
      } catch (error) {
        console.error(error.message);
      }
    },
    addProduct(data) {
      try {
        const existingProducts = this.products;
        const productId = uuidv4();
        const newProduct = {
          ...data,
          id: productId,
        };
        existingProducts.push(newProduct);
        localStorage.setItem("products", JSON.stringify(existingProducts));
        this.products = existingProducts;
        useNotificationStore().addNotification({
          type: "added",
          message: "Product was added successfully",
        });
      } catch (error) {
        console.error(error.message);
      }
    },
    deleteProduct(product) {
      const indexOfProduct = this.products.indexOf(product);
      if (indexOfProduct > -1) {
        this.products.splice(indexOfProduct, 1);
        localStorage.setItem("products", JSON.stringify(this.products));
        useNotificationStore().addNotification({
          type: "deleted",
          message: "Product was deleted successfully",
        });
      }
    },
    updateProduct(updatedProduct) {
      try {
        const index = this.products.findIndex(
          (product) => product.id === updatedProduct.id
        );
        if (index > -1) {
          this.products[index] = updatedProduct;
          localStorage.setItem("products", JSON.stringify(this.products));
          useNotificationStore().addNotification({
            type: "updated",
            message: "Product was updated successfully",
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    updateProductStock(productId, quantity, mode) {
      const existingProduct = this.getProductById(productId);
      if (existingProduct) {
        if (mode === "substract") {
          existingProduct.stock -= quantity;
        } else if (mode === "add") {
          existingProduct.stock += quantity;
        }
        localStorage.setItem("products", JSON.stringify(this.products));
      }
    },
  },
});
