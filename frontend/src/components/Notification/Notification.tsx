import styles from "./_Notification.module.scss"
import classNames from "classnames";
import React from "react";
import {useMainControllerContext} from "../../main";


export const Notification: React.FC  = () => {
    const {m_notificationController} = useMainControllerContext();

    if (!m_notificationController.notification) return <></>

    const notifClassName = classNames(
        styles.containerNotification,
        styles[m_notificationController.notification.type]
    );

    return (
        <div className={notifClassName}>
            {m_notificationController.notification.message}
        </div>

    );
}

