import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from 'misc/hooks/useAuth';
import GoogleSignInButton from 'components/GoogleSignInButton';

interface GoogleSignInProps {
    onSuccess?: () => void;
    onError: (error: string) => void;
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ onSuccess, onError }) => {
    const { googleSignIn } = useAuth();
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            const result = await googleSignIn();
            if (result.isNewUser) {
                navigate('/register', {
                    state: {
                        step: 3,
                        email: result.email,
                        firstName: result.firstName,
                        lastName: result.lastName
                    }
                });
            } else {
                navigate('/catalog');
            }
            if (onSuccess) {
                onSuccess();
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Google Sign In failed';
            onError(errorMessage);
        }
    };

    return (
        <GoogleSignInButton onClick={handleGoogleSignIn} text="Sign In with Google" />
    );
};

export default GoogleSignIn;