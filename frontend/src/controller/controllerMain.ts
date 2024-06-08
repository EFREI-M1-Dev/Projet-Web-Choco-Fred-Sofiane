import useAuthController from "./controllerAuth";

const useMainController = () => {

    const m_authController = useAuthController();

    return {
        m_authController,
    };
};

export default useMainController;
export type UseMainControllerReturnType = ReturnType<typeof useMainController>;