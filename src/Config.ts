export default {
  mongoUrl: process.env.MONGO ?? "mongodb://127.0.0.1/",
  mongoDb: process.env.DBNAME ?? "f1-notif-bot",
  token: process.env.TOKEN ?? "",
  channel: process.env.CHANNEL ?? "883847531631611936",
  role: process.env.ROLE ?? "942179808136298516",
  //guild: process.env.GUILD ?? "177387572505346048",
  guild: "883847530687913995",
  interval: process.env.INTERVAL ? parseInt(process.env.INTERVAL) : 60,
};
