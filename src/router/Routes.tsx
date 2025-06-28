import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import HomePage from "../pages/HomePage";
import Catalog from "../pages/Catalog";
import ContactPage from "../pages/ContactPage";
import ProductDetail from "../components/Product/ProductDetail";
import NotFoundPage from "../pages/NotFoundPage";
import ServerErrorPage from "../pages/ServerErrorPage.";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children:[
            {path: "", element: <HomePage />},
            {path: "store", element: <Catalog />},
            {path: "store/:productId", element: <ProductDetail />},
            {path: "contact", element: <ContactPage />},
            {path: "not-found", element: <NotFoundPage />},
            {path: "server-error", element: <ServerErrorPage />},
            {path: "*", element: <Navigate replace to="/not-found" />}
        ]
    }
])