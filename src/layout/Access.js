import React, { useEffect, useState } from "react";
import "./Access.css";
import { SignIn } from "./users/SignIn";
import { Register } from "./users/Register";

const AccessPage = ({
  route,
  onSignUp,
  onSignIn,
  onLoadUser,
  onNavigateToRegister,
  onNavigateToSignIn,
}) => {
  const [loginMethod, setLoginMethod] = useState("username");
  return (
    <div className="access-container">
      {route.route === "register" ? (
        <div className="access-box">
          {" "}
          <Register
            handleSignUp={onSignUp}
            handleLoadUser={onLoadUser}
            handleNavigateToSignIn={onNavigateToSignIn}
          />
        </div>
      ) : (
        <>
          <LoginMethod setLoginMethod={setLoginMethod} />
          <div className="access-box">
            {" "}
            <SignIn
              loginMethod={loginMethod}
              handleNavigateToRegister={onNavigateToRegister}
              handleSignIn={onSignIn}
              handleLoadUser={onLoadUser}
            />
          </div>
        </>
      )}
    </div>
  );
};

export const LoginMethod = ({ setLoginMethod }) => {
  return (
    <div className="login-method--container">
      <div className="login-method--option login-method--option__username">
        <span onClick={() => setLoginMethod("username")}>
          sign in with username
        </span>
      </div>
      <hr />
      <div className="login-method--option login-method--option__username">
        <span onClick={() => setLoginMethod("email")}>
          sign in with email
        </span>
      </div>
    </div>
  );
};

export default AccessPage;
