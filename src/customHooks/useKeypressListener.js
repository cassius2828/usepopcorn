import { useEffect } from "react";

export const useKeypressListener = (key, action) => {
  // ////////////////////////////
  // ESCAPE KEY EFFECT
  // ////////////////////////////
  useEffect(() => {
    const callback = (e) => {
      if (e.code.toLowerCase() === key.toLowerCase()) {
        action?.();
      }
    };
    document.addEventListener("keydown", callback);
    return () => document.removeEventListener("keydown", callback);
  }, [key, action]);
};
