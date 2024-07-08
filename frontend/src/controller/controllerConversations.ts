import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {gql} from "../types";
import {Conversation, PickedUser} from "../types/graphql";
import {UseNotificationController} from "./controllerNotification";
import {useAuth} from "../provider/AuthProvider";

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

export const useConversationsController = (m_notificationController: UseNotificationController) => {

    const { currentUser } = useAuth();

    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

    const [conversationIdToJoin, setConversationIdToJoin] = useState<number | null>(null);
    const [modalJoinDiscussion_isOpen, setModalJoinDiscussion_isOpen] = useState(false);
    const [modalAddDiscussion_isOpen, setModalAddDiscussion_isOpen] = useState(false);


    const urlParams = new URLSearchParams(window.location.search);
    const conversationId = urlParams.get('conversationId');



    const { loading: loadingConversations, data: conversationsData, refetch: refetchConversations } = useQuery(FIND_CONVERSATIONS, {
        variables: { id: currentUser?.id ?? 0 },
        skip: !currentUser
    });

    const {
        loading: loadingConversation,
        data: conversationData,
    } = useQuery(FIND_CONVERSATION_BY_ID, {
        variables: {id: Number(conversationId)},
        skip: !conversationId
    });

    const [addConversation] = useMutation(CREATE_CONVERSATION, {
        onCompleted: (data) => {
            refetchConversations().then(() => {
                setCurrentConversation(data.addConversation);
            });
        },
        onError: (error) => {
            m_notificationController.setNotification({ message: "Error creating conversation", type: "error" });
        }
    });

    const [deleteConversation] = useMutation(DELETE_CONVERSATION, {
        onCompleted: (data) => {
            m_notificationController.setNotification({ message: "Conversation deleted successfully", type: "success" });
            refetchConversations().then((res) => {
                if (res.data && res.data.findConversations.length > 0) {
                    setCurrentConversation(res.data.findConversations[0]);
                } else {
                    setCurrentConversation(null);
                }
            });
        },
        onError: (error) => {
            m_notificationController.setNotification({ message: "Error deleting conversation", type: "error" });
        }
    });

    const [joinConversation] = useMutation(JOIN_CONVERSATION, {
        onCompleted: (data) => {
            refetchConversations().then(() => {
                setCurrentConversation(data.joinConversation);
            });
        },
        onError: (error) => {
            m_notificationController.setNotification({ message: "Error joining conversation", type: "error" });
        }
    });


    useEffect(() => {
        if (conversationsData && conversationsData.findConversations.length > 0) {
            const currentConversationId = localStorage.getItem("currentConversationId");
            setCurrentConversation(conversationsData.findConversations.find(conversation => conversation.id === currentConversationId) || conversationsData.findConversations[0]);
        }
    }, [conversationsData]);

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
                    setConversationIdToJoin(null);
                    setModalJoinDiscussion_isOpen(false);
                    m_notificationController.setNotification({
                        message: "Vous avez déjà rejoint cette discussion",
                        type: "info"
                    });
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

    return {
        loadingConversations,
        conversationsData,
        currentConversation,
        setCurrentConversation,
        addConversation,
        deleteConversation,
        joinConversation,

        loadingConversation,
        conversationIdToJoin,
        setModalJoinDiscussion_isOpen,
        modalJoinDiscussion_isOpen,

        modalAddDiscussion_isOpen,
        setModalAddDiscussion_isOpen
    };
};

export type UseConversationsController = ReturnType<typeof useConversationsController>;
