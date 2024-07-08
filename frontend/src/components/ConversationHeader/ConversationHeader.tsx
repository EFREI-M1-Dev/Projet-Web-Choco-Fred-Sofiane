import React from 'react';
import {Button} from "../../components/Button/Button";
import binIcon from '../../assets/bin.svg';
import {getBackgroundColor, appropriateTextColor} from "../../utils/getCustomColor";
import styles from './_ConversationHeader.module.scss';
import {Conversation, FindMessagesByConversationIdQuery, PickedUser} from "../../types/graphql";
import {formatTimestamp} from "../../utils/formatTimestamp";
import {useMainControllerContext} from "../../main";
import {useAuth} from "../../provider/AuthProvider";

const ConversationHeader = (props: {
    messagesData: FindMessagesByConversationIdQuery | undefined
}) => {
    const {m_conversationsController, m_notificationController} = useMainControllerContext();
    const {currentUser, logout, loadingUser} = useAuth();
    return (
        <div className={styles.header}>
            {m_conversationsController.currentConversation &&
                <div className={styles.conversationComponent}>
                    <div className={styles.currentConvContainer}>
                        <div className={styles.profilePic}
                             style={{
                                 backgroundColor: getBackgroundColor(m_conversationsController.currentConversation.name),
                                 color: appropriateTextColor(getBackgroundColor(m_conversationsController.currentConversation.name))
                             }}
                        >
                            {m_conversationsController.currentConversation.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div className={styles.content}>
                            <div className={styles.top}>
                                <div className={styles.name}>
                                    {m_conversationsController.currentConversation.name}
                                </div>
                            </div>
                            <div className={styles.message}>
                                {props.messagesData && props.messagesData.findMessagesByConversationId.length > 0 ? (
                                    <span>Dernier message {formatTimestamp(new Date(props.messagesData.findMessagesByConversationId[props.messagesData.findMessagesByConversationId.length - 1].createdAt).getTime())}</span>
                                ) : (
                                    <span>Pas de message</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.currentConvContainerActions}>
                        {currentUser && m_conversationsController.currentConversation.ownerId === currentUser.id &&
                            <Button
                                onClick={() => {
                                    m_conversationsController.deleteConversation({
                                        variables: {
                                            id: Number(m_conversationsController.currentConversation ? m_conversationsController.currentConversation.id : -1)
                                        }
                                    }).then(() => {
                                        console.log("Conversation deleted successfully");
                                    }).catch((error: unknown) => {
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
                                if (!m_conversationsController.currentConversation) {
                                    m_notificationController.setNotification({
                                        message: "Impossible de copier le lien",
                                        type: "error"
                                    });
                                } else {
                                    const baseUrl = window.location.origin + window.location.pathname;
                                    const newUrl = `${baseUrl}?conversationId=${m_conversationsController.currentConversation.id}`;
                                    navigator.clipboard.writeText(newUrl)
                                        .then(() => {
                                            m_notificationController.setNotification({
                                                message: "Lien copié dans le presse-papier",
                                                type: "success"
                                            });
                                        });
                                }

                            }}
                        > Partager le lien </Button>
                    </div>
                </div>
            }
        </div>
    );
};

export default ConversationHeader;
