import { useEffect, useState } from "react";
import {
  Navbar,
  Logo,
  SearchInput,
  ResultsNum,
  Welcome,
} from "./components/navbar/Navbar";
import { SearchMovies } from "./components/searchMovies/SearchMovies";
import { WatchedMovies } from "./components/watchedMovies/WatchedMovies";
import Box from "./components/reusables/Box";
import ErrorMessage from "./components/reusables/ErrorMessage";
import MovieDetails from "./components/movieDetails/MovieDetails";
import AccessPage from "./layout/Access";
import Home from "./layout/Home";
import { SignIn } from "./layout/users/SignIn";
import { Register } from "./layout/users/Register";
import { SignOut } from "./layout/users/SignOut";

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

const initialRouteState = {
  route: "signedout",
  signedIn: false,
};

const SERVER_PORT = process.env.REACT_APP_SERVER_PORT;

export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedID, setSelectedID] = useState(null);
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
    joined: "",
  });
  const [route, setRoute] = useState(initialRouteState);
  // test
  const [userRating, setUserRating] = useState(null);
  console.log(watched);

  // //////////////////////
  // backend actions
  // //////////////////////

  const signIn = () => {
    if (route.route === "signedout")
      return setRoute({
        route: "home",
        signedIn: true,
      });
    else if (route.route === "register")
      return setRoute({
        route: "signedout",
        signedIn: false,
      });
  };

  const loadUser = (data) => {
    setUser({
      id: data.id,
      username: data.username,
      email: data.email,
      joined: data.joined,
    });
  };

  const signUp = (password, confirmPassword, username, email) => {
    let emailValidation = /(?=.*@)(?=.*\.)/;
    if (
      password !== confirmPassword ||
      !username ||
      emailValidation.test(email) === false
    ) {
      return;
    }
    if (route.route === "register") {
      return setRoute({ route: "home", signedIn: true });
    }
  };

  const signOut = () => {
    setRoute(initialRouteState);
  };

  const navigateToRegister = () => {
    setRoute({ ...route, route: "register" });
  };
  const navigateToSignIn = () => {
    setRoute({ ...route, route: "signedout" });
  };

  // //////////////////////
  // backend actions
  // //////////////////////

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

  // ////////////////////////////
  // RETRIEVE WATCHED DATA
  // ////////////////////////////
  useEffect(() => {
    if (route.signedIn) {
      const fetchWatchedMovies = async () => {
        const params = {
          username: user.username,
        };
        const options = {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        };
        const response = await fetch(
          `http://localhost:${SERVER_PORT}/display_watched_movies`,
          options
        );
        const data = response.json();
        data.then((list) => {
          console.log(list)
        })
        // setWatched([...watched, data])
      };
      fetchWatchedMovies();
    }
  }, [watched]);

  // ////////////////////////////
  // SEARCHING DATA
  // ////////////////////////////
  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");
        const params = {
          signal: controller.signal,
          query: query,
        };

        const options = {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(params),
        };

        const res = await fetch(
          `http://localhost:3000/search_movies`,
          // `http://localhost:${process.env.PORT}/search_movies`,
          options
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
  
    const addWatchedToDB = async () => {
      const params = {
        imdb_id: newMovie.imdbID,
        title: newMovie.title,
        user_rating: newMovie.userRating,
        username: user.username,
      };
      const options = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      };

      const response = await fetch(
        `http://localhost:${SERVER_PORT}/add_watched_movie`,
        options
      );
      const data = await response.json();
      // console.log(data);
    };
    addWatchedToDB();
  };

  const handleDeleteWatched = (id) => {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  };

  const onCloseMovie = () => {
    setSelectedID(null);
  };

  return (
    <>
      {route.route === "home" ? (
        <>
          <Home>
            {" "}
            <Navbar movies={movies}>
              <Logo setQuery={setQuery} setSelectedID={setSelectedID} />
              <SearchInput query={query} setQuery={setQuery} />
              <div className="nav--results_signout__container">
                <ResultsNum movies={movies} />
                <SignOut handleSignOut={signOut} />
              </div>
              <Welcome username={user.username} />
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
                    <WatchedMovies username={user.username} watched={watched} />
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
                    <WatchedMovies username={user.username} watched={watched} />
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
                        username={user.username}
                      />
                    </Box>
                  )}
                </>
              )}
            </Main>
          </Home>
        </>
      ) : (
        <AccessPage
          onNavigateToSignIn={navigateToSignIn}
          onNavigateToRegister={navigateToRegister}
          route={route}
          onSignUp={signUp}
          onSignIn={signIn}
          onLoadUser={loadUser}
        ></AccessPage>
      )}
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
