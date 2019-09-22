import React from "react";

export const Login = ({ onclick }) => (
  <div>
    <button onClick={onclick} className="spotifyLogin">
      Click here to log in with Spotify
    </button>
  </div>
);

export default Login;
