import axios from "axios";
import type { Product } from "../types/Product";
import type { Cart, CartItem, CartTotals } from "../types/Cart";
import { createId } from "@paralleldrive/cuid2";

import { setCart } from "../slices/cartSlice";
import type { Dispatch } from "redux";

class CartService {
    apiUrl = "http://localhost:8080/api/v1/carts";

    async getCartFromApi() {
        try {
            const response = await axios.get<Cart>(`${this.apiUrl}`);
            return response.data;
        } catch (error) {
            throw new Error("Failed to retrieve cart");
        }
    }

    async getCart() {
        try {
            const cartString = localStorage.getItem('cart');
            if (cartString) {
                return JSON.parse(cartString) as Cart;
            } else {
                throw new Error("Cart not found in local storage");
            }
        } catch (error) {
            throw new Error("Failed to retrieve cart: " + error);
        }
    }

    async addItemToCart(item: Product, quantity = 1, dispatch: Dispatch) {
        try {
            let cart = this.getCurrentCart();

            if (!cart) {
                cart = await this.createCart();
            }

            const itemToAdd = this.mapProductToCart(item);
            itemToAdd.quantity = quantity;
            cart.items = this.upsertItems(cart.items, itemToAdd, quantity);
            this.setCart(cart, dispatch);

            // Calculate totals after updating the cart
            const totals = this.calculateTotals(cart);

            return { cart, totals };
        } catch (error) {
            throw new Error("Failed to add item to cart");
        }
    }

    // async removeItemFromCart(cartId: string) {
    //   try {
    //     await axios.delete(`${this.apiUrl}/${cartId}`);
    //   } catch (error) {
    //     throw new Error("Failed to remove item from cart");
    //   }
    // }

    async remove(itemId: number, dispatch: Dispatch) {
        const cart = this.getCurrentCart();
        if (cart) {
            const itemIndex = cart.items.findIndex((p) => p.id === itemId);
            if (itemIndex !== -1) {
                cart.items.splice(itemIndex, 1);
                this.setCart(cart, dispatch);
            }
            //check if the cart is empty after removing the item
            if (cart.items.length === 0) {
                //clear the cart from local storage
                localStorage.removeItem('cart_id');
                localStorage.removeItem('cart');
            }
        }
    }

    async incrementItemQuantity(itemId: number, quantity: number = 1, dispatch: Dispatch) {
        const cart = this.getCurrentCart();
        if (cart) {
            const item = cart.items.find((p) => p.id === itemId);
            if (item) {
                item.quantity += quantity;
                if (item.quantity < 1) {
                    item.quantity = 1; //Preventing -ve quantity
                }
                this.setCart(cart, dispatch);
            }
        }
    }

    async decrementItemQuantity(itemId: number, quantity: number = 1, dispatch: Dispatch) {
        const cart = this.getCurrentCart();
        if (cart) {
            const item = cart.items.find((p) => p.id === itemId);
            if (item && item.quantity > 1) {
                item.quantity -= quantity;
                this.setCart(cart, dispatch);
            }
        }
    }

    async setCart(cart: Cart, dispatch: Dispatch) {
        try {
            await axios.post<Cart>(this.apiUrl, cart);
            localStorage.setItem('cart', JSON.stringify(cart));
            dispatch(setCart(cart));
        } catch (error) {
            throw new Error("Failed to update cart");
        }
    }

    async deleteCart(cartId: string): Promise<void> {
        try {
            await axios.delete(`${this.apiUrl}/${cartId}`);
        } catch (error) {
            throw new Error("Failed to delete cart");
        }
    }

    private getCurrentCart() {
        const cartString = localStorage.getItem('cart');
        return cartString ? JSON.parse(cartString) as Cart : null;
    }

    private async createCart(): Promise<Cart> {
        try {
            const newCart: Cart = {
                id: createId(),
                items: []
            };
            localStorage.setItem('cart_id', newCart.id);
            return newCart;
        } catch (error) {
            throw new Error("Failed to create cart");
        }
    }

    private upsertItems(items: CartItem[], itemToAdd: CartItem, quantity: number): CartItem[] {
        const existingItem = items.find(x => x.id === itemToAdd.id);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            itemToAdd.quantity = quantity;
            items.push(itemToAdd);
        }
        return items;
    }

    private mapProductToCart(item: Product): CartItem {
        return {
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.price,
            pictureUrl: item.pictureUrl,
            productBrand: item.productBrand,
            productType: item.productType,
            quantity: 0,
        };
    }

    private calculateTotals(cart: Cart): CartTotals {
        const deliveryFee = 0; // Assuming no shipping charges for now
        const subTotal = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const total = subTotal + deliveryFee;
        return { subTotal, deliveryFee, total };
    }
}

export default new CartService();