export const getMatchingTracks = async (bpm, originPlaylistTracks) => {
  if (!bpm) return originPlaylistTracks;

  return originPlaylistTracks.filter(
    track => track.tempo > bpm - 10 && track.tempo < bpm + 10
  );
};
