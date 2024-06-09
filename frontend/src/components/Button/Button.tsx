import styles from './_Button.module.scss';
import React from "react";

export const Button = (
    props: {
        onClick?: () => void,
        children: string | React.ReactElement
        className?: string
    }
) => (
    <button
        className={styles.button + ' ' + props.className}
        onClick={props.onClick}
    >
        {props.children}
    </button>
);

