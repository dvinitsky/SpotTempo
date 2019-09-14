import { clientId, redirectUri } from "../constants/constants";

let accessToken;

export const randomState = length => {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export const getRequestURL =
  "https://accounts.spotify.com/authorize?client_id=" +
  clientId +
  "&response_type=token&redirect_uri=" +
  redirectUri +
  "&scope=playlist-read-private%20playlist-modify-private%20playlist-modify-public&state=" +
  randomState(10);

export const setAccessToken = async () => {
  if (typeof accessToken !== "undefined") {
    return accessToken;
  } else if (
    window.location.href.match(/access_token=([^&]*)/) !== null &&
    window.location.href.match(/expires_in=([^&]*)/) !== null
  ) {
    accessToken = window.location.href
      .split("access_token=")[1]
      .split("&token_type")[0];

    let expirationTime = 3600;

    //from Jammin instructions
    window.setTimeout(() => (accessToken = ""), expirationTime * 1000);
    window.history.pushState("Access Token", null, "/");
    //
  } else {
    window.location = getRequestURL;
  }
};

export const getUserId = async () => {
  try {
    let response = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: "Bearer " + accessToken }
    });
    if (response.ok) {
      let user = await response.json();
      return user.id;
    }
    throw new Error("Request failed!");
  } catch (error) {
    console.log(error);
  }
};

export const getUserPlaylists = async () => {
  try {
    let response = await fetch("https://api.spotify.com/v1/me/playlists", {
      headers: { Authorization: "Bearer " + accessToken }
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error("Request failed!");
  } catch (error) {
    console.log(error);
  }
};

export const createPlaylist = async userId => {
  try {
    let response = await fetch(
      "https://api.spotify.com/v1/users/" + userId + "/playlists",
      {
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          name: "SpotTempo Workout"
        })
      }
    );

    if (response.ok) {
      let playlist = await response.json();
      return playlist.id;
    }
    throw new Error("Request failed!");
  } catch (error) {
    console.log(error);
  }
};

export const getPlaylistTracks = async (userId, playlistId) => {
  try {
    let response = await fetch(
      "https://api.spotify.com/v1/users/" +
        userId +
        "/playlists/" +
        playlistId +
        "/tracks",
      { headers: { Authorization: "Bearer " + accessToken } }
    );
    if (response.ok) {
      let playlist = await response.json();
      return playlist.items.map(item => item.track);
    }
    throw new Error("Request failed!");
  } catch (error) {
    console.log(error);
  }
};

export const getTempo = async trackIds => {
  try {
    let response = await fetch(
      "https://api.spotify.com/v1/audio-features/?ids=" + trackIds,
      { headers: { Authorization: "Bearer " + accessToken } }
    );
    if (response.ok) {
      let res = await response.json();
      return res;
    }
    throw new Error("Request Failed!");
  } catch (error) {
    console.log(error);
  }
};
export const addTrack = async (userId, destinationId, trackId) => {
  try {
    let url =
      "https://api.spotify.com/v1/users/" +
      userId +
      "/playlists/" +
      destinationId +
      "/tracks?uris=" +
      trackId;
    console.log(url);
    let response = await fetch(url, {
      headers: { Authorization: "Bearer " + accessToken },
      method: "POST"
    });
    if (response.ok) {
      let res = await response.json();
      return res;
    }
    throw new Error("Request Failed!");
  } catch (error) {
    console.log(error);
  }
};
