import { Grid} from "@mui/material";
import type { Product } from "../../types/Product";
import ProductCard from "./ProductCard";
interface Props{
    products: Product[];
}
export default function ProductList({products}: Props) {
    return (
        <Grid container spacing={4}>
            {products.map((product) => (
                <Grid size = {3} key={product.id}>
                    <ProductCard product={product} />
                </Grid>
            ))}
        </Grid>

    );
}