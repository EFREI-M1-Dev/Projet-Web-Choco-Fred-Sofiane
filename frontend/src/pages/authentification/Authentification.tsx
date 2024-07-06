import styles from './_Authentification.module.scss';
import {useState} from "react";
import {Button} from "../../components/Button/Button";
import presentation from '../../assets/home-presentation.avif';
import logo from '../../assets/logo.svg';
import {useAuth} from "../../provider/AuthProvider";
import {gql} from "../../types";
import {useApolloClient, useMutation} from "@apollo/client";
import {useNavigate} from "react-router";
import Loader from "../../components/Loader/Loader";

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

    const {login, loadingUser} = useAuth();
    const navigate = useNavigate();

    if (loadingUser) {
        return <Loader/>;
    }

    const handleSubmit = async () => {
        try {
            if (isLogin) {
                if (inputEmailValue === '' || inputPasswordValue === '') {
                    throw new Error('Veuillez remplir tous les champs');
                }
                const ret = await login(inputEmailValue, inputPasswordValue);

                if (!ret) {
                    throw new Error('Email ou mot de passe incorrect');
                }

                await client.resetStore();
                navigate('/home');

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
        } catch (e) {
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
        <div className={styles.loginForm}>
            <div className={styles.flexContainer}>
                <div className={styles.phonePresentation}>
                    <img src={presentation} alt="phone-presentation"/>
                </div>
                <div className={styles.rightPart}>
                    {isLogin ?
                        <div id="loginForm">
                            <div className={styles.logo}>
                                <img src={logo} alt="logo"/>
                            </div>
                            <form className={styles.form} data-form-type="login">
                                <h4>Connexion</h4>
                                <div id="loginError" className={`${styles.alert} ${styles.alertDanger} ${styles.hidden}`}>
                                    Erreur lors de la connexion
                                </div>
                                <div id="registerSuccess" className={`${styles.alert} ${styles.alertSuccess} ${styles.hidden}`}>
                                    Compte créé avec succès, vous pouvez vous connecter
                                </div>

                                <div className={styles.marginY}>
                                    <div className={styles.formFloating}>
                                        <input type="email" className={styles.formControl} id="loginEmailInput"
                                               placeholder="gordon.freeman@blackmesa.us" required
                                               value={inputEmailValue}
                                               onChange={(e) => setInputEmailValue(e.target.value)}
                                        />
                                        <label htmlFor="loginEmailInput">Adresse e-mail</label>
                                    </div>
                                    <div className={styles.formFloating}>
                                        <input type="password" className={styles.formControl} id="loginPasswordInput"
                                               placeholder="Mot de passe" required
                                               value={inputPasswordValue}
                                               onChange={(e) => setInputPasswordValue(e.target.value)}
                                        />
                                        <label htmlFor="loginPasswordInput">Mot de passe</label>
                                    </div>
                                </div>

                                <Button className={styles.buttonPrimary} onClick={handleSubmit}>
                                    Se connecter
                                </Button>
                            </form>

                            <div className={styles.form}>
                                <span>Vous n'avez pas de compte ? <a id="showRegisterFormLink" href="#"
                                                                     className={styles.boldText}
                                                                     onClick={toggleForm}>Inscrivez-vous</a></span>
                            </div>
                        </div>
                        :
                        <div id="registerForm">
                            <div className={styles.logo}>
                                <img src={logo} alt="logo"/>
                            </div>
                            <form className={styles.form} data-form-type="register">
                                <h4>Créer un compte</h4>
                                <div id="registerError" className={`${styles.alert} ${styles.alertDanger} ${styles.hidden}`}>
                                    Erreur lors de la création du compte
                                </div>

                                <div className={styles.marginY}>
                                    <div className={styles.marginBottom}>
                                        <label htmlFor="registerEmailInput" className={styles.formLabel}>Adresse
                                            e-mail</label>
                                        <input type="email" className={styles.formControl} id="registerEmailInput"
                                               placeholder="gordon.freeman@blackmesa.us" required
                                               value={inputEmailValue}
                                               onChange={(e) => setInputEmailValue(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.marginBottom}>
                                        <label htmlFor="registerPasswordInput" className={styles.formLabel}>Mot de
                                            passe</label>
                                        <input type="password" className={`${styles.formControl} ${styles.marginBottom}`} id="registerPasswordInput"
                                               placeholder="Mot de passe" required
                                               value={inputPasswordValue}
                                               onChange={(e) => setInputPasswordValue(e.target.value)}
                                        />
                                        <input type="password" className={styles.formControl}
                                               id="registerPasswordConfirmInput"
                                               placeholder="Confirmer le mot de passe" required
                                               value={inputConfirmPasswordValue}
                                               onChange={(e) => setInputConfirmPasswordValue(e.target.value)}
                                        />
                                    </div>
                                    <div className={styles.marginBottom}>
                                        <label htmlFor="registerNameInput" className={styles.formLabel}>Nom
                                            d'utilisateur</label>
                                        <input type="text" className={styles.formControl} id="registerNameInput"
                                               placeholder="Gordon Freeman" required
                                               value={inputUsernameValue}
                                               onChange={(e) => setInputUsernameValue(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <Button className={styles.buttonPrimary} onClick={handleSubmit}>
                                    S'inscrire
                                </Button>
                            </form>

                            <div className={styles.form}>
                                <span>Vous possédez déjà un compte ?</span>
                                <a id="showLoginFormLink" href="#" className={styles.boldText} onClick={toggleForm}>
                                    Connectez-vous
                                </a>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default AuthentificationPage;