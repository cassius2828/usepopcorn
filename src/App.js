import { useEffect, useState } from "react";
import {
  Navbar,
  Logo,
  SearchInput,
  ResultsNum,
} from "./components/navbar/Navbar";
import { SearchMovies } from "./components/searchMovies/SearchMovies";
import { WatchedMovies } from "./components/watchedMovies/WatchedMovies";
import Box from "./components/reusables/Box";
import ErrorMessage from "./components/reusables/ErrorMessage";
import MovieDetails from "./components/movieDetails/MovieDetails";

const APIKey = "368fbc88";
// const query = "fgsadf";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
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
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedID, setSelectedID] = useState(null);
  // test
  const [userRating, setUserRating] = useState(null);

  // useEffect(() => {
  //   fetch(BASE_URL)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setMovies(data);
  //       console.log(data);
  //     });
  //     return () => console.log('cleanup function');
  // }, []);

  // ////////////////////////////
   // ESCAPE KEY EFFECT
  // ////////////////////////////
  useEffect(() => {
    const callback = (e) => {
      if (e.code === "Escape") {
        onCloseMovie();
      }
    };
    document.addEventListener("keydown", callback);
    return () => document.removeEventListener("keydown", callback);
  }, []);

  
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${APIKey}&s=${query}`,
          { signal: controller.signal }
        );
        if (!res.ok)
          throw new Error("Something went wrong with fetching movies");

        const data = await res.json();
        if (data.Response === "False") throw new Error("Movie not found");
        setMovies(data.Search);
        setIsLoading(false);
      } catch (err) {
        if (err.name !== "Abort Error") setError(err.message);
      }
    };
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    onCloseMovie();
    fetchData();
    return () => controller.abort();
  }, [query]);

  const handleAddWatched = (newMovie) => {
    setWatched([...watched, newMovie]);
  };

  const handleDeleteWatched = (id) => {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  };

  const onCloseMovie = () => {
    setSelectedID(null);
  };
  return (
    <>
      <Navbar movies={movies}>
        <Logo setQuery={setQuery} setSelectedID={setSelectedID} />
        <SearchInput query={query} setQuery={setQuery} />
        <ResultsNum movies={movies} />
      </Navbar>
      <Main movies={movies}>
        {/* error and loading handling logic */}
        {error ? (
          <>
            {" "}
            <Box>
              <ErrorMessage message={error} />
            </Box>
            <Box>
              {" "}
              <WatchedMovies watched={watched} />
            </Box>
          </>
        ) : isLoading ? (
          <>
            {" "}
            <Box>
              {" "}
              <Loader />
            </Box>
            <Box>
              {" "}
              <WatchedMovies watched={watched} />
            </Box>
          </>
        ) : (
          <>
            {" "}
            <Box>
              {" "}
              <SearchMovies
                selectedID={selectedID}
                setSelectedID={setSelectedID}
                movies={movies}
              />
            </Box>
            {selectedID ? (
              <Box>
                {" "}
                <MovieDetails
                  selectedID={selectedID}
                  setSelectedID={setSelectedID}
                  watched={watched}
                  setWatched={setWatched}
                  onAddWatched={handleAddWatched}
                  onDeleteWatched={handleDeleteWatched}
                  onCloseMovie={onCloseMovie}
                />
              </Box>
            ) : (
              <Box>
                {" "}
                {/* //! */}
                <WatchedMovies
                  selectedID={selectedID}
                  onAddWatched={handleAddWatched}
                  onDeleteWatched={handleDeleteWatched}
                  watched={watched}
                />
              </Box>
            )}
          </>
        )}
      </Main>
    </>
  );
}

export const Main = ({ children }) => {
  return <main className="main"> {children}</main>;
};

export const Loader = () => {
  return (
    <>
      <span className="loader">loading...</span>
    </>
  );
};
