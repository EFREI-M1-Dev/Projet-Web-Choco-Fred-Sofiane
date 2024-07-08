import React from 'react';
import { Button } from "../../components/Button/Button";
import PaperPlane from '../../assets/paper-plane.svg';
import styles from './_MessageInput.module.scss';
import {useMainControllerContext} from "../../main";

const MessageInput = () => {

    const { m_messagesController } = useMainControllerContext();

    return (
        <div className={styles.footer}>
            <input
                type="text"
                placeholder="Écrivez un message"
                value={m_messagesController.messageContent}
                onChange={(e) => m_messagesController.setMessageContent(e.target.value)}
            />
            <Button onClick={m_messagesController.handleSendMessage}>
                <img src={PaperPlane} alt="send" />
            </Button>
        </div>
    );
};

export default MessageInput;
