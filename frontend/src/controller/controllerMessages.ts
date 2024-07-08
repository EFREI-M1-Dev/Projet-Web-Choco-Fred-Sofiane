import {useEffect, useState} from "react";
import {useMutation, useQuery} from "@apollo/client";
import {gql} from "../types";
import {UseConversationsController} from "./controllerConversations";
import {UseNotificationController} from "./controllerNotification";
import styles from "../pages/home/_Home.module.scss";
import {useAuth} from "../provider/AuthProvider";
import Loader from "../components/Loader/Loader";

interface notification {
    message: string;
    type: "success" | "error" | "info" | "warning";
}

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

const useMessagesController = (m_conversationsController: UseConversationsController, m_notificationController: UseNotificationController) => {
    const [notification, setNotification] = useState<notification | null>(null);
    const [messageContent, setMessageContent] = useState("");

    const {currentUser} = useAuth();

    const {
        loading: loadingMessages,
        data: messagesData,
        refetch: refetchMessages
    } = useQuery(FIND_MESSAGES_BY_CONVERSATION_ID, {
        variables: {id: Number(m_conversationsController.currentConversation?.id ?? 0)},
        skip: !m_conversationsController.currentConversation
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


    useEffect(() => {
        if (m_conversationsController.currentConversation) {
            localStorage.setItem("currentConversationId", m_conversationsController.currentConversation.id.toString());
            refetchMessages().then(() => {
                const messagesList = document.querySelector(`.${styles.messagesList}`);
                messagesList?.scrollTo(0, messagesList.scrollHeight);
            });
        }
    }, [m_conversationsController.currentConversation, refetchMessages]);

    const handleSendMessage = async () => {
        if (!messageContent.trim() || !m_conversationsController.currentConversation) return;
        try {
            if(!currentUser) return;
            await addMessageJob({
                variables: {
                    data: {
                        conversationId: m_conversationsController.currentConversation.id,
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


    return {
        notification,
        setNotification,
        loadingMessages,
        messagesData,
        refetchMessages,
        addMessageJob,
        messageContent,
        setMessageContent,
        handleSendMessage

    };
};

export default useMessagesController;
export type UseMessagesController = ReturnType<typeof useMessagesController>;