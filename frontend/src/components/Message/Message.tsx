import styles from './_Message.module.scss';
import {formatTimestamp} from "../../utils/formatTimestamp";

export const Message = (
    props: {
        content: string,
        username: string,
        createdAt: Date,
        myMessage: boolean
    }
) => (
    <div className={styles.container}>
        <div className={styles.head + " " + (props.myMessage ? styles.my : '')}>
            <p className={styles.username}>{props.username}</p>
            <p className={styles.heure}>{formatTimestamp(props.createdAt.getTime())}</p>
        </div>
        <p className={styles.content}>
            {props.content}
        </p>
    </div>
)
