import ReactDOM from 'react-dom/client';
import React, {createContext, ReactNode, useContext} from 'react';
import App from './App';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {ApolloProvider} from "@apollo/client";
import client from "./apolloClient";
import HomePage from "./pages/home/Home";
import ErrorPage from "./pages/error/Error";
import AuthentificationPage from "./pages/authentification/Authentification";
import "./styles/_main.scss";

import useMainController, {UseMainControllerReturnType} from './controller/controllerMain';
import {AuthProvider} from "./provider/AuthProvider";

const MainControllerContext = createContext<UseMainControllerReturnType | undefined>(undefined);

export const useMainControllerContext = () => {
    const context = useContext(MainControllerContext);
    if (!context) {
        throw new Error('useMainControllerContext must be used within a MainControllerProvider');
    }
    return context;
};

export const MainControllerProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const mainController = useMainController();
    return (
        <MainControllerContext.Provider value={mainController}>
            {children}
        </MainControllerContext.Provider>
    );
};

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <AuthentificationPage /> },
            {
                path: '/home',
                children: [
                    { index: true, element: <HomePage /> },
                ],
            },
        ],
    },
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <MainControllerProvider>
            <ApolloProvider client={client}>
                <AuthProvider>
                    <RouterProvider router={router}/>
                </AuthProvider>
            </ApolloProvider>
        </MainControllerProvider>
    </React.StrictMode>
);