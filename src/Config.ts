export default {
  mongoUrl: process.env.MONGO ?? "mongodb://127.0.0.1/f1-notif-bot",
  mongoDb: process.env.DBNAME ?? "f1-notif-bot",
  token:
    process.env.TOKEN ??
    "OTE5ODgxNzE3MjE5NzQxNzE3.Gcudmc.f5YG70iBi-M35AWFN5OwJZN856djSe8QhgdGOc",
  channel: process.env.CHANNEL ?? "1002285400095719524", //"906261020119531560",
  role: process.env.ROLE ?? "1003385965492056226",
  f2role: process.env.ROLE ?? "",
  f3role: process.env.ROLE ?? "",
  guild: process.env.GUILD ?? "883847530687913995", //"177387572505346048",
  interval: process.env.INTERVAL ? parseInt(process.env.INTERVAL) : 60,
};
