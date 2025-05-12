// import { images } from "@/constants/images";
// import { Text, View, Image, TextInput, Button, Alert, TouchableOpacity, Pressable } from "react-native";
// import { auth } from '../../FirebaseConfig'
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
// import { useState } from "react";
// import { useFocusEffect, useRouter } from "expo-router";
// import { icons } from "@/constants/icons";
// import React from "react";
// import { useAuth } from "../AuthContext";
// import Toast from 'react-native-toast-message'
// import { Feather } from "@expo/vector-icons";

// const Profile = () => {
//     const { user, isEmailVerified, loading, signOutUser } = useAuth();
//     const router = useRouter();
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [signInMode, setSignInMode] = useState(false);
//     const [hidePassword, setHidePassword] = React.useState(true);
//     const [hideConfirmPassword, setHideConfirmPassword] = React.useState(true);

//     const [submitDisabled, setSubmitDisabled] = useState(true);

//     useFocusEffect(
//         React.useCallback(() => {
//             console.log('user', user);
//             console.log('isEmailVerified', isEmailVerified);
//             if (!loading && user && !isEmailVerified) {
//                 Alert.alert("Email Not Verified", "Please verify your email to continue.");
//             }
//         }, [loading, user, isEmailVerified])
//     );

//     const signIn = async () => {
//         try {
//             const user = await signInWithEmailAndPassword(auth, email, password);
//         } catch (error) {
//             console.log('error signing in', error);
//             Toast.show({
//                 type: 'error',
//                 text1: 'Error signing in',
//             });
//         }
//     }
//     const signUp = async () => {
//         try {
//             const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//             const user = userCredential.user;
//             if (user) {
//                 console.log('user', user);
//                 await sendEmailVerification(user);
//                 Alert.alert('Verification email sent', 'Please check your email to verify your account.');
//                 // router.push('/(tabs)');
//             }
//         } catch (error) {
//             console.log('error signing in', error);
//             Toast.show({
//                 type: 'error',
//                 text1: 'Error signing up',
//             });

//         }
//     }

//     if (!user) {
//         return (
//             <View className="flex-1 bg-primary">
//                 <Image source={icons.logo1} className="w-20 h-20 mt-20 mb-5 mx-auto" />
//                 <View className="items-center">
//                     {signInMode ? (
//                         // Sign In UI
//                         <>
//                             <Text className="text-4xl text-white text-center font-bold">Sign In</Text>
//                             <TextInput
//                                 style={{ color: 'white' }}
//                                 placeholder="Email"
//                                 placeholderTextColor="#ffffff"
//                                 value={email}
//                                 onChangeText={(e) => setEmail(e)}
//                                 className="bg-gray-900 px-3 py-6 rounded-2xl mt-5 w-96"
//                             />
//                             <TextInput
//                                 style={{ color: 'white' }}
//                                 placeholder="Password"
//                                 placeholderTextColor="#ffffff"
//                                 value={password}
//                                 onChangeText={(e) => setPassword(e)}
//                                 className="bg-gray-900 px-3 py-6 rounded-2xl mt-5 w-96"
//                             />
//                             <View className="mt-8 w-96 rounded-2xl">
//                                 <Button title="Sign In" onPress={signIn} />
//                             </View>
//                             <Text className="text-white text-base mt-5">
//                                 Don't have an account?{' '}
//                                 <Text
//                                     className="underline"
//                                     onPress={() => setSignInMode(false)}
//                                 >
//                                     Sign up
//                                 </Text>
//                             </Text>
//                         </>
//                     ) : (
//                         // Sign Up UI
//                         <>
//                             <Text className="text-4xl text-white text-center font-bold">Sign Up</Text>
//                             <TextInput
//                                 style={{ color: 'white' }}
//                                 placeholder="Email"
//                                 placeholderTextColor="#ffffff"
//                                 value={email}
//                                 onChangeText={(e) => setEmail(e)}
//                                 className="bg-gray-900 px-3 py-6 rounded-2xl mt-5 w-96"
//                             />
//                             <View>
//                                 <TextInput
//                                     style={{ color: 'white' }}
//                                     secureTextEntry={hidePassword}
//                                     textContentType="password"
//                                     placeholder="Password"
//                                     placeholderTextColor="#ffffff"
//                                     value={password}
//                                     onChangeText={(e) => setPassword(e)}
//                                     className="bg-gray-900 px-3 py-6 rounded-2xl mt-5 w-96"
//                                 />
//                                 {password && (
//                                     <Pressable
//                                         onPress={() => setHidePassword(!hidePassword)}
//                                         className="absolute right-4 top-10 z-10"
//                                     >
//                                         {hidePassword ? (
//                                             <Feather name="eye" size={16} color={'#ffffff'} />
//                                         ) : (
//                                             <Feather name="eye-off" size={16} color={'#ffffff'} />
//                                         )}
//                                     </Pressable>
//                                 )}
//                             </View>
//                             <View>
//                                 <TextInput
//                                     style={{ color: 'white' }}
//                                     secureTextEntry={hideConfirmPassword}
//                                     textContentType="password"
//                                     placeholder="Confirm Password"
//                                     placeholderTextColor="#ffffff"
//                                     value={confirmPassword}
//                                     onChangeText={(e) => {
//                                         setConfirmPassword(e);
//                                         setSubmitDisabled(e.length < 6 || password !== e);
//                                     }}
//                                     className="bg-gray-900 px-3 py-6 rounded-2xl mt-5 w-96"
//                                 />
//                                 {confirmPassword && (
//                                     <Pressable
//                                         onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
//                                         className="absolute right-4 top-10 z-10"
//                                     >
//                                         {hideConfirmPassword ? (
//                                             <Feather name="eye" size={16} color={'#ffffff'} />
//                                         ) : (
//                                             <Feather name="eye-off" size={16} color={'#ffffff'} />
//                                         )}
//                                     </Pressable>
//                                 )}
//                             </View>

//                             <View className="mt-8 w-96 rounded-2xl">
//                                 <Button disabled={submitDisabled} title="Sign Up" onPress={signUp} />
//                             </View>
//                             <Text className="text-white text-base mt-5">
//                                 Already have an account?{' '}
//                                 <Text
//                                     className="underline"
//                                     onPress={() => setSignInMode(true)}
//                                 >
//                                     Sign in
//                                 </Text>
//                             </Text>
//                         </>
//                     )}
//                 </View>
//             </View>
//         )
//     }

//     if (user && !isEmailVerified) {
//         return (
//             <View className="flex-1 bg-primary">
//                 <Image source={icons.logo1} className="w-20 h-20 mt-20 mb-5 mx-auto" />
//                 <View className="flex-1 justify-center items-center">
//                     <Text className="text-white text-2xl font-bold">Email Not Verified</Text>
//                     <Text className="text-white text-base mt-2">Please verify your email to continue.</Text>
//                     <Button title="Resend Verification Email" onPress={async () => {
//                         await sendEmailVerification(user);
//                     }} />
//                     <Text className="text-white underline mt-10" onPress={signOutUser}>Sign in with a different email</Text>
//                 </View>
//             </View>
//         )
//     }

//     if (user && isEmailVerified) {
//         return (
//             <View className="flex-1 bg-primary">
//                 <View className="flex-1 justify-center items-center">
//                     <Text className="text-white text-2xl font-bold">Hi, {user?.email}</Text>
//                     <Button title="Sign Out" onPress={signOutUser} />
//                 </View>
//             </View>
//         )
//     }
// }


// export default Profile

import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity, Image, ActivityIndicator, ScrollView } from "react-native";
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { db } from "@/FirebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../AuthContext";
import { icons } from "@/constants/icons";
import { router } from "expo-router";

const Profile = () => {
    const auth = getAuth();
    const { user } = useAuth();
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [hasCompletedQuiz, setHasCompletedQuiz] = useState(false);
    const [loading, setLoading] = useState(true);

    // Auth form states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);

    const signOutUser = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            Alert.alert("Error signing out:", error.message);
        }
    };

    const handleRegister = async () => {
        try {
            const userCred = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(userCred.user);
            Alert.alert("Success", "Verification email sent. Please verify and then log in.");
        } catch (error: any) {
            Alert.alert("Registration Error", error.message);
        }
    };

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            Alert.alert("Login Error", error.message);
        }
    };

    useEffect(() => {
        if (user) {
            setIsEmailVerified(user.emailVerified);
        }
    }, [user]);

    useFocusEffect(
        React.useCallback(() => {
            const checkQuizCompletion = async () => {
                if (user?.uid && user.emailVerified) {
                    const docRef = doc(db, "moviesappid", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setHasCompletedQuiz(docSnap.data().hasCompletedQuiz);
                    }
                    console.log('1', hasCompletedQuiz)
                    setLoading(false);
                } else {
                    console.log('2', hasCompletedQuiz)
                    setLoading(false);
                }
            };
            checkQuizCompletion();
        }, [user])
    );

    // useEffect(() => {
    //     console.log('3', hasCompletedQuiz)
    //     if (!loading && user && isEmailVerified && !hasCompletedQuiz) {
    //         router.replace('/MovieTasteQuiz'); // Use replace so back button doesn't return to profile
    //     }
    // }, [loading, user, isEmailVerified, hasCompletedQuiz]);

    const handleQuizLaunch = () => {
    router.push('/MovieTasteQuiz');
  };

    if (!user) {
        return (
            <View className="flex-1 justify-center items-center bg-primary px-6 pt-20">
                <Text className="text-white text-2xl font-bold mb-4">
                    {isRegistering ? "Sign Up" : "Login"}
                </Text>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholderTextColor="#ccc"
                    style={{ color: "white", borderColor: "#ccc", borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 12, width: "100%" }}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#ccc"
                    secureTextEntry
                    style={{ color: "white", borderColor: "#ccc", borderWidth: 1, borderRadius: 10, padding: 10, width: "100%" }}
                />
                <TouchableOpacity
                    onPress={isRegistering ? handleRegister : handleLogin}
                    style={{ marginTop: 20, backgroundColor: "#6c5ce7", padding: 12, borderRadius: 10, width: "100%", alignItems: "center" }}
                >
                    <Text style={{ color: "white", fontWeight: "bold" }}>
                        {isRegistering ? "Sign Up" : "Login"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setIsRegistering(!isRegistering)}
                    style={{ marginTop: 15 }}
                >
                    <Text style={{ color: "#bbb" }}>
                        {isRegistering ? "Already have an account? Log in" : "Don't have an account? Sign up"}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (user && !isEmailVerified) {
        return (
            <View className="flex-1 justify-center items-center bg-primary px-6 pt-20">
                <Text className="text-white text-xl font-semibold mb-4">Verify your email</Text>
                <Text className="text-white text-center mb-6">
                    We've sent a verification link to your email. Please verify and log back in.
                </Text>
                <TouchableOpacity
                    onPress={signOutUser}
                    style={{ backgroundColor: "#d63031", padding: 10, borderRadius: 8 }}
                >
                    <Text style={{ color: "white" }}>Logout</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-primary">
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-primary px-6 pt-10">
            {/* Logo at the top */}
            <View className="items-center mb-6">
                <Image source={icons.logo1} className="w-28 h-28" />
            </View>

            {/* Welcome Text */}
            <Text className="text-3xl text-white font-bold text-center mb-2">
                🎉 Welcome, {user.email}
            </Text>
            <Text className="text-md text-white text-center mb-6">
                You're now logged in and all set!
            </Text>

            {/* Options */}
            <View className="space-y-4">
                <OptionCard title="👤 Personal Info" onPress={() => { }} />
                <OptionCard title="🎯 Personalize My Feed" onPress={handleQuizLaunch} />
                <OptionCard title="⚙️ Settings" onPress={() => { }} />
                <OptionCard title="❓ Help & Support" onPress={() => { }} />
            </View>

            {/* Sign Out */}
            <TouchableOpacity
                onPress={signOutUser}
                style={{ backgroundColor: '#d63031', padding: 14, borderRadius: 10, marginTop: 40 }}
            >
                <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>🚪 Sign Out</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const OptionCard = ({ title, onPress }: { title: string; onPress: () => void }) => (
    <TouchableOpacity
        onPress={onPress}
        style={{
            backgroundColor: '#2d3436',
            padding: 16,
            borderRadius: 12,
            borderColor: '#636e72',
            borderWidth: 1
        }}
    >
        <Text style={{ color: '#dfe6e9', fontSize: 16, fontWeight: '600' }}>{title}</Text>
    </TouchableOpacity>
);

export default Profile;
