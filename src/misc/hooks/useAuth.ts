import { useSelector, useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { UnknownAction } from 'redux';
import {RootState} from "../../app/reducers";
import actions from "../../app/actions/userAuth";

const useAuth = () => {
    const dispatch: ThunkDispatch<RootState, unknown, UnknownAction> = useDispatch();
    const { user, loading, error } = useSelector((state: RootState) => state.userAuth);

    return {
        user,
        loading,
        error,
        login: (email: string, password: string) => dispatch(actions.fetchLogin(email, password)),
        register: (email: string, password: string) => dispatch(actions.fetchRegister(email, password)),
        logout: () => dispatch(actions.fetchLogout()),
        googleSignIn: () => dispatch(actions.fetchGoogleSignIn()),
    };
};

export default useAuth;