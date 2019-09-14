import {
  setAccessToken,
  getUserId,
  getUserPlaylists,
  createPlaylist,
  getTempo,
  getPlaylistTracks
} from "./spotify";

// Creates the playlist if it doesn't exist, and returns its ID.
const getPlaylistId = async (playlistName, userId, userPlaylists) => {
  const playlist =
    userPlaylists.find(playlist => playlist.name === playlistName) || {};
  return playlist ? playlist.id : await createPlaylist(playlistName, userId);
};

export const login = async () => {
  await setAccessToken();
  const userId = await getUserId();
  const userPlaylists = await getUserPlaylists();

  const originPlaylistId = await getPlaylistId(
    "SpotTempo",
    userId,
    userPlaylists
  );
  const destinationPlaylistId = await getPlaylistId(
    "SpotTempo Workout",
    userId,
    userPlaylists
  );

  const originPlaylistTracks = await getPlaylistTracks(
    userId,
    originPlaylistId
  );

  const trackIds = originPlaylistTracks.map(track => track.id).join(",");

  let audioFeatures = await getTempo(trackIds);
  audioFeatures.forEach(
    item => (originPlaylistTracks.tempo = Math.round(item.tempo))
  );

  let destinationPlaylistTracks = await getPlaylistTracks(
    userId,
    destinationPlaylistId
  );

  return {
    originPlaylistTracks,
    destinationPlaylistId,
    destinationPlaylistTracks,
    userId,
    originPlaylistId
  };
};
