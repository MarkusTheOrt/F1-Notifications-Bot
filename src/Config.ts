export default {
  mongoUrl: process.env.MONGO ?? "mongodb://127.0.0.1/f1-notif-bot",
  mongoDb: process.env.DBNAME ?? "f1-notif-bot",
  token: process.env.TOKEN ?? "",
  channel: process.env.CHANNEL ?? "",
  permChannel: process.env.PCHANNEL ?? "",
  role: process.env.ROLE ?? "",
  f2role: process.env.ROLE ?? "",
  f3role: process.env.ROLE ?? "",
  guild: process.env.GUILD ?? "",
  interval: process.env.INTERVAL ? parseInt(process.env.INTERVAL) : 60,
};
