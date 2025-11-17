import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Checkbox,
    FormControlLabel,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import "./css/Login.css";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        if (!username.trim() || !password.trim()) {
            alert("Please enter username and password");
            return false;
        }
        return true;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        // Simulating API
        setTimeout(() => {
            login("dummy-access-token");     // store token
            navigate("/dashboard");          // redirect
            setIsLoading(false);
        }, 1000);
    };

    return (
        <Box id="login-page">
            <Box className="login-container">
                <Card className="glass-effect login-card">
                    <CardContent className="login-card-inner">

                        {/* Logo + Title */}
                        <Box textAlign="center" mb={5}>
                            <img
                                src="https://ik.imagekit.io/ewxcertfq/ZF_proPoints_Logo_xcept_Black_RGB%201.png?updatedAt=1760210363486"
                                alt="ZF Logo"
                                className="login-logo"
                            />
                            <h1 className="title">Admin Portal</h1>
                            <p className="subtitle">Sign in to access your dashboard</p>
                        </Box>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="form">
                            {/* Username */}
                            <Box className="input-group">
                                <label className="input-label">Username</label>
                                <TextField
                                    fullWidth
                                    placeholder="Enter your username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonIcon className="input-icon" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    className="input-field"
                                />
                            </Box>

                            {/* Password */}
                            <Box className="input-group">
                                <label className="input-label">Password</label>
                                <TextField
                                    fullWidth
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon className="input-icon" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOffIcon />
                                                    ) : (
                                                        <VisibilityIcon />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                    className="input-field"
                                />
                            </Box>

                            {/* Remember + Forgot */}
                            <Box className="remember-forgot">
                                <FormControlLabel
                                    control={<Checkbox size="small" />}
                                    label={<span className="remember-label">Remember me</span>}
                                />

                                <a href="#" className="forgot-link">
                                    Forgot password?
                                </a>
                            </Box>

                            {/* Button */}
                            <Button
                                type="submit"
                                fullWidth
                                className="btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? "Signing in..." : "Sign in"}
                            </Button>
                        </form>

                        {/* Footer */}
                        <Box mt={5} textAlign="center">
                            <p className="footer-text">
                                © 2023 ZF Loyalty Program. All rights reserved.
                                <br />
                                Evolve Brands Pvt. Ltd., Gurgaon
                            </p>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default Login;