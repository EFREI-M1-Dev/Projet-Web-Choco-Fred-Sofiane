import styles from './_Authentification.module.scss';
import {TextField} from "../../components/TextField/TextField";
import {useState} from "react";
import {Button} from "../../components/Button/Button";
import {useAuth} from "../../provider/AuthProvider";
import {gql} from "../../types";
import {useApolloClient, useMutation} from "@apollo/client";

const REGISTER_MUTATION = gql(`
        mutation Register($data: CreateUserInput!) {
          createUser(data: $data) {
            id
            email
            username
            password
          }
        }
    `);


const AuthentificationPage = () => {

    const [isLogin, setIsLogin] = useState<boolean>(true);

    const [inputEmailValue, setInputEmailValue] = useState<string>('');
    const [inputPasswordValue, setInputPasswordValue] = useState<string>('');
    const [inputConfirmPasswordValue, setInputConfirmPasswordValue] = useState<string>('');
    const [inputUsernameValue, setInputUsernameValue] = useState<string>('');

    const [registerMutation] = useMutation(REGISTER_MUTATION);
    const client = useApolloClient();

    const {login, currentUser} = useAuth();

    const handleSubmit = async () => {
        try {
            if (isLogin) {
                if (inputEmailValue === '' || inputPasswordValue === '') {
                    throw new Error('Veuillez remplir tous les champs');
                }
                await login(inputEmailValue, inputPasswordValue);
            } else {
                if (inputEmailValue === '' || inputPasswordValue === '' || inputConfirmPasswordValue === '' || inputUsernameValue === '') {
                    throw new Error('Veuillez remplir tous les champs');
                }

                if (inputPasswordValue !== inputConfirmPasswordValue) {
                    throw new Error('Les mots de passe ne correspondent pas');
                }

                const { data } = await registerMutation(
                    {
                        variables: {
                            data: {email: inputEmailValue, password: inputPasswordValue, username: inputUsernameValue}
                        }
                    }
                );
                if (!data) throw new Error('No data');
                await client.resetStore();
            }
        } catch
            (e) {
            if (e instanceof Error)
                alert(e.message);
        }
    }

    const toggleForm = () => {
        setInputEmailValue('');
        setInputPasswordValue('');
        setInputConfirmPasswordValue('');
        setInputUsernameValue('');
        setIsLogin(!isLogin);
    }

    return (
        <div className={styles.containerAuth}>

            {currentUser && <h1>Bonjour {currentUser.username}</h1>}

            {isLogin ?
                <div className={styles.containerForm}>
                    <h1>Connexion</h1>
                    <TextField
                        value={inputEmailValue}
                        placeholder={"Email"}
                        type="text"
                        onChange={(event) => setInputEmailValue(event.target.value)}
                    />
                    <TextField
                        value={inputPasswordValue}
                        placeholder={"Password"}
                        type="password"
                        onChange={(event) => setInputPasswordValue(event.target.value)}
                    />
                    <Button
                        className={styles.button}
                        onClick={handleSubmit}
                    >
                        Login
                    </Button>
                </div>
                :
                <div className={styles.containerForm}>
                    <h1>Inscription</h1>

                    <TextField
                        value={inputUsernameValue}
                        placeholder={"Username"}
                        type="text"
                        onChange={(event) => setInputUsernameValue(event.target.value)}
                    />

                    <TextField
                        value={inputEmailValue}
                        placeholder={"Email"}
                        type="text"
                        onChange={(event) => setInputEmailValue(event.target.value)}
                    />
                    <TextField
                        value={inputPasswordValue}
                        placeholder={"Password"}
                        type="password"
                        onChange={(event) => setInputPasswordValue(event.target.value)}
                    />

                    <TextField
                        value={inputConfirmPasswordValue}
                        placeholder={"Confirm Password"}
                        type="password"
                        onChange={(event) => setInputConfirmPasswordValue(event.target.value)}
                    />

                    <Button
                        className={styles.button}
                        onClick={handleSubmit}
                    >
                        Register
                    </Button>
                </div>
            }
            <div className={styles.containerSwitch}>
                <Button
                    className={styles.button}
                    onClick={toggleForm}
                >
                    {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
                </Button>
            </div>

        </div>
    )
}

export default AuthentificationPage
