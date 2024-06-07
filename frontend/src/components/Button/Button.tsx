import styles from './_Button.module.scss';

export const Button = (
    props: {
        value: string,
        onClick: () => void
    }
) => (
    <button
        className={styles.button}
        onClick={props.onClick}
    >
        {props.value}
    </button>
);

