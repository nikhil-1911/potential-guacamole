import { ActivityIndicator, FlatList, ScrollView, Text, View } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/FirebaseConfig";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";
import { useFetch } from "@/services/useFetch";
import { fetchMovieDetails, fetchMovies } from "@/services/api";
import { useFocusEffect } from "expo-router";
import React from "react";
import MovieCard from "@/components/MovieCard";

const Saved = () => {
    const [savedMovieIds, setSavedMovieIds] = useState([]);
    const { user, isEmailVerified } = useAuth();
    const [loading, setLoading] = useState(true);
    const docRef = user ? doc(db, "moviesappid", user?.uid) : null;
    console.log('savedloaded1');
    const [movies, setMovies] = useState<any[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            const getMovies = async () => {
                setLoading(true);
                try {
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const savedMovieIds = docSnap.data().movieid || [];
                        if (savedMovieIds.length > 0) {
                            const savedMovies = await Promise.all(
                                savedMovieIds.map(async (id) => {
                                    return await fetchMovieDetails({ id: id as string });
                                })
                            );
                            const flattenedMovies = savedMovies.flat();
                            setMovies(flattenedMovies);
                        } else {
                            setMovies([]);
                        }
                    } else {
                        console.log("No such document!");
                    }
                } catch (error) {
                    console.error("Error fetching saved movies:", error);
                }
                setLoading(false);
            };
            getMovies();
            return () => {
                console.log("screen unfocused");
            };
        }, [user?.uid])
    );

    return (
        <View className="flex-1 bg-primary">
            {
                loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="white" />
                    </View>
                ) :
                    movies?.length === 0 ? (
                        <View className="flex-1 justify-center items-center">
                            <Text className="text-white">No saved movies</Text>
                        </View>
                    ) : (
                        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}>
                            <FlatList
                                data={movies}
                                renderItem={({ item }) => (
                                    <MovieCard {...item} />
                                )}
                                keyExtractor={(item) => item.id}
                                numColumns={3}
                                columnWrapperStyle={{
                                    justifyContent: 'flex-start',
                                    marginBottom: 10,
                                    gap: 20,
                                    paddingRight: 5
                                }}
                                className="mt-2 pb-32"
                                scrollEnabled={false}
                            />
                        </ScrollView>
                    )
            }

        </View>
    )
}

export default Saved