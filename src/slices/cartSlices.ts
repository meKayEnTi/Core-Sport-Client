import type { Cart } from "../types/Cart";
import { createSlice } from '@reduxjs/toolkit';

interface CartState {
    cart : Cart | null;
}

const inititalState: CartState = {
    cart : null
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState: inititalState,
    reducers: {
        setCart: (state, action) => {
            state.cart = action.payload;
        },
        clearCart: (state) => {
            state.cart = null;
        }
    }
})

export const { setCart, clearCart } = cartSlice.actions;