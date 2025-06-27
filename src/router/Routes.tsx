import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import Catalog from "../pages/Catalog";
import ContactPage from "../pages/ContactPage";
import ProductDetail from "../components/Product/ProductDetail";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children:[
            {path: "", element: <HomePage />},
            {path: "store", element: <Catalog />},
            {path: "store/:productId", element: <ProductDetail />},
            {path: "contact", element: <ContactPage />},
        ]
    }
])