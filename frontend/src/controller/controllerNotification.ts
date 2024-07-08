import {useEffect, useState} from "react";

interface notification {
    message: string;
    type: "success" | "error" | "info" | "warning";
}

const useNotificationController = () => {
    const [notification, setNotification] = useState<notification | null>(null);

    useEffect(() => {
        if (notification) {
            setTimeout(() => {
                setNotification(null);
            }, 5000);
        }
    }, [notification]);

    return {
        notification,
        setNotification
    };
};

export default useNotificationController;
export type UseNotificationController = ReturnType<typeof useNotificationController>;