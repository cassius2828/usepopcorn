import React, { useState } from "react";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
export const Navbar = ({ children }) => {
  // const [query, setQuery] = useState("");
  // const [movies, setMovies] = useState(tempMovieData);
  return <nav className="nav-bar">{children}</nav>;
};

export const SearchInput = ({ query, setQuery }) => {
  return (
    <div className="search-container">
      {" "}
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
        }}
      />{" "}
      <FontAwesomeIcon
        onClick={() => {
          setQuery("");
        }}
        className="icon icon-clear"
        size="2x"
        icon={faCircleXmark}
      />
    </div>
  );
};

export const Logo = ({ setSelectedID, setQuery }) => {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1
        style={{ cursor: "pointer" }}
        onClick={() => {
          setSelectedID(null);
          setQuery("");
          document.title = "usePopcorn";
        }}
      >
        usePopcorn
      </h1>
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
