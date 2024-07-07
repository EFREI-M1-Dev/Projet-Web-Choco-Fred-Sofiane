import styles from './_Modal.module.scss';
import React from "react";

export enum ModalAction {
    YES = "YES",
    NO = "NO",
    OK = "OK",
    CANCEL = "CANCEL"
}

export interface actionButton {
    buttons: "YESNO_CANCEL" | "YES_CANCEL" | "OK" | "YESNO";
    onAction: (action: ModalAction) => void;
}

const Modal = (
    props: {
        title: string;
        actionButton: actionButton;
        children: React.ReactNode;
        isOpen: boolean;
    }
) => {
    return (
        <div className={styles.modal} style={{display: props.isOpen ? "block" : "none"}}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <span className={styles.close} onClick={() => props.actionButton.onAction(ModalAction.CANCEL)}>&times;</span>
                    <h2>{props.title}</h2>
                </div>
                <div className={styles.modalBody}>
                    {props.children}
                </div>
                <div className={styles.modalFooter}>
                    {props.actionButton.buttons === "YESNO_CANCEL" && (
                        <>
                            <button onClick={() => props.actionButton.onAction(ModalAction.YES)}>Yes</button>
                            <button onClick={() => props.actionButton.onAction(ModalAction.NO)}>No</button>
                            <button onClick={() => props.actionButton.onAction(ModalAction.CANCEL)}>Cancel</button>
                        </>
                    )}
                    {props.actionButton.buttons === "YES_CANCEL" && (
                        <>
                            <button onClick={() => props.actionButton.onAction(ModalAction.YES)}>Yes</button>
                            <button onClick={() => props.actionButton.onAction(ModalAction.CANCEL)}>Cancel</button>
                        </>
                    )}
                    {props.actionButton.buttons === "OK" && (
                        <button onClick={() => props.actionButton.onAction(ModalAction.OK)}>OK</button>
                    )}
                    {props.actionButton.buttons === "YESNO" && (
                        <>
                            <button onClick={() => props.actionButton.onAction(ModalAction.YES)}>Yes</button>
                            <button onClick={() => props.actionButton.onAction(ModalAction.NO)}>No</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Modal;