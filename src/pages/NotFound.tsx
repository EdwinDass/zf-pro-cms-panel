import React from 'react';
import { Container, Box, Typography } from '@mui/material';

const NotFound: React.FC = () => {

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    textAlign: 'center',
                }}
            >
                <Typography variant="h1" component="h1" color="error" gutterBottom>
                    404
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    Page Not Found
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    Sorry, the page you're looking for doesn't exist.
                </Typography>
            </Box>
        </Container>
    );
};

export default NotFound;