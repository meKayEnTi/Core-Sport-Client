import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, Button, IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add, Remove } from '@mui/icons-material';
import type { Product } from '../types/Product';
import { useAppDispatch, useAppSelector } from '../../src/apps/store';
import agent from '../services/agent';
import CartSummary from '../components/Cart/CartSummary';
export default function CartPage() {
    const { cart } = useAppSelector(state => state.cart);
    const dispatch = useAppDispatch();
    const { Cart: CartActions } = agent;

    const removeItem = (productId: number) => {
        CartActions.removeItem(productId, dispatch);
    }

    const decrementItem = (productId: number, quantity: number = 1) => {
        CartActions.decrementItemQuantity(productId, quantity, dispatch);
    };

    const incrementItem = (productId: number, quantity: number = 1) => {
        CartActions.incrementItemQuantity(productId, quantity, dispatch);
    };

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

    if (!cart || cart.items.length === 0) return <Typography variant="h3">Your basket is empty. Please add few items!!!</Typography>;

  return (
      <>
          <TableContainer component={Paper}>
              <Table>
                  <TableHead>
                      <TableRow>
                          <TableCell>Product Image</TableCell>
                          <TableCell>Product</TableCell>
                          <TableCell>Price</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Subtotal</TableCell>
                          <TableCell>Remove</TableCell>
                      </TableRow>
                  </TableHead>
                  <TableBody>
                      {cart.items.map((item) => (
                          <TableRow key={item.id}>
                              <TableCell>
                                  {item.pictureUrl && (
                                      <img src={"/images/products/" + extractImageName(item)} alt="Product" width="50" height="50" />
                                  )}
                              </TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{formatPrice(item.price)}</TableCell>
                              <TableCell>
                                  <IconButton color='error' onClick={() => decrementItem(item.id)}>
                                      <Remove />
                                  </IconButton>
                                  {item.quantity}
                                  <IconButton color='error' onClick={() => incrementItem(item.id)}>
                                      <Add />
                                  </IconButton>
                              </TableCell>
                              <TableCell>{formatPrice(item.price * item.quantity)}</TableCell>
                              <TableCell>
                                  <IconButton onClick={() => removeItem(item.id)} aria-label="delete">
                                      <DeleteIcon />
                                  </IconButton>
                              </TableCell>
                          </TableRow>
                      ))}
                  </TableBody>
              </Table>
          </TableContainer>
          <Box mt={2} p={2} bgcolor="background.paper" borderRadius={4}>
              <CartSummary />
              <Button
                  component={Link}
                  to='/checkout'
                  variant='contained'
                  size='large'
                  fullWidth
                    sx={{ mt: 5} }
              >
                  Checkout
              </Button>
          </Box>
      </>
  );
}