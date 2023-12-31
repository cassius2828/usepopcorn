import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const WatchedMovies = ({
  watched,
  selectedID,
  onAddWatched,
  onDeleteWatched,
}) => {
  const [isOpen2, setIsOpen2] = useState(true);

  const avgImdbRating =
    Math.round(average(watched?.map((movie) => movie.imdbRating)) * 100) / 100;
  const avgUserRating =
    Math.round(average(watched?.map((movie) => movie.userRating)) * 100) / 100;

  const avgRuntime = average(watched?.map((movie) => movie.runtime));

  /*
    {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  */

  // const {
  //   Title: title,
  //   Year: year,
  //   Poster: poster,
  //   Runtime: runtime,
  //   imdbRating,
  //   Plot: plot,
  //   Released: released,
  //   Actors: actors,
  //   Director: director,
  //   Genre: genre,
  // } = watched;

  // const hanldeAdd = () => {
  //   const newWatchedMovie = {
  //     imdbID: selectedID,
  //     title,
  //     year,
  //     poster,
  //     imdbRating: Number(imdbRating),
  //     runtime: Number(runtime.split(" ").at(0)),
  //   };
  //   onAddWatched(newWatchedMovie);
  // };
  return (
    <>
      <button
        className="btn-toggle"
        onClick={() => setIsOpen2((open) => !open)}
      >
        {isOpen2 ? "–" : "+"}
      </button>
      {isOpen2 && (
        <>
          <div className="summary">
            <h2>Movies you watched</h2>
            <div>
              <p>
                <span>#️⃣</span>
                <span>{watched?.length} movies</span>
              </p>

              <p>
                <span>⭐️</span>
                {/* imdbRating */}

                <span>{avgImdbRating}</span>
              </p>
              <p>
                <span>🌟</span>
                {/* user rating */}
                <span>{avgUserRating}</span>
              </p>
              <p>
                <span>⏳</span>
                {/*  */}
                <span>{avgRuntime} min</span>
              </p>
            </div>
          </div>

          <ul className="list list-watched list-movies">
            {watched.map((movie, index) => (
              <WatchedMovie
                onDeleteWatched={onDeleteWatched}
                userRating={movie.userRating}
                key={movie.imdbID}
                index={index}
                movie={movie}
              />
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export const WatchedMovie = ({
  movie,
  onDeleteWatched,
  index,
  selectedID,
  setSelectedID,
}) => {
  return (
    <li
    // onClick={() =>
    //   setSelectedID(movie.imdbID === selectedID ? null : movie.imdbID)
    // }
    // id={movie.Title + index}
    >
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <FontAwesomeIcon
          onClick={() => onDeleteWatched(movie.imdbID)}
          icon={faTrash}
        />
      </div>
    </li>
  );
};
