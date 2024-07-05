import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from "../../../app/config/firebaseConfig";
import actions from "../../../app/actions/userAuth";
import storage from 'misc/storage';
import {fetchUserProfile} from "pages/profile/actions/profileActions";

export const AuthContext = React.createContext<any>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            dispatch(actions.authStateChange(user));
            if (user) {
                dispatch(actions.successSignIn(user));
                dispatch(fetchUserProfile(user.uid) as any);
            } else {
                dispatch(actions.requestSignOut());
                storage.removeItem(storage.keys.USER_DATA);
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    return <>{children}</>;
};

export default AuthProvider;