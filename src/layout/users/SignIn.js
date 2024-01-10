import React, { useEffect, useState } from "react";

export const SignIn = ({ handleNavigateToRegister, handleSetRoute, route }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="sign-in-container">
      <input
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        placeholder="username"
        type="text"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        placeholder="password"
        type="text"
      />
      <button onClick={() => handleSetRoute({ ...route, route: "home" })}>
        Sign In
      </button>
      <p className="route-link" onClick={handleNavigateToRegister}>
        register
      </p>
    </div>
  );
};
