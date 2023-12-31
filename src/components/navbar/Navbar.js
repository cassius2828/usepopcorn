import React, {useState} from "react";
import './Navbar.css';
export const Navbar = ({children}) => {

    // const [query, setQuery] = useState("");
    // const [movies, setMovies] = useState(tempMovieData);
  return (
    <nav className="nav-bar">
     {children}
    </nav>
  );
};

export const SearchInput = ({ query, setQuery }) => {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        // I used to wonder why I could never get the query to log the current value
        // but this is bc the state change won't be shown until after the event finishees
        // same reason for why you must have count => count + 2 to change the state instead of
        // setCount(count + 1)
        // setCount(count + 1)
      
      } }
    />
  );
};

export const Logo = () => {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
};

export const ResultsNum = ({ movies }) => {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
};
