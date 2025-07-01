import { configureStore} from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { cartSlice } from '../slices/cartSlice';
import type { TypedUseSelectorHook } from 'react-redux';
import { accountSlice } from '../slices/accountSlice';


export const store = configureStore({
    reducer: {
        cart: cartSlice.reducer,
        account: accountSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disable serializable check for non-serializable data
        }),
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
