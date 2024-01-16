import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export const Navbar = ({ children }) => {
  return <nav className="nav-bar">{children}</nav>;
};

export const SearchInput = ({ query, setQuery }) => {
  const inputEl = useRef(null);
  useEffect(() => {
    const callback = (e) => {
      if (document.activeElement === inputEl.current) return;
      if (e.code === "Enter") {
        inputEl.current.focus();
        setQuery("");
      }
    };
    document.addEventListener("keydown", callback);
    return () => document.removeEventListener("keydown", callback);
  }, [setQuery]);
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
        }}
        ref={inputEl}
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

export const Welcome = ({ username }) => {
  return <div className="nav--welcome-user">{`Welcome ${username} :) `}</div>;
};
