import React from "react";

export const SignOut = ({ handleSignOut }) => {
  return (
    <div className="sign-out">
      <span onClick={handleSignOut}>Sign Out</span>
    </div>
  );
};
