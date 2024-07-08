import useNotificationController from "./controllerNotification";

const useMainController = () => {

    const m_notificationController = useNotificationController();

    return {
        m_notificationController
    };
};

export default useMainController;
export type UseMainControllerReturnType = ReturnType<typeof useMainController>;