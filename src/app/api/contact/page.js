'use client';

import * as React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';

export default function ContactPage() {
    return (
        <Box
            sx={{
                p: 4,
                textAlign: 'center',
                backgroundColor: 'white',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                maxWidth: '50%',
                margin: 'auto',
            }}
        >
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3, color: '#2E3B4E' }}>
                Contact Us
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: '#555' }}>
                Have any questions? Feel free to reach out!
            </Typography>

            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField label="Your Name" variant="outlined" required fullWidth />
                <TextField label="Your Email" type="email" variant="outlined" required fullWidth />
                <TextField label="Message" multiline rows={4} variant="outlined" required fullWidth />
                
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#2E3B4E',
                        color: 'white',
                        fontWeight: 'bold',
                        p: 1.5,
                        borderRadius: '5px',
                        mt: 3,
                    }}
                >
                    Send Message
                </Button>
            </Box>
        </Box>
    );
}
