import React from 'react';
import {useRouteError, isRouteErrorResponse, Link} from 'react-router-dom';
import styles from "./_error-page.module.scss";
import {Button} from "../../components/Button/Button";

const ErrorPage: React.FC = () => {
    const error = useRouteError();
    let errorMessage: string;
    let errorStatus: number = 500;

    if (isRouteErrorResponse(error)) {
        errorMessage = error.data?.message || error.statusText;
        errorStatus = error.status;
    } else if (error instanceof Error) {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else {
        console.error(error);
        errorMessage = 'Unknown error';
    }

    return (
            <div className={styles.container}>
                <div className={styles.error} >
                    <h1>Oops!</h1>
                    <p>Sorry, an unexpected error has occurred.</p>
                    <p>
                        <i>{errorStatus} - {errorMessage}</i>
                    </p>
                    <Link to={'/'}>
                        <Button>Go back to the home page</Button>
                    </Link>
                </div>
            </div>
    );
};

export default ErrorPage;