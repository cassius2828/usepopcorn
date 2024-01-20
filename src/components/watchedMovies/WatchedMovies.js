import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT;

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const WatchedMovies = ({ watched, username, onDeleteWatched }) => {
  const [isOpen2, setIsOpen2] = useState(true);

  const avgImdbRating = average(watched?.map((movie) => movie.imdb_id_rating));
  const avgUserRating = average(watched?.map((movie) => movie.user_rating));
  const avgRuntime = average(watched?.map((movie) => movie.runtime));


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
                // user_rating={movie.user_rating}
                key={movie.imdb_id}
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

export const WatchedMovie = ({ movie, onDeleteWatched, username }) => {
  // ////////////////
  // DELETE FROM DB
  // ////////////////
  const deleteWatchedDB = async () => {
    const params = {
      imdb_id: movie.imdb_id,
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
    const data = await response.json();

  };

console.log(movie.user_rating)
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdb_id_rating}</span>
        </p>
        <p>
          <span>🌟</span>
          {/* this logic removes the 0 from ratings. The zero was originally added so the DB can properly sort user rating
          without "10" being placed as "1" due to the type being of string
          */}
          <span>{movie.user_rating < 10 ? movie.user_rating.split('').pop() : movie.user_rating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button
          onClick={() => {
            onDeleteWatched(movie.imdb_id);
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


