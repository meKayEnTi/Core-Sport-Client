import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { cartSlice } from '../slices/cartSlices';
import type { TypedUseSelectorHook } from 'react-redux';


export const store = configureStore({
    reducer: {
        cart: cartSlice.reducer,
    },
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
