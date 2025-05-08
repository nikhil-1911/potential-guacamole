import { images } from "@/constants/images";
import { Text, View, Image, TextInput, Button, Alert, TouchableOpacity, Pressable } from "react-native";
import { auth } from '../../FirebaseConfig'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import * as Google from 'expo-auth-session/providers/google';
import { useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import React from "react";
import { useAuth } from "../AuthContext";
import Toast from 'react-native-toast-message'
import { Feather } from "@expo/vector-icons";

const Profile = () => {
    const { user, isEmailVerified, loading, signOutUser } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [signInMode, setSignInMode] = useState(false);
    const [hidePassword, setHidePassword] = React.useState(true);
    const [hideConfirmPassword, setHideConfirmPassword] = React.useState(true);

    const [submitDisabled, setSubmitDisabled] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            console.log('user', user);
            console.log('isEmailVerified', isEmailVerified);
            if (!loading && user && !isEmailVerified) {
                Alert.alert("Email Not Verified", "Please verify your email to continue.");
            }
        }, [loading, user, isEmailVerified])
    );

    const signIn = async () => {
        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.log('error signing in', error);
            Toast.show({
                type: 'error',
                text1: 'Error signing in',
            });
        }
    }
    const signUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            if (user) {
                console.log('user', user);
                await sendEmailVerification(user);
                Alert.alert('Verification email sent', 'Please check your email to verify your account.');
                // router.push('/(tabs)');
            }
        } catch (error) {
            console.log('error signing in', error);
            Toast.show({
                type: 'error',
                text1: 'Error signing up',
            });

        }
    }

    if (!user) {
        return (
            <View className="flex-1 bg-primary">
                <Image source={icons.logo1} className="w-20 h-20 mt-20 mb-5 mx-auto" />
                <View className="items-center">
                    {signInMode ? (
                        // Sign In UI
                        <>
                            <Text className="text-4xl text-white text-center font-bold">Sign In</Text>
                            <TextInput
                                style={{ color: 'white' }}
                                placeholder="Email"
                                placeholderTextColor="#ffffff"
                                value={email}
                                onChangeText={(e) => setEmail(e)}
                                className="bg-gray-900 px-3 py-6 rounded-2xl mt-5 w-96"
                            />
                            <TextInput
                                style={{ color: 'white' }}
                                placeholder="Password"
                                placeholderTextColor="#ffffff"
                                value={password}
                                onChangeText={(e) => setPassword(e)}
                                className="bg-gray-900 px-3 py-6 rounded-2xl mt-5 w-96"
                            />
                            <View className="mt-8 w-96 rounded-2xl">
                                <Button title="Sign In" onPress={signIn} />
                            </View>
                            <Text className="text-white text-base mt-5">
                                Don't have an account?{' '}
                                <Text
                                    className="underline"
                                    onPress={() => setSignInMode(false)}
                                >
                                    Sign up
                                </Text>
                            </Text>
                        </>
                    ) : (
                        // Sign Up UI
                        <>
                            <Text className="text-4xl text-white text-center font-bold">Sign Up</Text>
                            <TextInput
                                style={{ color: 'white' }}
                                placeholder="Email"
                                placeholderTextColor="#ffffff"
                                value={email}
                                onChangeText={(e) => setEmail(e)}
                                className="bg-gray-900 px-3 py-6 rounded-2xl mt-5 w-96"
                            />
                            <View>
                                <TextInput
                                    style={{ color: 'white' }}
                                    secureTextEntry={hidePassword}
                                    textContentType="password"
                                    placeholder="Password"
                                    placeholderTextColor="#ffffff"
                                    value={password}
                                    onChangeText={(e) => setPassword(e)}
                                    className="bg-gray-900 px-3 py-6 rounded-2xl mt-5 w-96"
                                />
                                {password && (
                                    <Pressable
                                        onPress={() => setHidePassword(!hidePassword)}
                                        className="absolute right-4 top-10 z-10"
                                    >
                                        {hidePassword ? (
                                            <Feather name="eye" size={16} color={'#ffffff'} />
                                        ) : (
                                            <Feather name="eye-off" size={16} color={'#ffffff'} />
                                        )}
                                    </Pressable>
                                )}
                            </View>
                            <View>
                                <TextInput
                                    style={{ color: 'white' }}
                                    secureTextEntry={hideConfirmPassword}
                                    textContentType="password"
                                    placeholder="Confirm Password"
                                    placeholderTextColor="#ffffff"
                                    value={confirmPassword}
                                    onChangeText={(e) => {
                                        setConfirmPassword(e);
                                        setSubmitDisabled(e.length < 6 || password !== e);
                                    }}
                                    className="bg-gray-900 px-3 py-6 rounded-2xl mt-5 w-96"
                                />
                                {confirmPassword && (
                                    <Pressable
                                        onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
                                        className="absolute right-4 top-10 z-10"
                                    >
                                        {hideConfirmPassword ? (
                                            <Feather name="eye" size={16} color={'#ffffff'} />
                                        ) : (
                                            <Feather name="eye-off" size={16} color={'#ffffff'} />
                                        )}
                                    </Pressable>
                                )}
                            </View>

                            <View className="mt-8 w-96 rounded-2xl">
                                <Button disabled={submitDisabled} title="Sign Up" onPress={signUp} />
                            </View>
                            <Text className="text-white text-base mt-5">
                                Already have an account?{' '}
                                <Text
                                    className="underline"
                                    onPress={() => setSignInMode(true)}
                                >
                                    Sign in
                                </Text>
                            </Text>
                        </>
                    )}
                </View>
            </View>
        )
    }

    if (user && !isEmailVerified) {
        return (
            <View className="flex-1 bg-primary">
                <Image source={icons.logo1} className="w-20 h-20 mt-20 mb-5 mx-auto" />
                <View className="flex-1 justify-center items-center">
                    <Text className="text-white text-2xl font-bold">Email Not Verified</Text>
                    <Text className="text-white text-base mt-2">Please verify your email to continue.</Text>
                    <Button title="Resend Verification Email" onPress={async () => {
                        await sendEmailVerification(user);
                    }} />
                    <Text className="text-white underline mt-10" onPress={signOutUser}>Sign in with a different email</Text>
                </View>
            </View>
        )
    }

    if (user && isEmailVerified) {
        return (
            <View className="flex-1 bg-primary">
                <View className="flex-1 justify-center items-center">
                    <Text className="text-white text-2xl font-bold">Hi, {user?.email}</Text>
                    <Button title="Sign Out" onPress={signOutUser} />
                </View>
            </View>
        )
    }
}


export default Profile