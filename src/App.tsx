import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { LoadingProvider } from "./context/LoadingContext";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import Loader from "./components/Loader";
import { Provider } from "react-redux";
import store from './redux/store';

const App = () => {
  return (
    <Provider store={store}>
      <LoadingProvider>
        <AuthProvider>
          <Loader />
          <Router>
            <AppRoutes />
            <ToastContainer position="top-center" autoClose={3000} />
          </Router>
        </AuthProvider>
      </LoadingProvider>
    </Provider>
  );
};

export default App;