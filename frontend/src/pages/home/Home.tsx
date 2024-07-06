import { useQuery, useMutation } from '@apollo/client';
import { Navigate } from 'react-router-dom';
import Loader from "../../components/Loader/Loader";
import { useAuth } from "../../provider/AuthProvider";
import styles from './_Home.module.scss';
import { Button } from "../../components/Button/Button";
import logo from '../../assets/logo.svg';
import PaperPlane from '../../assets/paper-plane.svg';
import { gql } from "../../types";
import { useEffect, useState } from "react";
import { Conversation } from "../../types/graphql";

const FIND_CONVERSATIONS = gql(`
  query FindConversations($id: Float!) {
    findConversations(id: $id) {
      id
      name
      createdAt
      updatedAt
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

const Home = () => {
    const { loggedIn, loadingUser, currentUser } = useAuth();
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
    const [messageContent, setMessageContent] = useState("");

    const { loading: loadingConversations, data: conversationsData } = useQuery(FIND_CONVERSATIONS, {
        variables: { id: currentUser?.id ?? 0 }, // Ensure we always have a valid id
        skip: !currentUser // Skip the query if currentUser is not available
    });

    const { loading: loadingMessages, data: messagesData, refetch: refetchMessages } = useQuery(FIND_MESSAGES_BY_CONVERSATION_ID, {
        variables: { id: Number(currentConversation?.id ?? 0) },
        skip: !currentConversation // Skip the query if no conversation is selected
    });

    const [addMessageJob] = useMutation(ADD_MESSAGE);

    useEffect(() => {
        if (conversationsData && conversationsData.findConversations.length > 0) {
            setCurrentConversation(conversationsData.findConversations[0]);
        }
    }, [conversationsData]);

    useEffect(() => {
        if (currentConversation) {
            refetchMessages().then(() => {
                // Scroll to the bottom of the messages list
                const messagesList = document.querySelector(`.${styles.messagesList}`);
                messagesList?.scrollTo(0, messagesList.scrollHeight);
            })
        }
    }, [currentConversation, refetchMessages]);

    if (loadingUser || loadingConversations) {
        return <Loader />;
    }

    if (!loggedIn || !currentUser) {
        return <Navigate to="/" />;
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
        }
    };

    return (
        <div className={styles.containerHome}>
            <div id="sidebar" className={styles.sidebar}>
                <div className={styles.top}>
                    <div className={styles.logo}>
                        <img src={logo} alt="logo" />
                    </div>
                    <div className={styles.welcomeMessage}>
                        <h4>Bonjour {currentUser.username}</h4>
                        <p>Nous vous souhaitons une agréable journée.</p>
                    </div>
                </div>
                <div className={styles.conversations}>
                    <h4>Discussions</h4>
                    <div className={styles.conversationsList}>
                        {conversationsData && conversationsData.findConversations.map(conversation => (
                            <div
                                key={conversation.id}
                                className={styles.conversationComponent}
                                onClick={() => setCurrentConversation(conversation)}
                            >
                                <div className={styles.profilePic}>
                                    {conversation.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div className={styles.content}>
                                    <div className={styles.top}>
                                        <div className={styles.name}>
                                            {conversation.name}
                                        </div>
                                        <div className={styles.time}>
                                            {new Date(conversation.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                    <div className={styles.conversationComponent}>
                        <div className={styles.profilePic}>
                            {currentConversation?.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className={styles.content}>
                            <div className={styles.top}>
                                <div className={styles.name}>
                                    {currentConversation?.name}
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
                        {loadingMessages ? (
                            <Loader />
                        ) : (
                            messagesData && messagesData.findMessagesByConversationId.map((message) => (
                                <div key={message.id} className={styles.messageWrapper}>
                                    <div className={styles.message}>
                                        <div className={styles.name}>
                                            {message.user && message.user.username}
                                        </div>
                                        <div>
                                            <p>{message.content}</p>
                                            <div className={styles.time}>
                                                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                        <img src={PaperPlane} alt="send" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Home;
