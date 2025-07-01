import { Typography, Table, TableContainer, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { useAppSelector } from "../../apps/store";
import CartSummary from '../Cart/CartSummary';
import type{ Product } from '../../types/Product';

export default function Review() {
    const { cart } = useAppSelector(state => state.cart);

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

    return (
        <>
            <Typography variant="h6" gutterBottom>
                Order summary
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product Image</TableCell>
                            <TableCell>Product</TableCell>
                            <TableCell>Price</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cart?.items.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    {product.pictureUrl && (
                                        <img src={"/images/products/" + extractImageName(product)} alt="Product" width="50" height="50" />
                                    )}
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{formatPrice(product.price)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <CartSummary />
        </>
    );
}