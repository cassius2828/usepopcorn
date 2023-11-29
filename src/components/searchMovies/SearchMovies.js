import React, { useState } from "react";
import { Movie } from "../watchedMovies/WatchedMovies";

export const SearchMovies = ({ movies }) => {
  // const [movies, setMovies] = useState(tempMovieData);
  const [isOpen1, setIsOpen1] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && (
        <ul className="list">
          {movies?.map((movie, index) => (
            <Movie key={movie.imdbID} index={index} movie={movie} />
          ))}
        </ul>
      )}
    </div>
  );
};
