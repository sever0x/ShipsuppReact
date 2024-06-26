import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "../../../app/config/firebaseConfig";
import actions from "../../../app/actions/userAuth";
import {AUTH_STATE_CHANGED} from "../../../app/constants/actionTypes";

export const AuthContext = React.createContext<any>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            dispatch(actions.authStateChange(user));
            if (user) {
                dispatch(actions.successSignIn(user));
            } else {
                dispatch(actions.requestSignOut());
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    return <>{children}</>;
};

export default AuthProvider;