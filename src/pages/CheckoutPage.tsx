import {
    Box,
    Button,
    Paper,
    Step,
    StepLabel,
    Stepper,
    Typography,
} from "@mui/material";
import { useState } from "react";
import AddressForm from "../components/Checkout/AddressForm";
import PaymentForm from "../components/Checkout/PaymentForm";
import Review from "../components/Checkout/Review";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { validationRules } from "../util/checkoutValidation";
import type { Cart, CartItem } from "../types/Cart";
import { toast } from "react-toastify";
import agent from "../services/agent";
import { useAppDispatch } from "../../src/apps/store";
import { setCart } from "../slices/cartSlice";


const steps = ["Shipping address", "Review your order", "Payment details"];

function getStepContent(step: number) {
    switch (step) {
        case 0:
            return <AddressForm />;
        case 1:
            return <Review />;
        case 2:
            return <PaymentForm />;
        default:
            throw new Error("Unknown step");
    }
}

export default function CheckoutPage() {
    const [activeStep, setActiveStep] = useState(0);
    const [orderNumber, setOrderNumber] = useState(0);
    const [loading, setLoading] = useState(false);
    const currentValdationRule = validationRules[activeStep];
    const methods = useForm({
        mode: "all",
        resolver: yupResolver(currentValdationRule),
    }); // Initialize useForm
    const dispatch = useAppDispatch();
    const handleNext = async () => {
        // Trigger form validation
        const isValid = await methods.trigger();

        if (isValid) {
            // Log form data before moving to the next step
            //console.log(methods.getValues());
            const data: any = methods.getValues();
            console.log(data);
            if (activeStep === steps.length - 1) {
                // If it's the last step, submit the order
                const cart = await agent.Cart.get();
                if (cart) {
                    const subTotal = calculateSubTotal(cart.items);

                    // Add logic to calculate delivery fee
                    const deliveryFee = 200;

                    try {
                        setLoading(true);
                        // Construct the order DTO to send to the backend
                        const orderDto = {
                            cartId: cart.id,
                            shippingAddress: {
                                name: data.firstName + " " + data.lastName,
                                address1: data.address1,
                                address2: data.address2,
                                city: data.city,
                                state: data.state,
                                zipCode: data.zip,
                                country: data.country,
                            },
                            subTotal: subTotal,
                            deliveryFee: deliveryFee
                        };

                        // Call the API to create the order
                        const orderId = await agent.Orders.create(orderDto);
                        // Order created successfully
                        setOrderNumber(orderId);
                        setActiveStep(activeStep + 1); // Move to the next step           
                        //now clear the basket from api 
                        agent.Cart.deleteCart(cart.id);
                        dispatch(setCart(null));
                        //and also clear the basket from local storage
                        localStorage.removeItem('cart');
                    } catch (error: any) {
                        if (error.response) {
                            const { status, data } = error.response;
                            console.error("Order submission failed. Status:", status);
                            toast.error(data?.message || "Failed to submit the order. Please try again.");
                        } else if (error.request) {
                            console.error("No response received from server:", error.request);
                            toast.error("No response from server. Please check your network.");
                        } else {
                            console.error("Error during order submission:", error.message);
                            toast.error("Unexpected error. Please try again.");
                        }
                    } finally {
                        setLoading(false);
                    }
                } else {
                    console.error("Basket not found in local storage.");
                }
            } else {
                // Move to the next step if it's not the last step
                setActiveStep(activeStep + 1);
            }
        }
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
    };

    const calculateSubTotal = (items: CartItem[]): number => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <FormProvider {...methods}>
            <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                <Typography component="h1" variant="h4" align="center">
                    Checkout
                </Typography>
                <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <>
                    {activeStep === steps.length ? (
                        <>
                            <Typography variant="h5" gutterBottom>
                                Thank you for your order.
                            </Typography>
                            <Typography variant="subtitle1">
                                Your order number is #{orderNumber}. We have emailed your order confirmation, and will send you an update when your order has shipped.
                            </Typography>
                        </>
                    ) : (
                        <>
                            {getStepContent(activeStep)}
                            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                                {activeStep !== 0 && (
                                    <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                                        Back
                                    </Button>
                                )}
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ mt: 3, ml: 1 }}
                                >
                                    {activeStep === steps.length - 1 ? "Place order" : "Next"}
                                </Button>
                            </Box>
                        </>
                    )}
                </>
            </Paper>
        </FormProvider>
    );
  }