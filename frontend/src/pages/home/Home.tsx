import {useQuery, useMutation} from '@apollo/client';
import {Navigate} from 'react-router-dom';
import Loader from "../../components/Loader/Loader";
import {useAuth} from "../../provider/AuthProvider";
import styles from './_Home.module.scss';
import {Button} from "../../components/Button/Button";
import logo from '../../assets/logo.svg';
import binIcon from '../../assets/bin.svg';
import PaperPlane from '../../assets/paper-plane.svg';
import {gql} from "../../types";
import {useEffect, useRef, useState} from "react";
import {Conversation} from "../../types/graphql";
import {formatTimestamp} from "../../utils/formatTimestamp";
import {Message} from "../../components/Message/Message";
import Modal, {ModalAction} from "../../components/Modal/Modal";
import {TextField} from "../../components/TextField/TextField";
import {appropriateTextColor, getBackgroundColor} from "../../utils/getCustomColor";
import io from 'socket.io-client';
import {useMainControllerContext} from "../../main";

const FIND_CONVERSATIONS = gql(`
  query FindConversations($id: Float!) {
    findConversations(id: $id) {
      id
      name
      createdAt
      updatedAt
      ownerId
    }
  }
`);
const FIND_CONVERSATION_BY_ID = gql(`
  query FindConversationById($id: Float!) {
    conversation(id: $id) {
      id
      name
      createdAt
      updatedAt
      ownerId
    }
  }
`);


const FIND_MESSAGES_BY_CONVERSATION_ID = gql(`
  query FindMessagesByConversationId($id: Float!) {
    findMessagesByConversationId(id: $id) {
      id
      content
      createdAt
      updatedAt
      conversationId
      userId
      deletedAt
      user {
        username
      }
    }
  }
`);

const ADD_MESSAGE = gql(`
  mutation AddMessageJob($data: AddMessageJobInput!) {
    addMessageJob(data: $data)
  }
`);

const CREATE_CONVERSATION = gql(`
    mutation AddConversation($conversationName: String!) {
        addConversation(name: $conversationName) {
            id
            name
            createdAt
            updatedAt
            ownerId
        }
    }
`);

const DELETE_CONVERSATION = gql(`
    mutation DeleteConversation($id: Float!) {
        deleteConversation(id: $id) {
            id
            name
        }
    }
`);

const JOIN_CONVERSATION = gql(`
    mutation JoinConversation($conversationId: Float!) {
        joinConversation(conversationId: $conversationId) {
            id
            name
            createdAt
            updatedAt
            ownerId
        }
    }
`);

const Home = () => {
    const {m_notificationController} = useMainControllerContext();
    const {loggedIn, loadingUser, currentUser, logout} = useAuth();
    const socketRef = useRef<any>(null);

    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
    const [messageContent, setMessageContent] = useState("");

    const [modalAddDiscussion_isOpen, setModalAddDiscussion_isOpen] = useState(false);
    const [modalJoinDiscussion_isOpen, setModalJoinDiscussion_isOpen] = useState(false);
    const [inputDiscussionName, setInputDiscussionName] = useState("");
    const [conversationIdToJoin, setConversationIdToJoin] = useState<number | null>(null);

    const {
        loading: loadingConversations,
        data: conversationsData,
        refetch: refetchConversations
    } = useQuery(FIND_CONVERSATIONS, {
        variables: {id: currentUser?.id ?? 0},
        skip: !currentUser
    });


    const urlParams = new URLSearchParams(window.location.search);
    const conversationId = urlParams.get('conversationId');

    const {
        loading: loadingConversation,
        data: conversationData,
    } = useQuery(FIND_CONVERSATION_BY_ID, {
        variables: {id: Number(conversationId)},
        skip: !conversationId
    });

    const {
        loading: loadingMessages,
        data: messagesData,
        refetch: refetchMessages
    } = useQuery(FIND_MESSAGES_BY_CONVERSATION_ID, {
        variables: {id: Number(currentConversation?.id ?? 0)},
        skip: !currentConversation
    });

    const [addMessageJob] = useMutation(ADD_MESSAGE, {
        onCompleted: () => {
            console.log("Message sent successfully");
        },
        onError: (error) => {
            console.error("Error sending message:", error);
            m_notificationController.setNotification({message: "Error sending message", type: "error"});
        }
    });

    const [addConversation] = useMutation(CREATE_CONVERSATION, {
        onCompleted: (data) => {
            refetchConversations().then(() => {
                setCurrentConversation(data.addConversation);
            });
        },
        onError: (error) => {
            m_notificationController.setNotification({message: "Error creating conversation", type: "error"});
        }
    });

    const [deleteConversation] = useMutation(DELETE_CONVERSATION, {
        onCompleted: (data) => {
            m_notificationController.setNotification({message: "Conversation deleted successfully", type: "success"});
            refetchConversations().then((res) => {
                console.log("Conversations:", data);
                if (res.data && res.data.findConversations.length > 0) {
                    console.log("Setting current conversation to:", res.data.findConversations[0]);
                    setCurrentConversation(res.data.findConversations[0]);
                } else {
                    setCurrentConversation(null);
                }
            });
        },
        onError: (error) => {
            m_notificationController.setNotification({message: "Error deleting conversation", type: "error"});
        }
    });

    const [joinConversation] = useMutation(JOIN_CONVERSATION, {
        onCompleted: (data) => {
            refetchConversations().then(() => {
                setCurrentConversation(data.joinConversation);
                setModalJoinDiscussion_isOpen(false);
            });
        },
        onError: (error) => {
            console.error("Error joining conversation:", error);
            m_notificationController.setNotification({message: "Error joining conversation", type: "error"});
        }
    });

    useEffect(() => {
        if (conversationId) {
            if (conversationData && !loadingConversation && !loadingConversations) {
                const conversation = conversationData.conversation;
                const alreadyJoined = conversationsData && conversationsData.findConversations.find(conversation => conversation.id === conversationId);
                if (conversation && alreadyJoined === undefined) {
                    setConversationIdToJoin(Number(conversationId));
                    setModalJoinDiscussion_isOpen(true);
                } else {
                    setCurrentConversation(conversation);
                    m_notificationController.setNotification({message: "Vous avez déjà rejoint cette discussion", type: "info"});
                }
            }
        }
    }, [loadingConversation, loadingConversations]);


    useEffect(() => {
        if (conversationsData && conversationsData.findConversations.length > 0) {
            const currentConversationId = localStorage.getItem("currentConversationId");
            setCurrentConversation(conversationsData.findConversations.find(conversation => conversation.id === currentConversationId) || conversationsData.findConversations[0]);
        }
    }, [conversationsData]);

    useEffect(() => {
        if (currentConversation) {
            localStorage.setItem("currentConversationId", currentConversation.id.toString());
            refetchMessages().then(() => {
                const messagesList = document.querySelector(`.${styles.messagesList}`);
                messagesList?.scrollTo(0, messagesList.scrollHeight);
            });
        }
    }, [currentConversation, refetchMessages]);

    useEffect(() => {
        const socket = io(import.meta.env.VITE_GRAPHQL_ENDPOINT.replace('/graphql', ''));
        socketRef.current = socket;

        socket.on('connect', () => {
            console.log('Connected to server');
            // Rejoindre la salle de conversation actuelle si elle est définie
            if (currentConversation) {
                socket.emit('joinRoom', Number(currentConversation.id));
                console.log(`Joined room ${currentConversation.id}`);
            }
        });

        // Événement de déconnexion
        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        // Écoute de l'événement 'newMessage'
        socket.on('newMessage', (data) => {
            console.log("New message received:", data, currentConversation);
            // Rafraîchir les messages de la conversation actuelle
            refetchMessages().then(() => {
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
    }, [currentConversation, refetchMessages]);

    if (loadingUser || loadingConversations || loadingConversation) {
        return <Loader/>;
    }

    if (!loggedIn || !currentUser) {
        const query = new URLSearchParams(window.location.search);
        return <Navigate to={`/?${query}`}/>;

    }

    const handleSendMessage = async () => {
        if (!messageContent.trim() || !currentConversation) return;

        try {
            await addMessageJob({
                variables: {
                    data: {
                        conversationId: currentConversation.id,
                        userId: currentUser.id,
                        content: messageContent
                    }
                }
            });
            setMessageContent("");
            refetchMessages().then(() => {
                // Scroll to the bottom of the messages list
                const messagesList = document.querySelector(`.${styles.messagesList}`);
                messagesList?.scrollTo(0, messagesList.scrollHeight);
            });
        } catch (error) {
            console.error("Error sending message:", error);
            m_notificationController.setNotification({message: "Error sending message", type: "error"});
        }
    };
    return (
        <div
            className={styles.containerHome}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    handleSendMessage().then(() => console.log("Message sent"))
                        .catch((error) => {
                                console.error("Error sending message:", error);
                                m_notificationController.setNotification({message: "Error sending message", type: "error"});
                            }
                        );
                }
            }
            }
        >
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
                            onClick={() => {
                                logout();
                            }}
                        > Déconnexion </Button>
                    </div>
                </div>
                <div className={styles.conversations}>
                    <div className={styles.header}>
                        <h4>Discussions</h4>
                        <Button
                            onClick={() => {
                                setModalAddDiscussion_isOpen(true);
                            }}
                        > Nouvelle discussion </Button>
                    </div>
                    <div className={styles.conversationsList}>
                        {conversationsData && conversationsData.findConversations.map(conversation => (
                            <div
                                key={conversation.id}
                                className={styles.conversationComponent + ' ' + (currentConversation?.id === conversation.id ? styles.active : '')}
                                onClick={() => setCurrentConversation(conversation)}
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
                                        <div className={styles.time}>
                                            {new Date(conversation.updatedAt).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                    <div className={styles.message}>
                                        last message
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.conversationWrapper}>
                <div className={styles.header}>
                    {currentConversation &&
                        <div className={styles.conversationComponent}>
                            <div className={styles.profilePic}
                                 style={{
                                     backgroundColor: getBackgroundColor(currentConversation.name),
                                     color: appropriateTextColor(getBackgroundColor(currentConversation.name))
                                 }}
                            >
                                {currentConversation.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className={styles.content}>
                                <div className={styles.top}>
                                    <div className={styles.name}>
                                        {currentConversation.name}
                                    </div>
                                </div>
                                <div className={styles.message}>
                                    {messagesData && messagesData.findMessagesByConversationId.length > 0 ? (
                                        <span>Dernier message {formatTimestamp(new Date(messagesData.findMessagesByConversationId[messagesData.findMessagesByConversationId.length - 1].createdAt).getTime())}</span>
                                    ) : (
                                        <span>Pas de message</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                {currentConversation.ownerId === currentUser.id &&
                                    <Button
                                        onClick={() => {
                                            deleteConversation({
                                                variables: {
                                                    id: Number(currentConversation.id)
                                                }
                                            }).then(() => {
                                                console.log("Conversation deleted successfully");
                                            }).catch((error) => {
                                                console.error("Error deleting conversation:", error);
                                            });
                                        }}
                                    >
                                        <img src={binIcon} alt="delete"
                                             style={
                                                 {
                                                     width: '20px',
                                                     height: '20px'
                                                 }
                                             }/>
                                    </Button>
                                }
                                <Button
                                    onClick={() => {
                                        const baseUrl = window.location.origin + window.location.pathname;
                                        const newUrl = `${baseUrl}?conversationId=${currentConversation.id}`;
                                        navigator.clipboard.writeText(newUrl)
                                            .then(() => console.log("Copied to clipboard"));
                                    }}
                                > Partager le lien </Button>
                            </div>
                        </div>
                    }
                </div>
                <div className={styles.messagesWrapper}>
                    <div className={styles.messagesList}>
                        {loadingMessages ? (
                            <Loader/>
                        ) : (
                            messagesData && messagesData.findMessagesByConversationId.map((message) => (
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
                <div className={styles.footer}>
                    <input
                        type="text"
                        placeholder="Écrivez un message"
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                    />
                    <Button onClick={handleSendMessage}>
                        <img src={PaperPlane} alt="send"/>
                    </Button>
                </div>
            </div>

            <Modal
                title={"Nouvelle discussion"}
                actionButton={{
                    buttons: "YES_CANCEL",
                    onAction: (action) => {
                        if (action === ModalAction.YES) {
                            if (inputDiscussionName.trim() === "") return;
                            addConversation({
                                variables: {
                                    conversationName: inputDiscussionName
                                }
                            }).then(() => {
                                setModalAddDiscussion_isOpen(false);
                                setInputDiscussionName("");
                            }).catch((error) => {
                                console.error("Error creating conversation:", error);
                            });
                        } else {
                            setModalAddDiscussion_isOpen(false);
                        }
                    }
                }}
                isOpen={modalAddDiscussion_isOpen}
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
                            if (conversationIdToJoin) {
                                joinConversation({
                                    variables: {
                                        conversationId: conversationIdToJoin
                                    }
                                }).then(() => {
                                    setModalJoinDiscussion_isOpen(false);
                                }).catch((error) => {
                                    console.error("Error joining conversation:", error);
                                });
                            }
                        } else {
                            setModalJoinDiscussion_isOpen(false);
                        }
                        window.history.replaceState({}, document.title, window.location.pathname);
                    }
                }}
                isOpen={modalJoinDiscussion_isOpen}
            >
                <p>Voulez-vous rejoindre cette discussion ?</p>
            </Modal>
        </div>
    );
};

export default Home;
