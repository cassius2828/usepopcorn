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

  const avgImdbRating = average(watched?.map((movie) => movie.imdb_id_rating));
  const avgUserRating = average(watched?.map((movie) => movie.user_rating));

  const avgRuntime = average(watched?.map((movie) => movie.runtime));
// console.log(watched)
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

export const WatchedMovie = ({
  movie,
  onDeleteWatched,
  index,
  selectedID,
  setSelectedID,
  username,
}) => {

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
    const data = response.json();
    // console.log(data);
  };
  console.log(movie)
console.log('imdb_id_rating ' + movie.imdb_id_rating)

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
          <span>{movie.imdb_id_rating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.user_rating}</span>
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

/*
{
    "Title": "George of the Jungle",
    "Year": "1997",
    "Rated": "PG",
    "Released": "16 Jul 1997",
    "Runtime": "92 min",
    "Genre": "Action, Adventure, Comedy",
    "Director": "Sam Weisman",
    "Writer": "Jay Ward, Dana Olsen, Audrey Wells",
    "Actors": "Brendan Fraser, Leslie Mann, Thomas Haden Church",
    "Plot": "A man raised in the jungle by apes falls in love with a wealthy American heiress.",
    "Language": "English, Spanish",
    "Country": "United States",
    "Awards": "1 win & 3 nominations",
    "Poster": "https://m.media-amazon.com/images/M/MV5BNTdiM2VjYjYtZjEwNS00ZWU5LWFkZGYtZGYxMDcwMzY1OTEzL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyMTczNjQwOTY@._V1_SX300.jpg",
    "Ratings": [
        {
            "Source": "Internet Movie Database",
            "Value": "5.5/10"
        },
        {
            "Source": "Rotten Tomatoes",
            "Value": "55%"
        },
        {
            "Source": "Metacritic",
            "Value": "53/100"
        }
    ],
    "Metascore": "53",
    "imdbRating": "5.5",
    "imdbVotes": "83,389",
    "imdbID": "tt0119190",
    "Type": "movie",
    "DVD": "27 May 2016",
    "BoxOffice": "$105,263,257",
    "Production": "N/A",
    "Website": "N/A",
    "Response": "True"
}
*/