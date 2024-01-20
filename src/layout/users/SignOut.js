import React from "react";

export const SignOut = ({ handleSignOut }) => {
  return (
    <div className="navigate-pages">
      <span className="find-friends" onClick={() => console.log()}>Find Friends</span>
      <span className="sign-out" onClick={handleSignOut}>Sign Out</span>
    </div>
  );
};
