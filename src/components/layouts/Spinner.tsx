import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";

interface Props {
    message?: string;
}

export default function Spinner({ message = 'Loading...' }: Props) {
    return (
        <Backdrop open={true} invisible={true}>
            <Box
                display='flex'
                flexDirection='column'  // Stack spinner and message vertically
                justifyContent='center'
                alignItems='center'  // Center align items horizontally
                height='100vh'
            >
                <CircularProgress size={100} color='secondary' />
                <Typography variant="h4" sx={{ mt: 2 }}>
                    {message}
                </Typography>
            </Box>
        </Backdrop>
    )
}