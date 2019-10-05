export const getMatchingTracks = (bpm, originPlaylistTracks) => {
  if (!bpm) return originPlaylistTracks;

  console.log("bpm is", bpm);

  const mathcingTracks = originPlaylistTracks.filter(track => {
    console.log(track.name, "has a tempo of", track.tempo);
    return track.tempo > bpm - 10 && track.tempo < bpm + 10;
  });

  console.log(mathcingTracks);
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
