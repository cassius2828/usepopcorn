import React, { useEffect, useState } from "react";

const PORT = process.env.REACT_APP_PORT;

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
      `http://localhost:${PORT}/signin`,
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
          console.log(user);
        }
      })
      .catch((err) => console.log("wrong credentials entered"));
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
