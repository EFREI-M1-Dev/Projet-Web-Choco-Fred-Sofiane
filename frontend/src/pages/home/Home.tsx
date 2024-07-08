import {Navigate} from 'react-router-dom';
import Loader from "../../components/Loader/Loader";
import {useAuth} from "../../provider/AuthProvider";
import styles from './_Home.module.scss';
import {useEffect, useRef, useState} from "react";
import {Message} from "../../components/Message/Message";
import Modal, {ModalAction} from "../../components/Modal/Modal";
import {TextField} from "../../components/TextField/TextField";
import io from 'socket.io-client';
import {useMainControllerContext} from "../../main";
import Sidebar from "../../components/Sidebar/Sidebar";
import ConversationHeader from "../../components/ConversationHeader/ConversationHeader";
import MessageInput from "../../components/MessageInput/MessageInput";


const Home = () => {
    const {m_notificationController, m_conversationsController, m_messagesController} = useMainControllerContext();
    const {loggedIn, loadingUser, currentUser, logout} = useAuth();
    const socketRef = useRef<any>(null);
    const [inputDiscussionName, setInputDiscussionName] = useState("");


    useEffect(() => {
        const socket = io(import.meta.env.VITE_GRAPHQL_ENDPOINT.replace('/graphql', ''));
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to server');
            // Rejoindre la salle de conversation actuelle si elle est définie
            if (m_conversationsController.currentConversation) {
                socket.emit('joinRoom', Number(m_conversationsController.currentConversation.id));
                console.log(`Joined room ${m_conversationsController.currentConversation.id}`);
            }
        });

        // Événement de déconnexion
        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        // Écoute de l'événement 'newMessage'
        socket.on('newMessage', (data) => {
            console.log("New message received:", data, m_conversationsController.currentConversation);
            // Rafraîchir les messages de la conversation actuelle
            m_messagesController.refetchMessages().then(() => {
                const messagesList = document.querySelector(`.${styles.messagesList}`);
                messagesList?.scrollTo(0, messagesList.scrollHeight);
            });
        });

        // Déconnexion du serveur WebSocket lors du démontage du composant
        return () => {
            socket.disconnect();
            socket.off('connect');
            socket.off('disconnect');
            socket.off('newMessage');
        };
    }, [m_conversationsController.currentConversation, m_messagesController.refetchMessages]);

    if (loadingUser || m_conversationsController.loadingConversations || m_conversationsController.loadingConversation) {
        return <Loader/>;
    }

    if (!loggedIn || !currentUser) {
        const query = new URLSearchParams(window.location.search);
        return <Navigate to={`/?${query}`}/>;

    }

    return (
        <div
            className={styles.containerHome}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    m_messagesController.handleSendMessage().then(() => console.log("Message sent"))
                        .catch((error) => {
                                console.error("Error sending message:", error);
                                m_notificationController.setNotification({message: "Error sending message", type: "error"});
                            }
                        );
                }
            }
            }
        >
            <Sidebar />

            <div className={styles.conversationWrapper}>
                <ConversationHeader messagesData={m_messagesController.messagesData} />
                <div className={styles.messagesWrapper}>
                    <div className={styles.messagesList}>
                        {m_messagesController.loadingMessages ? (
                            <Loader/>
                        ) : (
                            m_messagesController.messagesData && m_messagesController.messagesData.findMessagesByConversationId.map((message) => (
                                <Message
                                    key={message.id}
                                    content={message.content}
                                    createdAt={new Date(message.createdAt)}
                                    myMessage={message.userId === currentUser.id}
                                    username={message.user ? message.user.username : ''}
                                />
                            ))
                        )}
                    </div>
                </div>
                <MessageInput  />
            </div>

            <Modal
                title={"Nouvelle discussion"}
                actionButton={{
                    buttons: "YES_CANCEL",
                    onAction: (action) => {
                        if (action === ModalAction.YES) {
                            if (inputDiscussionName.trim() === "") return;
                            m_conversationsController.addConversation({
                                variables: {
                                    conversationName: inputDiscussionName
                                }
                            }).then(() => {
                                m_conversationsController.setModalAddDiscussion_isOpen(false);
                                setInputDiscussionName("");
                            }).catch((error) => {
                                console.error("Error creating conversation:", error);
                            });
                        } else {
                            m_conversationsController.setModalAddDiscussion_isOpen(false);
                        }
                    }
                }}
                isOpen={m_conversationsController.modalAddDiscussion_isOpen}
            >
                <TextField
                    type={"text"}
                    value={inputDiscussionName}
                    placeholder={"Entrez le nom de la discussion"}
                    onChange={(e) => setInputDiscussionName(e.target.value)}/>
            </Modal>

            <Modal
                title={"Rejoindre la discussion"}
                actionButton={{
                    buttons: "YES_CANCEL",
                    onAction: (action) => {
                        if (action === ModalAction.YES) {
                            if (m_conversationsController.conversationIdToJoin) {
                                m_conversationsController.joinConversation({
                                    variables: {
                                        conversationId: m_conversationsController.conversationIdToJoin
                                    }
                                }).then(() => {
                                    m_conversationsController.setModalJoinDiscussion_isOpen(false);
                                }).catch((error) => {
                                    console.error("Error joining conversation:", error);
                                });
                            }
                        } else {
                            m_conversationsController.setModalJoinDiscussion_isOpen(false);
                        }
                        window.history.replaceState({}, document.title, window.location.pathname);
                    }
                }}
                isOpen={m_conversationsController.modalJoinDiscussion_isOpen}
            >
                <p>Voulez-vous rejoindre cette discussion ?</p>
            </Modal>
        </div>
    );
};

export default Home;
