import styles from './_Button.module.scss';
import React from "react";

export const Button = (
    props: {
        onClick: () => void,
        children?: string | React.ReactElement
    }
) => (
    <button
        className={styles.button}
        onClick={props.onClick}
    >
        {props.children}
    </button>
);

