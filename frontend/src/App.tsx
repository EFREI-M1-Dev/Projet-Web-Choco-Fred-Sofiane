import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from "./provider/AuthProvider";
import { Notification } from "./components/Notification/Notification";

const App = () => {
    const { pathname } = useLocation();
    const { loggedIn } = useAuth();

    if (loggedIn && !pathname.startsWith('/home')) {
        const query = window.location.search ? `?${new URLSearchParams(window.location.search)}` : '';
        return <Navigate to={`/home${query}`} />;
    }

    return (
        <>
            <Outlet />
            <Notification/>
        </>
    )

        ;
};

export default App;
