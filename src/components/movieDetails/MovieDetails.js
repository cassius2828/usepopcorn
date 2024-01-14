import React, { useEffect, useState, useRef } from "react";
import { StarRating } from "../reusables/StarRating";
import { Loader } from "../../App";
const API_KEY = process.env.REACT_APP_API_KEY;


const MovieDetails = ({
  selectedID,
  setSelectedID,
  setWatched,
  watched,
  onAddWatched,
  onCloseMovie,
}) => {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const countRef = useRef(0);

  const isWatched = watched.map((item) => item.imdbID).includes(selectedID);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  // const onCloseMovie = () => {
  //   setSelectedID(null);
  // };
  const hanldeAdd = () => {
    //      if (watched.filter((item) => item.id === selectedID)) {
    // console.log('same id')
    //     }
    const newWatchedMovie = {
      imdbID: selectedID,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };
    // this prevents user from adding same movie twice, BUT does not allow a revision of rating yet

    if (isWatched) onCloseMovie();
    else onAddWatched(newWatchedMovie);
    onCloseMovie();
  };

  // movie details fetch
  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedID}`
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

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

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
                onSetRating={setUserRating}
              />

              {userRating > 0 && (
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

/*
PROBLEM:
- separate sibling components, movieDetails sets its userRating from its child component StarRating
- Watched Movies does not have access to the same state userRating
- I need to sync these states
- How can I keep the userRating state individualistic if I lifted state?
- Why is the details from the api different for search vs id query?


*/
