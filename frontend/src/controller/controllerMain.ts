import useNotificationController from "./controllerNotification";
import {useConversationsController} from "./controllerConversations";
import useMessagesController from "./controllerMessages";

const useMainController = () => {

    const m_notificationController = useNotificationController();
    const m_conversationsController = useConversationsController(m_notificationController);
    const m_messagesController = useMessagesController(m_conversationsController, m_notificationController);
    return {
        m_notificationController,
        m_conversationsController,
        m_messagesController
    };
};

export default useMainController;
export type UseMainControllerReturnType = ReturnType<typeof useMainController>;