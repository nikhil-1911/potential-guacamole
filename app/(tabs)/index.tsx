import { ActivityIndicator, Alert, Animated, FlatList, Image, Text, View } from "react-native";
import { Link } from "expo-router";
import { images } from "@/constants/images";
import ScrollView = Animated.ScrollView;
import { icons } from "@/constants/icons";
import SearchBar from "../../components/SearchBar";
import { useRouter } from "expo-router";
import { useFetch } from "@/services/useFetch";
import { fetchMovies, fetchTrendingMovies } from "@/services/api";
import React, { useEffect, useState } from "react";
import MovieCard from "@/components/MovieCard";
import 'react-native-url-polyfill/auto'
import { getAuth } from "@firebase/auth";
import { useAuth } from "../AuthContext";
import HeroCarousel from "@/components/HeroCarousel";

export default function Index() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMoviesQuery = React.useCallback(() => fetchMovies({ query: searchQuery }), [searchQuery]);
  const { data: movies, loading, error, refetch: loadMovies } = useFetch(fetchMoviesQuery);

  const { data: trending } = useFetch(() => fetchTrendingMovies());

  useEffect(() => {
    console.log("Trending movies:", trending);
  }, [trending])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadMovies();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        <Image source={icons.logo1} className="w-20 h-20 mt-20 mb-5 mx-auto" />

        <SearchBar
          placeholder="Search for a movie"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center" />
        ) : error ? (
          <Text className="text-center text-white">{error.message}</Text>
        ) : movies?.length === 0 ? (
          <Text className="text-white text-center mt-10">
            {searchQuery ? "No movies found." : "Search for a movie above."}
          </Text>
        ) : (
          <>
            {
              trending?.length > 0 && searchQuery === "" && (
                <>
                  <Text className="text-lg text-white font-bold mt-5 mb-3">
                    Trending This Week
                  </Text>
                  <HeroCarousel movies={trending} />
                </>
              )
            }

            <Text className="text-lg text-white font-bold mt-5 mb-3">
              {searchQuery ? "Search Results" : "Latest Movies"}
            </Text>
            <FlatList
              data={movies || []} // Fallback to empty array
              renderItem={({ item }) => <MovieCard {...item} />}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: 'flex-start',
                marginBottom: 10,
                gap: 20,
                paddingRight: 5,
              }}
              scrollEnabled={false}
            />
          </>
        )}
      </ScrollView>
    </View>
  );
}