import axios from "axios";
import type { AxiosError, AxiosResponse } from "axios";
import type { Product } from "../types/Product";
import { router } from "../router/Routes";
import { toast } from "react-toastify";
import CartService from "./cartService";
import type { Cart } from "../types/Cart";
import type { Dispatch } from "redux";

axios.defaults.baseURL = 'http://localhost:8080/api/v1';


const idle = () => new Promise(resolve => setTimeout(resolve, 1000));
const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.request.use(config => {
    const user = localStorage.getItem('user');
    if(user){
        const token = JSON.parse(user).token;
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return config;
});
  
axios.interceptors.response.use(
    async response => {
        await idle();
        return response;
    },
    (error: AxiosError) => {
        const { status } = error.response as AxiosResponse;
        if (status === 404) {
            toast.error("Resource not found:");
            router.navigate('/not-found');
        } else if (status === 500) {
            toast.error("Server error:");
            router.navigate('/server-error');
        }
        return Promise.reject(error.message);
    }
);

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
};

const Product = {
    list: (
        page: number,
        size: number,
        brandId?: number,
        typeId?: number,
        sort: string = 'name',
        order: string = 'asc'
    ) => {
        let url = `products?page=${page}&size=${size}&sort=${sort}&order=${order}`;
        if (brandId !== undefined && brandId !== 0) url += `&brandId=${brandId}`;
        if (typeId !== undefined && typeId !== 0) url += `&typeId=${typeId}`;
        return requests.get(url);
    },
    detail: (id: number) => requests.get(`products/${id}`),
    search: (keyword: string) => requests.get(`products?keyword=${keyword}`),
}

const Type = {
    list: () => requests.get('types').then(types => [{ id: 0, name: 'All' }, ...types]),
}

const Brand = {
    list: () => requests.get('brands').then(brands => [{ id: 0, name: 'All' }, ...brands]),
}

const Cart = {
    get: async () => {
        try {
            return await CartService.getCart();
        } catch (error) {
            console.error("Failed to get cart:", error);
            throw error;
        }
    },
    addItem: async (product: Product, quantity: number, dispatch: Dispatch) => {
        try {
            const result = await CartService.addItemToCart(product, quantity, dispatch);
            console.log(result);
            return result;
        } catch (error) {
            console.error("Failed to add item to cart:", error);
            throw error;
        }
    },
    removeItem: async (itemId: number, dispatch: Dispatch) => {
        try {
            await CartService.remove(itemId, dispatch);
        } catch (error) {
            console.error("Failed to remove item from cart:", error);
            throw error;
        }
    },
    incrementItemQuantity: async (itemId: number, quantity: number = 1, dispatch: Dispatch) => {
        try {
            await CartService.incrementItemQuantity(itemId, quantity, dispatch);
        } catch (error) {
            console.error("Failed to increment item quantity in cart:", error);
            throw error;
        }
    },
    decrementItemQuantity: async (itemId: number, quantity: number = 1, dispatch: Dispatch) => {
        try {
            await CartService.decrementItemQuantity(itemId, quantity, dispatch);
        } catch (error) {
            console.error("Failed to decrement item quantity in cart:", error);
            throw error;
        }
    },
    setCart: async (cart: Cart, dispatch: Dispatch) => {
        try {
            await CartService.setCart(cart, dispatch);
        } catch (error) {
            console.error("Failed to set cart:", error);
            throw error;
        }
    },
    deleteCart: async (cartId: string) => {
        try {
            await CartService.deleteCart(cartId);
        } catch (error) {
            console.log("Failed to delete the Cart");
            throw error;
        }
      }
};

const Account = {
    login: (values : any) => requests.post('auth/login', values)
} 

const Orders = {
    list: () => requests.get('orders'),
    fetch: (id: number) => requests.get(`orders/${id}`),
    create: (values: any) => requests.post('orders', values)
  }

const agent = {
    Product, Cart, Type, Brand, Account, Orders
}

export default agent;