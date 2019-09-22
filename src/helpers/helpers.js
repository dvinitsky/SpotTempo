export const getMatchingTracks = async (bpm, originPlaylistTracks) => {
  if (!bpm) return originPlaylistTracks;

  return originPlaylistTracks.filter(
    track => track.tempo > bpm - 10 && track.tempo < bpm + 10
  );
};

export const getAccessTokenAndExpirationSeconds = () => {
  if (
    window.location.href.match(/access_token=([^&]*)/) !== null &&
    window.location.href.match(/expires_in=([^&]*)/) !== null
  ) {
    return {
      accessToken: window.location.href
        .split("access_token=")[1]
        .split("&token_type")[0],
      expirationSeconds: window.location.href.split("expires_in=")[1]
    };
  }
  return {};
};
