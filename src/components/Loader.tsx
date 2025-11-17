import React from "react";
import Box from "@mui/material/Box";
import Fade from "@mui/material/Fade";
import CircularProgress from "@mui/material/CircularProgress";
import { useLoading } from "../context/LoadingContext";

const Loader: React.FC = () => {
    const { loading } = useLoading();

    return (
        <Fade in={loading} unmountOnExit>
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    // backgroundColor: "rgba(0, 0, 0, 0.1)",
                    zIndex: 9999,
                }}
            >
                <CircularProgress sx={{ color: '#C1172C' }} />
            </Box>
        </Fade>
    );
};

export default Loader;