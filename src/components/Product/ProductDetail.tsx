import { getProductById } from "../../services/ProductService";
import type { Product } from "../../types/Product";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";

export default function ProductDetail() {
    const {productId} = useParams<{ productId: string }>();
    const id = productId ? parseInt(productId) : 0;
    const [product, setProduct] = useState<Product | null>();
    const [loading, setLoading] = useState(true);
    const extractImageName = (item: Product): string | null => {
        if (item && item.pictureUrl) {
            const parts = item.pictureUrl.split('/');
            if (parts.length > 0) {
                return parts[parts.length - 1];
            }
        }
        return null;
    };
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                let response = await getProductById(id);
                setProduct(response);
                console.log("Fetched Product:", product);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);
    if(loading) return <h3>Loading...</h3>;
    if(!product) return <h3>Product not found</h3>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Grid container spacing={4}>
                    {/* Cột hình ảnh */}
                    <Grid size={6} display="flex" justifyContent="center" alignItems="center">
                        {product.pictureUrl ? (
                            <img
                                src={"/images/products/" + extractImageName(product)}
                                alt={product.name}
                                style={{ width: '100%', borderRadius: 8 }}
                            />
                        ) : (
                            <Box
                                height={300}
                                bgcolor="grey.200"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                borderRadius={2}
                            >
                                <Typography>Không có hình ảnh</Typography>
                            </Box>
                        )}
                    </Grid>

                    {/* Cột nội dung */}
                    <Grid size = {6}>
                        <Typography variant="h4" gutterBottom>
                            {product.name}
                        </Typography>

                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            {product.productBrand} • {product.productType}
                        </Typography>

                        <Typography variant="h5" color="primary" gutterBottom>
                            {new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                            }).format(product.price)}
                        </Typography>

                        {product.description && (
                            <>
                                <Typography variant="subtitle1" fontWeight="bold" mt={3}>
                                    Mô tả
                                </Typography>
                                <Typography variant="body1">{product.description}</Typography>
                            </>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}