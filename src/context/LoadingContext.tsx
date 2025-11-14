import React, { createContext, useState, useContext, useEffect } from "react";
import LoadingService from "../services/LoadingService";

interface LoadingContextType {
    loading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = LoadingService.subscribe(setLoading);
        return () => unsubscribe();
    }, []);

    return (
        <LoadingContext.Provider value={{ loading }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
};