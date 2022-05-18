# 📣 F1 Notifications Bot

This is a Discord Bot that posts a message once a new F1 Session is about to start.
![Message Example](https://static.ort.dev/pub/Discord_pJbOPBQOWJ.png)

> Please Note that this bot right now only works for single servers.
> Multi Server functionality will come at some point in the Future.

## Configuration

### ⚙️ Config File

Edit the file at `src/Config.ts`

```ts
export default {
  mongoUrl: process.env.MONGO ?? "YOUR DATABASE URL",
  mongoDb: process.env.DBNAME ?? "YOUR DATABASE NAME",
  token: process.env.TOKEN ??"YOUR DISCORD BOT TOKEN",
  channel: process.env.CHANNEL ?? "YOUR CHANNEL ID",
  role: process.env.ROLE ?? "YOUR ROLE ID",
  interval: process.env.INTERVAL ? parseInt(process.env.INTERVAL) : 60
};
```

### 🗃️ Database

The Database uses only one collection it is called `races`, it's schema is the following

```json
{
  "name": ":flag_bh: Bahrain Grand Prix",
  "type": "FP1",
  "date": "2022-03-18T12:00:00Z",
  "year": 2022
}
```

All dates are in `UTC` - `Universal Coordinated Time`.

## 🐳Docker

This Source code has a Dockerfile and can be built as a Docker Image.

### ⚙️ Configuration

All Keys in the Config file are also exchangeable using Environment Variables / Files.

Heres how an .env file might look like

```dotenv
MONGO=MONGODB_URL
DBNAME=MONGODB_NAME
TOKEN=YOUR_DISCORD_BOT_TOKEN
CHANNEL=DISCORD_CHANNEL_ID
ROLE=DISCORD_ROLE_ID
```
