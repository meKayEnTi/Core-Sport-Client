import axios from "axios";
import type { AxiosError, AxiosResponse } from "axios";
import type { Product } from "../types/Product";
import { router } from "../router/Routes";
import { toast } from "react-toastify";

axios.defaults.baseURL = 'http://localhost:8080/api/v1';


const idle = () => new Promise(resolve => setTimeout(resolve, 1000));
const responseBody = (response: AxiosResponse) => response.data;

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
    list:() => requests.get('products'),
    detail: (id: number) => requests.get(`products/${id}`),
}

export const getProductById = async (id: number): Promise<Product> => {
    try {
        const response = await axios.get<Product>(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        throw error;
    }
}

const ProductService = {
    Product,
}

export default ProductService;