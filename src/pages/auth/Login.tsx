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
    Snackbar,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";

import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

import "./css/Login.css";
import { userLogin } from "../../services/ApiService";
import { LoginPayload } from "../../types";
import { saveTokens } from "../../services/tokenStorage";
import { useDispatch } from 'react-redux';
import { existingLogin } from "../../redux/slices/userDataSlice";
import { setTokens } from "../../redux/slices/authTokenSlice";

const Login = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState({
        loginButton: false,
    })
    const [showPassword, setShowPassword] = useState(false);
    const [snackbarState, setSnackbarState] = React.useState({
        open: false,
        message: "",
    });
    const [loginPayload, setLoginPayload] = useState<LoginPayload>({
        email: "",
        password: ""
    })

    const dispatch = useDispatch()

    const closeSnackBar = () => {
        openSnackbar(``, false);
    };

    const openSnackbar = (message: string, open: boolean) => {
        setSnackbarState((prev) => ({ ...prev, open, message }));
    };

    const handleSubmit = async () => {
        try {
            setLoading((prev) => ({ ...prev, loginButton: true }));
            const res = await userLogin(loginPayload);
            if (res?.code == 200) {
                const tokens = {
                    accessToken: res?.token?.accessToken,
                    refreshToken: res?.token?.refreshToken
                }
                dispatch(setTokens(tokens));
                dispatch(existingLogin());
                navigate("/dashboard")
            } else {
                openSnackbar(res?.message || "Unexpected error", true)
            }
            console.log(res, "vsdvdsvvfbEGFV");
        } catch (e) {
            console.log("vffvwr", e)
            openSnackbar("Failed to login, please try again", true)
        } finally {
            setLoading((prev) => ({ ...prev, loginButton: false }));
        }
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={closeSnackBar}
            >
                <CloseIcon fontSize="small" color="warning" />
            </IconButton>
        </React.Fragment>
    );

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
                        <form className="form">
                            {/* Username */}
                            <Box className="input-group">
                                <label className="input-label">Username</label>
                                <TextField
                                    fullWidth
                                    placeholder="Enter your username"
                                    value={loginPayload?.email}
                                    onChange={(e) => setLoginPayload((prev) => ({ ...prev, email: e?.target?.value || "" }))}
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
                                    value={loginPayload?.password}
                                    onChange={(e) => setLoginPayload((prev) => ({ ...prev, password: e?.target?.value || "" }))}
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
                                disabled={loading.loginButton}
                                onClick={handleSubmit}
                            >
                                {loading.loginButton ? "Signing in..." : "Sign in"}
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
            <Snackbar
                anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
                onClose={closeSnackBar}
                open={snackbarState.open}
                message={snackbarState.message}
                action={action}
                autoHideDuration={3000}
            />
        </Box>
    );
};

export default Login;