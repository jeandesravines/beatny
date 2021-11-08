export default {
  syncMargin: Number(process.env.BN_PLAYLIST_SYNC_MARGIN) || 3,
  playingThresholdRemaining: Number(process.env.BN_PLAYLIST_THRESHOLD_REMAINING) || 10
}
