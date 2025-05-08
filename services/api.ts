export const TMDB_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
    }
}

export const fetchMovies = async ({ query }: { query: string }) => {
    const url = query ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;
    const options = {
        method: 'GET',
        headers: TMDB_CONFIG.headers
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data.results;
    } catch (err) {
        console.error(err);
    }
}

export const fetchMovieDetails = async ({ id }: { id: string }) => {
    const url = `${TMDB_CONFIG.BASE_URL}/movie/${id}`;
    const options = {
        method: 'GET',
        headers: TMDB_CONFIG.headers
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data;
    } catch (err) {
        console.error(err);
    }
}

export const fetchTrendingMovies = async () => {
    const url = `${TMDB_CONFIG.BASE_URL}/trending/movie/day?language=en-US`;
    const options = {
        method: 'GET',
        headers: TMDB_CONFIG.headers
    };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        return data.results;
    } catch (err) {
        console.error(err); 
    } 
}
