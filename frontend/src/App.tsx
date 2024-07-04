import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {useAuth} from "./provider/AuthProvider";

const App = () => {
    const {pathname} = useLocation();
    const { loggedIn } = useAuth();

    if(loggedIn && pathname !== '/home') {
        return <Navigate to="/home" />;
    }

    return <Outlet />;
};

export default App;
