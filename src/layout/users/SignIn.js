import React, { useState } from "react";
import { config } from "../../config";
const BASE_URL = config.url;
// const SERVER_PORT = process.env.REACT_APP_SERVER_PORT;

export const SignIn = ({
  handleNavigateToRegister,
  handleSignIn,
  loginMethod,
  handleLoadUser,
}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitSignIn = () => {
    fetch(
      // `http://localhost:3001/signin`,
      `${BASE_URL}/signin`,
      {
        method: "post",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
          username: username,
        }),
      }
    )
      .then((res) => res.json())
      .then((user) => {
        if (user.id) {
          handleLoadUser(user);
          handleSignIn();
        }
      })
      .catch((err) => console.log("wrong credentials entered (front end)"));
  };

  return (
    <div className="sign-in--container">
      {loginMethod === "username" ? (
        <input
          onChange={(e) => setUsername(e.target.value)}
          value={username}
          placeholder="username"
          type="text"
        />
      ) : (
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="email"
          type="text"
        />
      )}

      <input
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        placeholder="password"
        type="password"
      />
      <button onClick={onSubmitSignIn}>Sign In</button>
      <p className="route-link" onClick={handleNavigateToRegister}>
        register
      </p>
    </div>
  );
};
