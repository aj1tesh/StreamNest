import { useEffect, useState } from 'react';
import Search from './components/Search.jsx';
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import { useDebounce } from 'react-use';

const API_BASE_URL = 'https://cors-anywhere.herokuapp.com/https://imdb8.p.rapidapi.com/v2/search?searchTerm=';

const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

const API_OPTIONS = {
method: 'GET',
headers: {
    'X-RapidAPI-Key': API_KEY,
    'X-RapidAPI-Host': 'imdb8.p.rapidapi.com',
},
};

const App = () => {
const [searchTerm, setSearchTerm] = useState('');
const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
const [movieList, setMovieList] = useState([]);
const [errorMessage, setErrorMessage] = useState('');
const [isLoading, setIsLoading] = useState(false);

useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
}, 500, [searchTerm]);

const fetchMovies = async (query = '') => {
    if (!query) {
        setMovieList([]);
        return;
    }

    setIsLoading(true);
    setErrorMessage('');
    console.log(`Fetching movies for: ${query}`);

    try {
        const response = await fetch(
            `${API_BASE_URL}${encodeURIComponent(query)}`,
            API_OPTIONS
        );

        if (!response.ok) {
            throw new Error('Failed to fetch movies');
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (!data.d || data.d.length === 0) {
            setErrorMessage('No results found.');
            setMovieList([]);
            return;
        }

        setMovieList(data.d);
    } catch (error) {
        console.error('Error fetching movies:', error);
        setErrorMessage('Something went wrong. Please try again later.');
    } finally {
        setIsLoading(false);
    }
};

useEffect(() => {
    if (debouncedSearchTerm) {
    fetchMovies(debouncedSearchTerm);
    }
}, [debouncedSearchTerm]);

return (
    <main>
    <div className="pattern" />

    <div className="wrapper">
        <header>
        <img src="./hero.png" alt="Hero Banner" />
        <h1>
            Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
        </h1>

        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
        <h2>All Movies</h2>

        {isLoading ? (
            <Spinner />
        ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
        ) : (
            <ul>
            {movieList.map((movie) => (
                <MovieCard
                key={movie.id || movie.idIMDB || movie.l}
                movie={movie}
                />
            ))}
            </ul>
        )}
        </section>
    </div>
    </main>
);
};

export default App;
