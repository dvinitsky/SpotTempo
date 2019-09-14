import React from "react";

export const LoginArea = ({ onclick, userId }) => (
  <div>
    <button onClick={onclick} className="spotifyLogin">
      Click here to log in with Spotify
    </button>
    <div>User ID: {userId}</div>
  </div>
);
