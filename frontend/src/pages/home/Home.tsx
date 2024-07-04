import {Button} from "../../components/Button/Button";
import logo from '../../assets/logo.svg';
import PaperPlane from '../../assets/paper-plane.svg';

import styles from './_Home.module.scss';
import {useAuth} from "../../provider/AuthProvider";
import {Navigate} from "react-router-dom";
import Loader from "../../components/Loader/Loader";

const Home = () => {
    const {loggedIn, loadingUser} = useAuth();

    if (loadingUser) {
        return <Loader/>;
    }

    if (!loggedIn) {
        return <Navigate to="/"/>;
    }

    return (
        <div className={styles.containerHome}>
            <div id="sidebar" className={styles.sidebar}>
                <div className={styles.top}>
                    <div className={styles.logo}>
                        <img src={logo} alt="logo"/>
                    </div>

                    <div className={styles.welcomeMessage}>
                        <h4>Bonjour Sofiane</h4>
                        <p>Nous vous souhaitons une agréable journée.</p>
                    </div>
                </div>

                <div className={styles.conversations}>
                    <h4>Discussions</h4>
                    <div className={styles.conversationsList}>
                        <div className={styles.conversationComponent}>
                            <div className={styles.profilePic}>
                                D
                            </div>
                            <div className={styles.content}>
                                <div className={styles.top}>
                                    <div className={styles.name}>
                                        Dorian
                                    </div>
                                    <div className={styles.time}>
                                        9:45
                                    </div>
                                </div>
                                <div className={styles.message}>
                                    Salut
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.conversationWrapper}>
                <div className={styles.header}>
                    <div className={styles.conversationComponent}>
                        <div className={styles.profilePic}>
                            D
                        </div>
                        <div className={styles.content}>
                            <div className={styles.top}>
                                <div className={styles.name}>
                                    Dorian
                                </div>
                            </div>
                            <div className={styles.message}>
                                Dernier message aujourd’hui à 9H45
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.messagesWrapper}>
                    <div className={styles.messagesList}>

                        <div className={styles.messageWrapper}>
                            <div className={styles.message}>
                                <div className={styles.name}>
                                    Dorian
                                </div>
                                <div>
                                    <p>Ceci est un message d'exemple</p>
                                    <div className={styles.time}>
                                        10H54
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <div className={styles.footer}>
                    <input type="text" placeholder="Écrivez un message"/>
                    <Button onClick={() => {
                    }}>
                        <img src={PaperPlane} alt="send"/>
                    </Button>
                </div>
            </div>

        </div>
    )
}

export default Home
