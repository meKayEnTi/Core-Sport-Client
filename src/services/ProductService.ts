import axios from "axios";
import type { Product } from "../types/Product";

axios.defaults.baseURL = 'http://localhost:8080/api/v1';

export const getProductById = async (id: number): Promise<Product> => {
    try {
        const response = await axios.get<Product>(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        throw error;
    }
}