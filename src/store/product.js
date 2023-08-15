import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { useNotificationStore } from "@/store/notifications";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [],
  }),
  actions: {
    //Some base example products for new users
    initializeBaseProducts() {
      // check if there are any data in products store
      const existingProducts = JSON.parse(
        localStorage.getItem("products") || "[]"
      );
      if (existingProducts.length === 0) {
        const baseProducts = [
          {
            id: uuidv4(),
            name: "TV",
            price: "527.99",
            stock: "34",
            sku: "34239234",
          },
          {
            id: uuidv4(),
            name: "Iphone",
            price: "1199.99",
            stock: "124",
            sku: "49080984",
          },
        ];
        localStorage.setItem("products", JSON.stringify(baseProducts));
        this.products = baseProducts;
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
  },
});
