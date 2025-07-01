import type { Cart } from "../types/Cart";

export function getCartFromLocalStorage(): Cart | null {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        try {
            const parsedCart: Cart = JSON.parse(storedCart);
            return parsedCart;
        } catch (error) {
            console.error('Error parsing cart from local storage:', error);
            return null;
        }
    }
    return null;
}