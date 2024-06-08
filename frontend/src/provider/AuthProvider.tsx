import { createContext, useState, ReactNode, useEffect } from 'react';
import { gql, useApolloClient, useMutation } from '@apollo/client';
import {PickedUser} from "../types/graphql";


interface AuthContextType {
    loggedIn: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    currentUser: PickedUser | null;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOGIN_MUTATION = gql`
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
`;

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<PickedUser | null>(null);
    const client = useApolloClient();
    const [loginMutation] = useMutation(LOGIN_MUTATION);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            client
                .query({
                    query: gql(`
                        query GetProfile {
                            profile {
                                id
                                username
                                email
                            }
                        }
                    `),
                })
                .then(response => {
                    setUser(response.data.profile);
                })
                .catch(error => {
                    console.error(error);
                    localStorage.removeItem('token');
                });
        }
    }, [client]);

    const login = async (email: string, password: string) => {
        try {
            const { data } = await loginMutation({ variables: { email, password } });
            localStorage.setItem('token', data.login.access_token);
            setUser(data.login.user);
            await client.resetStore();
        } catch (error) {
            console.error(error);
            throw new Error('Login failed');
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
        <AuthContext.Provider value={{ loggedIn: !!user, login, logout, currentUser: user }}>
            {children}
        </AuthContext.Provider>
    );
};
