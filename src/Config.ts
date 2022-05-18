export default {
  mongoUrl: process.env.MONGO ?? "",
  mongoDb: process.env.DBNAME ?? "",
  token: process.env.TOKEN ?? "",
  channel: process.env.CHANNEL ?? "",
  role: process.env.ROLE ?? "",
  guild: process.env.GUILD ?? "177387572505346048",
  interval: process.env.INTERVAL ? parseInt(process.env.INTERVAL) : 60,
};
