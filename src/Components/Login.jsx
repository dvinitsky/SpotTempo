import React from "react";
import { redirectUri, clientId } from "../constants/constants";

export const Login = () => {
  const handleLogin = () => {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=playlist-read-private%20playlist-modify-private%20playlist-modify-public%20user-library-read`;
  };

  return (
    <div>
      <button onClick={handleLogin} className="spotifyLogin">
        Click here to log in with Spotify
      </button>
    </div>
  );
};

export default Login;
