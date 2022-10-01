export default {
  dateFormat: "YYYY-MM-DDThh:mm:ssZ",
  dateMatch:
    /^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T(0[1-9]|1[0-9]|2[0-3]):(0[0-9]|[0-5][0-9]):(0[0-9]|[0-5][0-9])Z$/,
  maxTimeApart: 100 * 1000, // 100 Seconds
  defTimeApart: 100_000_000_000, // Default time Apart
  futureProjection: 3 * 60 * 1000, // 5 Minutes
  attachments: [
    { name: "Bongocat.mp4", url: "https://fia.ort.dev/F1themecats.mp4" },
  ],
  checkInterval: 60 * 1000,
};
