export class SpotifyService {
  constructor(accessToken) {
    this.headers = { Authorization: `Bearer ${accessToken}` };
    this.postHeaders = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    };
  }

  getAllData = async () => {
    this.userId = await this.getUserId();
    const userPlaylists = await this.getUserPlaylists();

    const originPlaylistTracks = await this.getLikedSongs();

    this.destinationPlaylistId = await this.getPlaylistId(
      "SpotTempo Workout",
      userPlaylists
    );
    const destinationPlaylistTracks = await this.getPlaylistTracks(
      this.destinationPlaylistId
    );

    const originTrackIds = originPlaylistTracks
      .map(track => track.id)
      .join(",");
    const destinationTrackIds = destinationPlaylistTracks
      .map(track => track.id)
      .join(",");

    let originAudioFeatures = await this.getTempo(originTrackIds);
    originAudioFeatures.forEach(
      (item, index) =>
        (originPlaylistTracks[index].tempo = Math.round(item.tempo))
    );

    let destinationAudioFeatures = [];
    if (destinationTrackIds.length > 0) {
      destinationAudioFeatures = await this.getTempo(destinationTrackIds);
    }

    destinationAudioFeatures.forEach(
      (item, index) =>
        (destinationPlaylistTracks[index].tempo = Math.round(item.tempo))
    );

    return {
      originPlaylistTracks,
      destinationPlaylistTracks
    };
  };

  getUserId = async () => {
    try {
      let response = await fetch("https://api.spotify.com/v1/me", {
        headers: this.headers
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

  getUserPlaylists = async () => {
    try {
      let response = await fetch("https://api.spotify.com/v1/me/playlists", {
        headers: this.headers
      });
      if (response.ok) {
        const res = await response.json();
        return res.items;
      }
      throw new Error("Request failed!");
    } catch (error) {
      console.log(error);
    }
  };

  getLikedSongs = async () => {
    try {
      let response = await fetch("https://api.spotify.com/v1/me/tracks", {
        headers: this.headers
      });
      if (response.ok) {
        const res = await response.json();
        return res.items.map(item => item.track);
      }
      throw new Error("Request failed!");
    } catch (error) {
      console.log(error);
    }
  };

  createPlaylist = async userId => {
    try {
      let response = await fetch(
        "https://api.spotify.com/v1/users/" + userId + "/playlists",
        {
          headers: this.postHeaders,
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

  getPlaylistTracks = async playlistId => {
    try {
      let response = await fetch(
        "https://api.spotify.com/v1/users/" +
          this.userId +
          "/playlists/" +
          playlistId +
          "/tracks",
        { headers: this.headers }
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

  getTempo = async trackIds => {
    try {
      let response = await fetch(
        "https://api.spotify.com/v1/audio-features/?ids=" + trackIds,
        { headers: this.headers }
      );
      if (response.ok) {
        let res = await response.json();
        return res.audio_features;
      }
      throw new Error("Request Failed!");
    } catch (error) {
      console.log(error);
    }
  };

  addTrack = async trackId => {
    try {
      let url =
        "https://api.spotify.com/v1/users/" +
        this.userId +
        "/playlists/" +
        this.destinationPlaylistId +
        "/tracks?uris=" +
        trackId;
      let response = await fetch(url, {
        headers: this.headers,
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

  // Creates the playlist if it doesn't exist, and returns its ID.
  getPlaylistId = async (playlistName, userPlaylists) => {
    const playlist =
      userPlaylists.find(playlist => playlist.name === playlistName) || {};
    return playlist
      ? playlist.id
      : await this.createPlaylist(playlistName, this.userId);
  };
}
