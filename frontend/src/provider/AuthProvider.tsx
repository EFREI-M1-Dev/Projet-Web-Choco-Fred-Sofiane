import {createContext, useState, ReactNode, useContext, useEffect} from 'react';
import {useApolloClient, useMutation, useQuery} from '@apollo/client';
import {PickedUser} from '../types/graphql';
import {gql} from "../types";

interface AuthContextType {
    loggedIn: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    currentUser: PickedUser | null;
    loadingUser: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOGIN_MUTATION = gql(`
    mutation Login($email: String!, $password: String!) {
        login(data: { email: $email, password: $password }) {
            user {
                id
                username
                email
            }
            access_token
            refresh_token
        }
    }
`);

const REFRESH_TOKEN_MUTATION = gql(`
    mutation RefreshToken($refreshToken: String!) {
        refreshTokens(refreshToken: $refreshToken) {
            access_token
            refresh_token
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

    const [refreshTokenMutation] = useMutation(REFRESH_TOKEN_MUTATION);

    const {data: profileData, loading} = useQuery(GET_PROFILE_QUERY, {
        fetchPolicy: 'cache-and-network',
    });

    const refreshAccessToken = async (refreshToken: string) => {
        try {
            const {data} = await refreshTokenMutation({variables: {refreshToken}});
            if (!data || !data.refreshTokens) {
                throw new Error('Failed to refresh token');
            }
            localStorage.setItem('accessToken', data.refreshTokens.access_token);
            localStorage.setItem('refreshToken', data.refreshTokens.refresh_token);
            await client.resetStore();
        } catch (error) {
            console.error('Error refreshing token:', error);
            await logout();
        }
    };


    const login = async (email: string, password: string) => {
        try {
            const {data} = await loginMutation({variables: {email, password}});
            if (!data || !data.login) throw new Error('Login failed');
            console.log('Logged in:', data.login);
            setUser(data.login.user);
            localStorage.setItem('accessToken', data.login.access_token);
            localStorage.setItem('refreshToken', data.login.refresh_token);
            await client.resetStore();
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    };

    const logout = async () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        await client.clearStore()
        console.log('Store cleared');
        ;
    };


    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!accessToken && refreshToken) {
            refreshAccessToken(refreshToken).catch(logout);
        } else if (accessToken && refreshToken) {
            if (profileData && profileData.profile) {
                setUser(profileData.profile);
            }
            const intervalId = setInterval(() => {
                refreshAccessToken(refreshToken)
                    .then(() => console.log('Token refreshed'))
                    .catch(logout);
            }, 10 * 60 * 1000); // Refresh token every 14 minutes

            return () => clearInterval(intervalId);
        }
    }, [profileData, refreshAccessToken]);

    return (
        <AuthContext.Provider value={{loggedIn: !!user, login, logout, currentUser: user, loadingUser: loading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
