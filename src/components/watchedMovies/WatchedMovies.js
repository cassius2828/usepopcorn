import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT;

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const WatchedMovies = ({
  watched,
  username,
  selectedID,
  onAddWatched,
  onDeleteWatched,
}) => {
  const [isOpen2, setIsOpen2] = useState(true);

  const avgImdbRating = average(watched?.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched?.map((movie) => movie.userRating));

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

                <span>{avgImdbRating.toFixed(2)}</span>
              </p>
              <p>
                <span>🌟</span>
                {/* user rating */}
                <span>{avgUserRating.toFixed(2)}</span>
              </p>
              <p>
                <span>⏳</span>
                {/*  */}
                <span>{avgRuntime.toFixed(2)} min</span>
              </p>
            </div>
          </div>

          <ul className="list list-watched list-movies">
            {watched.map((movie, index) => (
              <WatchedMovie
                username={username}
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
  username,
}) => {
  console.log(username)
  const deleteWatchedDB = async () => {
    const params = {
      imdb_id: movie.imdbID,
      username: username,
    };
    const options = {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    };
    const response = await fetch(
      `http://localhost:${SERVER_PORT}/remove_watched_movie`,
      options
    );
    const data = response.json();
    console.log(data);
  };

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

        <button
          onClick={() => {
            onDeleteWatched(movie.imdbID);
            deleteWatchedDB();
          }}
          className="btn-delete"
        >
          <FontAwesomeIcon size="xl" color="#fff" icon={faMinus} />
        </button>
      </div>
    </li>
  );
};
