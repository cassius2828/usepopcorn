import { useEffect, useState } from "react";
const SERVER_PORT = process.env.REACT_APP_SERVER_PORT;

export const useSearchMovies = (query, func1) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
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
          `http://localhost:${SERVER_PORT}/search_movies`,
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
    // func1 is the closeMovie function
    func1?.();
    fetchData();

    return () => controller.abort();
  }, [query, func1]);
  return { movies, error, isLoading };
};
