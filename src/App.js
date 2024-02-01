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

import { useSearchMovies } from "./customHooks/useSearchMovies";
import { useKeypressListener } from "./customHooks/useKeypressListener";

const initialRouteState = {
  route: "signedout",
  signedIn: false,
};

const SERVER_PORT = process.env.REACT_APP_SERVER_PORT;

export default function App() {
  const [query, setQuery] = useState("");
  const [watched, setWatched] = useState([]);

  const [selectedID, setSelectedID] = useState(null);
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
    joined: "",
  });
  const [route, setRoute] = useState(initialRouteState);
  // ////////////////////////////
  // SEARCH MOVIES: CUSTOM HOOK
  // ////////////////////////////
  const { movies, error, isLoading } = useSearchMovies(query, onCloseMovie);

  // //////////////////////
  // ? backend actions
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
    setQuery("");
  };

  const navigateToRegister = () => {
    setRoute({ ...route, route: "register" });
  };
  const navigateToSignIn = () => {
    setRoute({ ...route, route: "signedout" });
  };

  // //////////////////////
  // ? backend actions
  // //////////////////////

  // ////////////////////////////
  // ESCAPE KEY EFFECT: CUSTOM HOOK
  // ////////////////////////////
  useKeypressListener("Escape", onCloseMovie);

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
        // missing await key word, but fetching still works?
        // seems like it still works bc of promise after
        const data = response.json();
        data.then((list) => {
          setWatched(list);
        });
      };
      fetchWatchedMovies();
    }
  }, [route.signedIn, user.username]);

  // ////////////////////////////
  // CLOSE MOVIE (UI)
  // * Changed this to regular func delcaration bc then you can call the
  // * custom hook BEFORE the arg func is delcared. This allows me to organize my code better
  // ////////////////////////////
  function onCloseMovie() {
    setSelectedID(null);
  }

  // ////////////////////////////
  // ADDING MOVIE TO WATCHED LIST
  // ////////////////////////////
  const handleAddWatched = (newMovie) => {
    setWatched([...watched, newMovie]);

    const addWatchedToDB = async () => {
      const params = {
        username: user.username,
        imdb_id: newMovie.imdb_id,
        imdb_id_rating: newMovie.imdb_id_rating,
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
      console.log(data)
    };
    addWatchedToDB();
  };

  // ////////////////////////////
  // DELETE MOVIE FROM WATCHED LIST
  // ////////////////////////////
  const handleDeleteWatched = (id) => {
    setWatched((watched) => watched.filter((movie) => movie.imdb_id !== id));
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
                    <SortBy setWatched={setWatched} username={user.username} />
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
                    <SortBy setWatched={setWatched} username={user.username} />
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
                    <>
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
                      <SortBy
                        setWatched={setWatched}
                        username={user.username}
                      />
                    </>
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

const SortBy = ({ username, setWatched }) => {
  const [sortBy, setSortBy] = useState("oldest added");
  const sortList = [
    "oldest added",
    "newest added",
    "A - Z",
    "Z - A",
    "user rating",
    "IMDB Rating",
  ];
  let url = `http://localhost:${SERVER_PORT}/sort_watched_movies`;

  const sortWatchedMovies = () => {
    const params = {
      sortBy: sortBy,
      username: username,
    };
    const options = {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((data) => setWatched(data));
  };
  useEffect(() => {
    sortWatchedMovies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

  return (
    <div className="sort-container">
      <select
        defaultValue={"oldest added"}
        onChange={(e) => {
          setSortBy(e.target.value);
        }}
        className="sort-list"
      >
        {sortList.map((item, i) => {
          return (
            <option value={item} className="sort-item" key={"list item #" + i}>
              {item}
            </option>
          );
        })}
      </select>
    </div>
  );
};
