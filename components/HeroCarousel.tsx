import React from 'react'
import { Dimensions, FlatList, View } from 'react-native'
import MovieCard from './MovieCard'

const HeroCarousel = ({ movies }) => {
  const { width } = Dimensions.get('window')
  const itemWidth = width / 3 // Each item takes 1/3 of screen

  return (
    <FlatList
      data={movies}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={{ width: itemWidth }}> {/* Wrapper View controls width */}
          <MovieCard {...item} hero />
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ paddingHorizontal: 8 }} // Small outer padding
      decelerationRate="fast"
    />
  )
}

export default HeroCarousel