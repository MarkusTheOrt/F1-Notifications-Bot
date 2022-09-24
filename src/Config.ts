export default {
  mongoUrl: process.env.MONGO ?? "mongodb://127.0.0.1/f1-notif-bot",
  mongoDb: process.env.DBNAME ?? "f1-notif-bot",
  token:
    process.env.TOKEN ??
    "OTE5ODgxNzE3MjE5NzQxNzE3.GBVlod.7Lhk7nRwGFqWhq7ZHiHSsRcCzACi31shxDN9ZI",
  channel: process.env.CHANNEL ?? "1002285400095719524",
  role: process.env.ROLE ?? "1023176632598528032",
  f2role: process.env.ROLE ?? "",
  f3role: process.env.ROLE ?? "",
  guild: process.env.GUILD ?? "883847530687913995",
  interval: process.env.INTERVAL ? parseInt(process.env.INTERVAL) : 60,
};
