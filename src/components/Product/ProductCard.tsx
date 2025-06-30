import { Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Typography } from "@mui/material";
import type { Product } from "../../types/Product";
import { Link } from "react-router-dom";
import { useState } from "react";
import { setCart } from "../../slices/cartSlices";
import agent from "../../services/agent";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch } from "../../apps/store";

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    // Define the extractImageName function
    const extractImageName = (item: Product): string | null => {
        if (item && item.pictureUrl) {
            const parts = item.pictureUrl.split('/');
            if (parts.length > 0) {
                return parts[parts.length - 1];
            }
        }
        return null;
    };

    // Function to format the price with INR currency symbol
    const formatPrice = (price: number, locale = 'vi-VN', currency = 'VND'): string => {
        if (isNaN(price)) return '₫0';

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };
      

    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();

    function addItem() {
        setLoading(true);
        agent.Cart.addItem(product, dispatch)
            .then(response => {
                console.log('New Basket:', response.cart);
                dispatch(setCart(response.cart));
            })
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }


    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        {product.name.charAt(0).toUpperCase()}
                    </Avatar>
                }
                title={product.name}
                titleTypographyProps={{ sx: { fontWeight: 'bold', color: 'primary.main' } }}
            />
            <CardMedia
                sx={{ height: 140, backgroundSize: 'contain' }}
                image={"/images/products/" + extractImageName(product)}
                title={product.name}
            />
            <CardContent>
                <Typography gutterBottom color='secondary' variant="h5">
                    {formatPrice(product.price)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.productBrand} / {product.productType}
                </Typography>
            </CardContent>
            <CardActions>
                <LoadingButton
                    loading={loading}
                    onClick={addItem}
                    size="small"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
                >
                    Add to cart
                </LoadingButton>
                <Button component={Link} to={`/store/${product.id}`} size="small">View</Button>
            </CardActions>
        </Card>
    );
}