import React, { useEffect, useState } from "react";



const APIKey = "368fbc88";
const test = 'dora'

export const SearchMovies = ({ movies, selectedID, setSelectedID }) => {
const [movieDetails, setMovieDetails] = useState([])
  const [isOpen1, setIsOpen1] = useState(true);
 

   useEffect(() => {
     const loadMovieDetails = async () => {
       try {
         const res = await fetch(
           `http://www.omdbapi.com/?apikey=${APIKey}&s=${test}`
         );
         const data = await res.json();
         setMovieDetails(data)
     
       
       } catch (err) {
         console.log(err);
       }
     };
     loadMovieDetails();
   }, [movies]);
  


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
 } = movieDetails;
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
            imdbRating={imdbRating}
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
      onClick={() =>
        setSelectedID(movie.imdbID === selectedID ? null : movie.imdbID)
      }
      id={movie.Title + index}
    >
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
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
      </div>
    </li>
  );
};
