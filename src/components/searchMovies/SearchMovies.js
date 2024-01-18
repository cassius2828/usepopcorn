import React, { useEffect, useState } from "react";

export const SearchMovies = ({ movies, selectedID, setSelectedID }) => {
  const [movieDetails, setMovieDetails] = useState([]);
  const [isOpen1, setIsOpen1] = useState(true);

  const { Runtime: runtime } = movieDetails;
  return (
    <>
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && (
        <ul className="list list-movies">
          {movies?.map((movie, index) => (
            <SearchedMovie
              imdb_id_rating={movie.imdbRating}
              runtime={runtime}
              // userRating={userRating}
              selectedID={selectedID}
              setSelectedID={setSelectedID}
              key={movie.imdbID}
              index={index}
              movie={movie}
            />
          ))}
        </ul>
      )}
    </>
  );
};

export const SearchedMovie = ({ movie, index, selectedID, setSelectedID }) => {
  return (
    <li
      // this event will bring up the details of the selected movie and change the
      // document title to the movie title that was clicked
      onClick={() => {
        setSelectedID(movie.imdbID === selectedID ? null : movie.imdbID);
        document.title = `Movie | ${movie.Title}`;
      }}
      id={movie.Title + index}
    >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdb_id_rating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
};
