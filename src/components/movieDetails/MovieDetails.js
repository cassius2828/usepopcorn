import React, { useEffect, useState, useRef } from "react";
import { StarRating } from "../reusables/StarRating";
import { Loader } from "../../App";

const SERVER_PORT = process.env.REACT_APP_SERVER_PORT;

const MovieDetails = ({
  selectedID,
  setSelectedID,
  watched,
  onAddWatched,
  onCloseMovie,
}) => {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [user_rating, setUser_Rating] = useState("");
  const countRef = useRef(0);

  const isWatched = watched.map((item) => item.imdbID).includes(selectedID);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating: imdb_id_rating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  // //////////////////////////
  // ADD MOVIE TO WATCHED LIST
  // //////////////////////////
  const hanldeAdd = () => {
    const newWatchedMovie = {
      imdb_id: selectedID,
      title,
      year,
      poster,
      imdb_id_rating: Number(imdb_id_rating),
      runtime: Number(runtime.split(" ").at(0)),
      user_rating,
      countRatingDecisions: countRef.current,
    };

    // this solves the sorting issue when a user rating of 10 was placed lower than any other digits
    // this occured bc the values are strings so it is reading the first int seen as the rating
    // ex: 9 > 1 even though what I am putting is 10
    if (newWatchedMovie.user_rating < 10) {
      newWatchedMovie.user_rating = "0" + newWatchedMovie.user_rating;
    }

    // this prevents user from adding same movie twice, BUT does not allow a revision of rating yet
    if (isWatched) onCloseMovie();
    else onAddWatched(newWatchedMovie);
    onCloseMovie();
  };

  // //////////////////
  // FETCH MOVIE DETAILS
  // //////////////////
  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        setIsLoading(true);

        const params = {
          selectedID: selectedID,
        };

        const options = {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        };

        const res = await fetch(
          `http://localhost:${SERVER_PORT}/movie_details`,
          options
        );

        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    loadMovieDetails();
  }, [selectedID]);

  // //////////////////////////////////////////////////////////////////////////////////
  // TRACK HOW MANY TIMES A USER RATED A MOVIE BEFORE ADDING IT TO THE WATCHED LIST
  // //////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (user_rating) countRef.current++;
  }, [user_rating]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {" "}
          <header>
            <button
              className="btn-back"
              onClick={() => {
                setSelectedID(null);
                document.title = "usePopcorn";
              }}
            >
              &larr;
            </button>

            <img src={poster} alt={`Poster of ${movie}`} />
            <div class="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              <StarRating
                maxRating={10}
                fontSize={25}
                starSize={30}
                starGap={25}
                onSetRating={setUser_Rating}
              />

              {user_rating > 0 && (
                <button
                  className="btn-add"
                  onClick={(movie) => hanldeAdd(movie)}
                >
                  Add to Watched List
                </button>
              )}
            </div>
            <p>
              <em>{plot} </em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director} </p>
          </section>
        </>
      )}

      {selectedID}
    </div>
  );
};

export default MovieDetails;

