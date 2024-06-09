import {createContext, useState, ReactNode, useContext, useEffect} from 'react';
import {useApolloClient, useMutation, useQuery} from '@apollo/client';
import {PickedUser} from "../types/graphql";
import {gql} from "../types";


interface AuthContextType {
    loggedIn: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    currentUser: PickedUser | null;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOGIN_MUTATION = gql(`
    mutation Login($email: String!, $password: String!) {
        login(data: { email: $email, password: $password }) {
            access_token
            user {
                id
                username
                email
            }
        }
    }
`);

const GET_PROFILE_QUERY = gql(`
    query GetProfile {
        profile {
            id
            username
            email
        }
    }
`);

export const AuthProvider = ({children}: AuthProviderProps) => {
    const [user, setUser] = useState<PickedUser | null>(null);
    const client = useApolloClient();
    const [loginMutation] = useMutation(LOGIN_MUTATION);
    const {data: profileData} = useQuery(GET_PROFILE_QUERY, {
        skip: !localStorage.getItem('token')  // Skip query if no token
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token && profileData && profileData.profile) {
            setUser(profileData.profile);
        }
    }, [profileData]);

    const login = async (email: string, password: string) => {
        try {
            const {data} = await loginMutation({variables: {email, password}});
            if (!data) throw new Error('No data');
            localStorage.setItem('token', data.login.access_token);
            setUser(data.login.user);
            await client.resetStore();
            return true;
        } catch (error) {
            if (error instanceof Error)
                throw new Error(error.message);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        client.resetStore().then(() => {
            console.log('Store reset');
        });
    };

    return (
        <AuthContext.Provider value={{loggedIn: !!user, login, logout, currentUser: user}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};