import {Button} from "../../components/Button/Button";
import {TextField} from "../../components/TextField/TextField";
import {useState} from "react";
import {Conversation} from "../../components/Conversation/Conversation";
import logo from '../../assets/logo.svg';

import styles from './_Home.module.scss';
import {Message} from "../../components/Message/Message";

const Home = () => {
    const [inputValue, setInputValue] = useState<string>("")

    const arrayRandomConversation = Array.from({length: 20}, (_, index) => ({
        name: `John Doe ${index}`,
        lastMessage: `Hello ${index}`,
        lastMessageDate: new Date()
    }))

    const arrayRandomMessage = Array.from({length: 20}, (_, index) => ({
        content: `Hello ${index}`,
        username: `John Doe ${index}`,
        createdAt: new Date(),
        myMessage: index % 2 === 0
    }))

    arrayRandomMessage.push({
        content: `Hello ${arrayRandomMessage.length}`,
        username: `John Doe ${arrayRandomMessage.length}`,
        createdAt: new Date(1717655706000),
        myMessage: true
    })

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

        </div>
    )
}

export default Home
