import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import { auth } from '../FirebaseConfig';

// Create AuthContext
const AuthContext = createContext();

// Create a hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};

// AuthProvider to wrap around the app
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEmailVerified, setIsEmailVerified] = useState(false);

    // Listen for authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if(user){
                await user.reload(); 
                setUser(user);
                setIsEmailVerified(user.emailVerified); 
            } else {
                setUser(null);
            }
            setLoading(false);  // Finish loading when we have the user
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const signOutUser = async () => {
        try {
            await firebaseSignOut(auth);
            setUser(null); // Clear user after successful sign out
            setIsEmailVerified(false);
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    const value = {
        user,
        isEmailVerified,
        loading,
        signOutUser
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? null : children} {/* Show nothing until we know the user's state */}
        </AuthContext.Provider>
    );
};
