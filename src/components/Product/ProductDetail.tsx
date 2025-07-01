import ProductService from "../../services/agent";
import type { Product } from "../../types/Product";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Container, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import NotFoundPage from "../../pages/NotFoundPage";
import Spinner from "../layouts/Spinner";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { useAppDispatch, useAppSelector } from "../../apps/store";
import agent from "../../services/agent";

export default function ProductDetail() {
    const {cart} = useAppSelector(state => state.cart);
    const dispatch = useAppDispatch();
    const { productId } = useParams<{ productId: string }>();
    const id = productId ? parseInt(productId) : 0;
    const [product, setProduct] = useState<Product | null>();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [quantity, setQuantity] = useState(0);
    const item = cart?.items.find(i => i.id === product?.id);

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
        if (!productId || isNaN(id) || id <= 0) {
            console.warn("Invalid product ID in URL");
            setProduct(null);
            setLoading(false);
            return;
        }
        const fetchProduct = async () => {
            try {
                let response = await ProductService.Product.detail(id);
                setProduct(response);
                console.log("Fetched Product:", product);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id, productId]);

    const inputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(event.target.value);
        if (!isNaN(value) && value > 0) {
            setQuantity(value);
        }
    };

    const updateQuantity = async () => {
        try {
            setSubmitting(true);
            const newItem = {
                ...product!,
                quantity: quantity
            };
            if (item) {
                const quantityDifference = quantity - item.quantity;
                if (quantityDifference > 0) {
                    // Increment the quantity of an existing item in the basket
                    await agent.Cart.incrementItemQuantity(item.id, quantityDifference, dispatch);
                } else if (quantityDifference < 0) {
                    // Decrement the quantity of an existing item in the basket
                    await agent.Cart.decrementItemQuantity(item.id, Math.abs(quantityDifference), dispatch);
                }
            } else {
                // Add a new item to the basket
                await agent.Cart.addItem(newItem, quantity, dispatch);
            }
            setSubmitting(false);
        } catch (error) {
            console.error("Failed to update quantity:", error);
            // Handle error
            setSubmitting(false);
        }
    };

    if (loading) return <Spinner message="Loading product details..." />;
    if (!product) return <NotFoundPage />;

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
                                style={{
                                    height: 300,
                                    objectFit: 'cover',
                                    borderRadius: 8
                                }}
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
                    <Grid size={6}>
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
                                <Typography variant="subtitle1" fontWeight="bold" mt={3} >
                                    Mô tả
                                </Typography>
                                <Typography variant="body1" mb={5}>{product.description}</Typography>
                            </>
                        )}
                        <Grid container spacing={2}>
                            <Grid size={6}>
                                <TextField
                                    onChange={inputChange}
                                    variant='outlined'
                                    type='number'
                                    label='Quantity in Cart'
                                    fullWidth
                                    value={quantity}
                                />
                            </Grid>
                            <Grid size={6}>
                                <LoadingButton
                                    sx={{ height: '55px' }}
                                    color='primary'
                                    size='large'
                                    variant='contained'
                                    fullWidth
                                    loading={submitting}
                                    onClick={updateQuantity}
                                >
                                    {item ? 'Update Quantity' : 'Add to Cart'}
                                </LoadingButton>
                            </Grid>
                        </Grid>
                    </Grid>

                </Grid>
            </Paper>
        </Container>
    );
}