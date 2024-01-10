import React, { useEffect } from "react";
import "./Access.css";
import { SignIn } from "./users/SignIn";
import { Register } from "./users/Register";

const AccessPage = ({
  route,
  onSignUp,
  onLoadUser,
  onNavigateToRegister,
  onNavigateToSignIn,
}) => {
  return (
    <div className="access-container">
      <div className="access-box">
        {route.route === "register" ? (
          <Register
            handleSignUp={onSignUp}
            handleLoadUser={onLoadUser}
            handleNavigateToSignIn={onNavigateToSignIn}
          />
        ) : (
          <SignIn handleNavigateToRegister={onNavigateToRegister} />
        )}
      </div>
    </div>
  );
};

export default AccessPage;
