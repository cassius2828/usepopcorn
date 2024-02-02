import React, { useState } from "react";
import { config } from "../../config";
const BASE_URL = config.url;
// const SERVER_PORT = process.env.REACT_APP_SERVER_PORT;

export const Register = ({
  handleNavigateToSignIn,
  handleLoadUser,
  handleSignUp,
}) => {
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
    joined: "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmitRegister = () => {
    
    const params = {
      username: user.username,
      email: user.email,
      password: password,
    };
    const options = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    };

    fetch(
      // `http://localhost:3001/register`,
      `${BASE_URL}/register`,
      options
    )
      .then((res) => res.json())
      .then((user) => {
        if (user.id) {
          handleLoadUser(user);
          handleSignUp(password, confirmPassword, user.username, user.email);
        }
      });
  };

  return (
    <div className="sign-in--container">
      <input
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        placeholder="username"
        type="name"
      />
      <input
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="email"
        type="email"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        type="password"
      />
      <input
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="confirm password"
        type="password"
      />
      <button
        onClick={() => {
          onSubmitRegister();
        }}
      >
        Register
      </button>
      <p className="route-link" onClick={handleNavigateToSignIn}>
        {" "}
        sign in{" "}
      </p>
    </div>
  );
};
