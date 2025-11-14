import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    IconButton,
    InputAdornment,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validateForm = () => {
        if (!email.trim() || !password.trim()) {
            alert("Please enter email and password");
            return false;
        }
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        // Replace with API call later
        setTimeout(() => {
            login("dummy-access-token"); // <-- store token
            navigate("/dashboard");
            setIsLoading(false);
        }, 1000);
    };

    return (
        <Box
            sx={{
                display: "flex",
                height: "100vh",
                background: "#f5f5f5",
            }}
        >
            {/* LEFT SECTION (you can add an image later) */}
            <Box
                sx={{
                    flex: 1,
                    background: "#1976d2",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                    fontSize: "32px",
                    fontWeight: 600,
                }}
            >
                ZF Pro CMS
            </Box>

            {/* RIGHT SECTION */}
            <Box
                sx={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    p: 3,
                }}
            >
                <Card sx={{ width: "100%", maxWidth: 400, p: 2 }}>
                    <CardContent>
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}
                        >
                            Log In To Your Account
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            {/* Email Field */}
                            <TextField
                                label="Email"
                                fullWidth
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {/* Password Field */}
                            <TextField
                                label="Password"
                                fullWidth
                                type={showPassword ? "text" : "password"}
                                margin="normal"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon fontSize="small" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                edge="end"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <VisibilityOffIcon fontSize="small" />
                                                ) : (
                                                    <VisibilityIcon fontSize="small" />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {/* Login Button */}
                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{ mt: 2, py: 1.2, textTransform: "none", fontSize: "16px" }}
                                disabled={isLoading}
                            >
                                {isLoading ? "Logging in..." : "Login"}
                            </Button>
                        </form>

                        <Typography
                            variant="body2"
                            sx={{ textAlign: "center", mt: 2, color: "#666" }}
                        >
                            By clicking, you agree to our{" "}
                            <a href="#" style={{ color: "#1976d2" }}>
                                Terms of Service & Privacy Policy
                            </a>
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default Login;