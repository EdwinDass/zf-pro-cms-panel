import React from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3
            }}>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    Dashboard
                </Typography>

                <Button
                    variant="contained"
                    color="error"
                    onClick={handleLogout}
                    sx={{ textTransform: "none" }}
                >
                    Logout
                </Button>
            </Box>

            <Card sx={{ maxWidth: 400 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Welcome to ZF Pro CMS
                    </Typography>
                    <Typography sx={{ mt: 1, color: "text.secondary" }}>
                        Start managing your content and view system activity here.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Dashboard;