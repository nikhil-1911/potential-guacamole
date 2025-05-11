// Created on  by :  for project
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { fetchMovieDetails } from '@/services/api';
import { useFetch } from '@/services/useFetch';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, ScrollView, ActivityIndicator } from 'react-native'
import { doc, updateDoc, arrayUnion, arrayRemove, setDoc } from "firebase/firestore";
import { db } from '@/FirebaseConfig';
import { useAuth } from '../AuthContext';
import Toast from 'react-native-toast-message';
import { checkAchievements } from '@/components/AchievementSystem';
import React, { useState } from 'react';
import AchievementPopup from '@/components/AchievementPopup';

const MovieDetails = () => {
    const { user, isEmailVerified } = useAuth();
    const [showUnlock, setShowUnlock] = useState(null);
    const { id } = useLocalSearchParams();
    const { data, loading, error } = useFetch(() => fetchMovieDetails({
        id: id as string,
    }));

    const movieListRef = user ? doc(db, "moviesappid", user.uid) : null;

    const addMovieToList = async () => {
        if (!user) {
            Toast.show({ type: 'error', text1: 'Please sign in' });
            return;
        }

        try {
            const movieListRef = doc(db, "moviesappid", user.uid);

            // 1. Save movie
            await setDoc(movieListRef, {
                movieid: arrayUnion(data?.id)
            }, { merge: true });

            // 2. Check achievements
            const newAchievements = await checkAchievements(user.uid, 'saveMovie');

            // 3. Show celebration if unlocked
            console.log('newAchievements', newAchievements);
            if (newAchievements.length > 0) {
                console.log('newAchievements', newAchievements);
                setShowUnlock(newAchievements[0]);
            }

            Toast.show({ type: 'success', text1: 'Added to list' });

        } catch (error) {
            console.error('Save failed:', error);
            Toast.show({ type: 'error', text1: 'Save failed' });
        }
    };

    if (loading) return (
        <View className="flex-1 bg-primary justify-center items-center">
            <ActivityIndicator size="large" color="white" />
        </View>
    );

    if (error) return (
        <View className="flex-1 bg-primary justify-center items-center">
            <Text className="text-white">Error loading movie details</Text>
        </View>
    );


    return (
        <View className='flex-1 bg-primary'>

            <ScrollView className='flex-1 px-5' showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: "100%", paddingBottom: 80 }}>
                <View>
                    <Image source={{ uri: data?.poster_path ? `https://image.tmdb.org/t/p/w500${data?.poster_path}` : 'https://placehold.co/600x400/1a1a1a/ffffff.png' }} className='w-full h-[550px]' resizeMode='stretch' />
                    <View className='flex-col items-start justify-start mt-5'>
                        <View className='flex-row iems-center items-end justify-between w-full'>
                            <Text className='text-xl text-white font-bold'>{data?.title}</Text>
                            <Text className='text-lg text-white' onPress={addMovieToList}>Add to List +</Text>
                        </View>

                        <Text className='text-sm text-light-300 font-medium mt-1'>{data?.release_date?.split('-')[0]} {data?.runtime + 'm'}</Text>
                        <View className='flex-row items-center justify-start gap-x-1 mt-2 px-1 py-1 bg-slate-600'>
                            <Image source={icons.star} className='size-4' />
                            <Text className='text-xs text-white font-bold uppercase'>{Math.round(data?.vote_average) + '/10'}</Text>
                            <Text className='text-xs text-white font-bold'>({data?.vote_count} votes)</Text>
                        </View>
                        <Text className='text-sm text-light-300 font-medium mt-5'>Overview</Text>
                        <Text className='text-sm text-white font-medium mt-1'>{data?.overview}</Text>
                        <Text className='text-sm text-light-300 font-medium mt-4'>Genres</Text>
                        <View className='flex-row items-center justify-start gap-x-2 mt-1'>
                            {data?.genres?.map((genre: any) => (
                                <View key={genre.id} className='bg-slate-600 px-2 py-1'>
                                    <Text className='text-xs text-white font-bold'>{genre.name}</Text>
                                </View>
                            ))}

                        </View>
                        <View className='flex-row items-center justify-start gap-x-2 mt-4'>
                            <View className='flex-col gap-1'>
                                <Text className='text-light-300 font-medium'>Budget</Text>
                                <Text className='text-light-300 font-medium'>{Math.round(data?.budget) / 1000000} million</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <AchievementPopup
                achievement={showUnlock}
                onClose={() => setShowUnlock(null)}
            />
        </View>
    )
}

export default MovieDetails