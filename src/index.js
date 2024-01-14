import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import dotenv from 'dotenv';
import { StarRating } from "./components/reusables/StarRating";
// dotenv.config();
export const Test = () => {
  const [movieRating, setMovieRating] = useState(null);
  return (
    <>
      <StarRating color="blue" maxRating={10} onSetRating={setMovieRating} />
      <p>this movie was rated {movieRating} stars</p>
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
