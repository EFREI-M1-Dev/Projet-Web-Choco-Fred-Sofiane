import styles from './_TextField.module.scss';
import React from "react";

export const TextField = (
    props: {
        type: string,
        value: string,
        onChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
        placeholder?: string
    }
) => (
    <input
        className={styles.textField}
        type={props.type}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
    />
)
