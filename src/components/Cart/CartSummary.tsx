import { TableContainer, Paper, Table, TableBody, TableRow, TableCell, Typography, Box } from "@mui/material";
import { useAppSelector } from "../../apps/store";

export default function CartSummary() {
    const { cart } = useAppSelector(state => state.cart);
    const subtotal = cart?.items.reduce((sum, item) => sum + (item.quantity * item.price), 0) ?? 0;
    const shipping = 200;

    const formatPrice = (price: number, locale = 'vi-VN', currency = 'VND'): string => {
        if (isNaN(price)) return '₫0';

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <Box mt={4} p={2} bgcolor="background.default" borderRadius={8} boxShadow={3}>
            <Typography variant="h5" gutterBottom>
                Cart Summary
            </Typography>
            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell>Subtotal</TableCell>
                            <TableCell align="right">{formatPrice(subtotal)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Shipping</TableCell>
                            <TableCell align="right">{formatPrice(shipping)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><strong>Total</strong></TableCell>
                            <TableCell align="right"><strong>{formatPrice(subtotal + shipping)}</strong></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}