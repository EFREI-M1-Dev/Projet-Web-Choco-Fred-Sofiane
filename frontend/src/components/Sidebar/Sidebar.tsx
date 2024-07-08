import React from 'react';
import {Button} from "../../components/Button/Button";
import logo from '../../assets/logo.svg';
import {getBackgroundColor, appropriateTextColor} from "../../utils/getCustomColor";
import styles from './_Sidebar.module.scss';
import {Conversation, FindConversationsQuery, PickedUser} from "../../types/graphql";
import {useMainControllerContext} from "../../main";
import {useAuth} from "../../provider/AuthProvider";
import Loader from "../Loader/Loader";

const Sidebar = () => {

    const {m_conversationsController} = useMainControllerContext();
    const {currentUser,logout, loadingUser} = useAuth();

    if(!currentUser || loadingUser) {
        return <Loader />
    };

    return (
        <div id="sidebar" className={styles.sidebar}>
            <div className={styles.top}>
                <div className={styles.logo}>
                    <img src={logo} alt="logo"/>
                </div>
                <div className={styles.welcomeMessage}>
                    <h4>Bonjour {currentUser.username}</h4>
                    <p>Nous vous souhaitons une agréable journée.</p>
                    <Button
                        className={styles.logoutButton}
                        onClick={logout}
                    > Déconnexion </Button>
                </div>
            </div>
            <div className={styles.conversations}>
                <div className={styles.header}>
                    <h4>Discussions</h4>
                    <Button onClick={() => m_conversationsController.setModalAddDiscussion_isOpen(true)}> Nouvelle discussion </Button>
                </div>
                <div className={styles.conversationsList}>
                    {m_conversationsController.conversationsData && m_conversationsController.conversationsData.findConversations.map(conversation => (
                        <div
                            key={conversation.id}
                            className={`${styles.conversationComponent} ${m_conversationsController.currentConversation?.id === conversation.id ? styles.active : ''}`}
                            onClick={() => m_conversationsController.setCurrentConversation(conversation)}
                        >
                            <div
                                className={styles.profilePic}
                                style={{
                                    backgroundColor: getBackgroundColor(conversation.name),
                                    color: appropriateTextColor(getBackgroundColor(conversation.name))
                                }}
                            >
                                {conversation.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className={styles.content}>
                                <div className={styles.top}>
                                    <div className={styles.name}>
                                        {conversation.name}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
