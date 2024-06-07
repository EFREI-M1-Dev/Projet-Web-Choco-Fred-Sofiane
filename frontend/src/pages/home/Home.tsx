import {Button} from "../../components/Button/Button";
import {TextField} from "../../components/TextField/TextField";
import {useState} from "react";
import {Conversation} from "../../components/Conversation/Conversation";

import styles from './_Home.module.scss';
import {Message} from "../../components/Message/Message";

const Home = () => {
    const [inputValue, setInputValue] = useState<string>("")

    const arrayRandomConversation = Array.from({length: 20}, (_, index) => ({
        name: `John Doe ${index}`,
        lastMessage: `Hello ${index}`,
        lastMessageDate: new Date()
    }))

    const arrayRandomMessage = Array.from({length: 20}, (_, index) => ({
        content: `Hello ${index}`,
        username: `John Doe ${index}`,
        createdAt: new Date(),
        myMessage: index % 2 === 0
    }))

    arrayRandomMessage.push({
        content: `Hello ${arrayRandomMessage.length}`,
        username: `John Doe ${arrayRandomMessage.length}`,
        createdAt: new Date(1717655706000),
        myMessage: true
    })

    return (
        <div className={styles.containerHome}>
            <Button onClick={() => console.log("Button clicked")}>Click meee</Button>
            <TextField
                type={"text"}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
            />

            <div className={styles.ContainerConversation}>
                {arrayRandomConversation.map((conversation, index) => (
                    <Conversation
                        key={index}
                        name={conversation.name}
                        lastMessage={conversation.lastMessage}
                        lastMessageDate={conversation.lastMessageDate}
                    />
                ))}
            </div>

            <div className={styles.ContainerMessage}>
                {arrayRandomMessage.map((message, index) => (
                    <Message
                        key={index}
                        content={message.content}
                        username={message.username}
                        createdAt={message.createdAt}
                        myMessage={message.myMessage}
                    />
                ))}
            </div>
        </div>
    )
}

export default Home
