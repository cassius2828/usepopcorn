import React, { useEffect, useState } from "react";
const PORT = process.env.REACT_APP_PORT;

export const Register = ({
  handleNavigateToSignIn,
  handleSetRoute,
  route,
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
    fetch(
      // `http://localhost:3001/register`,
      `http://localhost:${PORT}/register`,
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          email: user.email,
          password: password,
        }),
      }
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
