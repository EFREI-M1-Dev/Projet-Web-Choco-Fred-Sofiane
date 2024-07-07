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
    <div  className={styles.messageWrapper + ' '+ (props.myMessage ? styles.my : '')}>
        <div className={styles.message}>
            <div className={styles.name}>
                {props.username}
            </div>
            <div>
                <p>{props.content}</p>
                <div className={styles.time}>
                    {formatTimestamp(props.createdAt.getTime())}
                </div>
            </div>
        </div>
    </div>



)
