import React from "react";
import { Box } from "@mui/material";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Box sx={{ display: "flex" }}>
            {/* Sidebar will come later */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {children}
            </Box>
        </Box>
    );
};

export default Layout;