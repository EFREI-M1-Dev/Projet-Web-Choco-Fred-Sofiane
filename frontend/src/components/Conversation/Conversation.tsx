import styles from './_Conversation.module.scss';

export const Conversation = (
    props: {
        name: string,
        lastMessage: string,
        lastMessageDate: Date
    }
) => (
    <div className={styles.container} >
        <div>
            <p className={styles.name}>{props.name}</p>
            <p className={styles.lastMessage}>{props.lastMessage}</p>
        </div>
        <p className={styles.heure}> {props.lastMessageDate.getHours()}:{props.lastMessageDate.getMinutes()} </p>
    </div>
)
