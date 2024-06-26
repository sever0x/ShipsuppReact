import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from "../../../app/config/firebaseConfig";
import actions from "../../../app/actions/userAuth";

export const AuthContext = React.createContext<any>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state: any) => state.userAuth);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                dispatch(actions.successSignIn(user));
            } else {
                dispatch(actions.requestSignOut());
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    return (
        <AuthContext.Provider value={{ user, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;