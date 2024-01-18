import { useEffect, useState } from "react";
import AccessPage from "./layout/Access";
import Home from "./layout/Home";
import { SignOut } from "./layout/users/SignOut";

import {
  Navbar,
  Logo,
  SearchInput,
  ResultsNum,
  Welcome,
} from "./components/navbar/Navbar";
import { SearchMovies } from "./components/searchMovies/SearchMovies";
import { WatchedMovies } from "./components/watchedMovies/WatchedMovies";
import MovieDetails from "./components/movieDetails/MovieDetails";

import Box from "./components/reusables/Box";
import ErrorMessage from "./components/reusables/ErrorMessage";

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
          setWatched(list);
        });
      };
      fetchWatchedMovies();
    }
  }, [route.signedIn]);

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

  // ////////////////////////////
  // ADDING MOVIE TO WATCHED LIST
  // ////////////////////////////
  const handleAddWatched = (newMovie) => {
    setWatched([...watched, newMovie]);

    const addWatchedToDB = async () => {
      const params = {
        username: user.username,
        imdb_id: newMovie.imdb_id,
        imdb_id_rating: newMovie.imdb_rating,
        poster: newMovie.poster,
        runtime: newMovie.runtime,
        title: newMovie.title,
        user_rating: newMovie.user_rating,
        year: newMovie.year,
        time_added: new Date(),
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

  // ////////////////////////////
  // DELETE MOVIE FROM WATCHED LIST
  // ////////////////////////////
  const handleDeleteWatched = (id) => {
    setWatched((watched) => watched.filter((movie) => movie.imdb_id !== id));
  };
  // ////////////////////////////
  // CLOSE MOVIE (UI)
  // ////////////////////////////
  const onCloseMovie = () => {
    setSelectedID(null);
  };

  return (
    <>
    {/* //* Routing Logic */}
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
              {/* //* error and loading handling logic */}
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
