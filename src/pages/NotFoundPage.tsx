import { Container, Paper, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
    const navigate = useNavigate();  // Hook for navigation

    const handleGoHome = () => {
        navigate('/');  // Assuming your homepage route is '/'
    };

    return (
        <Container component={Paper} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Box
                component="img"
                sx={{
                    height: 'auto',
                    width: '100%',  // Makes image responsive
                    maxHeight: { xs: 233, md: 400 }, // Adjust the max height as per your need
                    maxWidth: { xs: 350, md: 400 },  // Adjust the max width as per your need
                    mb: 4,  // Margin bottom for spacing
                }}
                src="/images/page-not-found.png"  // Replace with the path to your image
                alt="404 Not Found"
            />
            <Typography variant="h4" component="h1" gutterBottom>
                Oops! Page not found.
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                We can't seem to find the page you're looking for.
            </Typography>
            {/* Redirect Button */}
            <Button variant="contained" color="primary" onClick={handleGoHome}>
                Go Home
            </Button>
        </Container>
    )
}