import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid'

export const useProductStore = defineStore('product', {
    state: () => ({
        products: []
    }),
    actions: {
        getProducts() {
            try {
                return this.products = JSON.parse(localStorage.getItem('products') || '[]')
            } catch (error) {
                console.error(error.message)
            }
        },
        addProduct(data) {
            try {
                const existingProducts = this.products
                const productId = uuidv4()
                const newProduct = {
                    ...data,
                    id: productId
                }
                existingProducts.push(newProduct)
                localStorage.setItem('products', JSON.stringify(existingProducts))
                this.products = existingProducts
            } catch (error) {
                console.error(error.message)
            }
        },
        deleteProduct(product) {
            const indexOfProduct = this.products.indexOf(product)
            if (indexOfProduct > -1) {
                this.products.splice(indexOfProduct, 1)
                localStorage.setItem('products', JSON.stringify(this.products))
            }
        },
        updateProduct(updatedProduct) {
            try {
                const index = this.products.findIndex((product) => product.id === updatedProduct.id)
                if (index > -1) {
                    this.products[index] = updatedProduct
                    localStorage.setItem('products', JSON.stringify(this.products))
                }
            } catch (error) {
                console.error(error)
            }
        }
    }
})