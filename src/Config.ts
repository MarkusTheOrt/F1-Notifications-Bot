export default {
  mongoUrl: process.env.MONGO ?? "",
  mongoDb: process.env.DBNAME ?? "",
  token: process.env.TOKEN ?? "",
  channel: process.env.CHANNEL ?? "",
  role: process.env.ROLE ?? "",
  interval: process.env.INTERVAL ? parseInt(process.env.INTERVAL) : 60,
};
