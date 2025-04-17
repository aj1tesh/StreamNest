import React from 'react';

const MovieCard = ({ movie }) => {
return (
    <li className="movie-card">
    <img src={movie.i?.imageUrl} alt={movie.l} />
    <h3>{movie.l}</h3>
    <p>{movie.s || 'No cast information available'}</p>
    <p>{movie.y}</p>
    </li>
);
};

export default MovieCard;
