import { createBrowserRouter, RouterProvider } from 'react-router'
import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import authenticatedRoutes from './authenticatedRoutes'
import unAuthenticatedRoutes from './unAuthenticatedRoutes'


export default function AuthStack() {
    const user = useSelector((state) => state.user)

    const router = useMemo(
        () => {
            const route = user.authenticated ? createBrowserRouter(authenticatedRoutes) : createBrowserRouter(unAuthenticatedRoutes);
            return route;

        },
        [user.authenticated]
    )
    return (
        <RouterProvider router={router} />
    );
}