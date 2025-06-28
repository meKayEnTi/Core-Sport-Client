import { Container, Paper, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ServerErrorPage() {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); // Navigate to the home route
    };

    return (
        <Container component={Paper} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Box
                component="img"
                sx={{
                    height: 'auto',
                    width: '100%', // Makes image responsive
                    maxHeight: { xs: 233, md: 400 }, // Adjust the max height as per your need
                    maxWidth: { xs: 350, md: 400 },  // Adjust the max width as per your need
                    mb: 4,  // Margin bottom for spacing
                }}
                src="/images/server-error.png"  // Replace with the path to your image
                alt="500 Server Error"
            />
            <Typography variant="h4" component="h1" gutterBottom>
                Oops! Something went wrong.
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                The server encountered an internal error and was unable to complete your request.
            </Typography>
            {/* Redirect Button */}
            <Button variant="contained" color="primary" onClick={handleGoHome}>
                Go Home
            </Button>
        </Container>
    )
}