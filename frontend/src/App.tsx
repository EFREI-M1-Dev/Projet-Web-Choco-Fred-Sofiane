import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {useAuth} from "./provider/AuthProvider";

const App = () => {
    const {pathname} = useLocation();
    const { loggedIn } = useAuth();

    if(loggedIn && !pathname.startsWith('/home')) {
        const query = new URLSearchParams(window.location.search);
        return <Navigate to={`/home?${query}`} />;
    }

    return <Outlet />;
};

export default App;
