import React, { useState, useEffect } from "react";
import { getAccessTokenAndExpirationSeconds } from "../helpers/helpers";
import Login from "./Login";
import Search from "./Search";

const App = () => {
  const [accessToken, setAccessToken] = useState();

  useEffect(() => {
    const {
      accessToken: at = "",
      expirationSeconds = 0
    } = getAccessTokenAndExpirationSeconds();

    if (at) {
      setAccessToken(at);
      window.setTimeout(() => setAccessToken(), expirationSeconds * 1000);
    }
  }, [setAccessToken]);

  return accessToken ? <Search accessToken={accessToken} /> : <Login />;
};
export default App;
