import {createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, User} from 'firebase/auth';
import React, {createContext, useContext, useEffect, useState} from "react";
import {auth} from "../../config/firebaseConfig";

interface AuthContextProps {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });
    }, []);

    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const register = async (email: string, password: string) => {
        await createUserWithEmailAndPassword(auth, email, password);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;