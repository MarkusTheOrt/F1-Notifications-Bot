# 📣 F1 Notifications Bot

This is a Discord Bot that posts a message once a new F1 Session is about to start.

> Please Note that this bot right now only works for single servers.
> Multi Server functionality will come at some point in the Future.
>
> [Probably never, lets be honest.]

## Configuration

### ⚙️ Config File

Edit the file at `src/Config.ts`

```ts
export default {
  mongoUrl: process.env.MONGO ?? "YOUR DATABASE URL",
  mongoDb: process.env.DBNAME ?? "YOUR DATABASE NAME",
  token: process.env.TOKEN ?? "YOUR DISCORD BOT TOKEN",
  channel: process.env.CHANNEL ?? "YOUR CHANNEL ID",
  guild: process.env.GUILD ?? "YOUR GUILD ID",
  role: process.env.ROLE ?? "YOUR ROLE ID",
  interval: process.env.INTERVAL ? parseInt(process.env.INTERVAL) : 60,
};
```

### 🗃️ Database

The Database uses only three collections - `Weekends`, `Messages`, and `Settings`

Some Example Data:

```jsonc
// Weekend Data
{
"_id": {
  "$oid": "62e193bbf554f9ab42132922"
},
"name": "Hungarian Grand Prix",
"year": 2022,
"prefix": ":flag_hu:", // Will be prepend to the name
"start": "2022-07-29T12:00:00Z",
"sessions": [
    {
      "type": "FP1",
      "start": "2022-07-29T12:00:00Z",
      "notified": true
    },
    {
      "type": "FP2",
      "start": "2022-07-29T15:00:00Z",
      "notified": true
    },
    {
      "type": "FP3",
      "start": "2022-07-30T11:00:00Z",
      "notified": true
    },
    {
      "type": "Qualifying",
      "start": "2022-07-30T14:00:00Z",
      "notified": true
    },
    {
      "type": "Race",
      "start": "2022-07-31T13:00:00Z"
    }
  ]
}

// Message Data
{
  "_id": {
    "$oid": "62e414323abd8ad9e8b09056"
  },
  "weekend": {
    "$oid": "62e193bbf554f9ab42132922"
  },
  "session": 3,
  "messageId": "1003028462627471451",
  "date": "2022-07-30T15:00:00Z"
}

// Example Settings (its just a simple key/value store)
{
  "_id": {
    "$oid": "62e58d0cc481e258001d3c61"
  },
  "name": "infoMessage",
  "value": "1003028462627471451"
}
```

All dates are in `UTC` - `Universal Coordinated Time`.

## 🐳Docker

This Source code has a Dockerfile and can be built as a Docker Image.

### ⚙️ Configuration

All Keys in the Config file are also exchangeable using Environment Variables / Files.

Heres how an .env file might look like

```conf
MONGO=MONGODB_URL
DBNAME=MONGODB_NAME
TOKEN=YOUR_DISCORD_BOT_TOKEN
CHANNEL=DISCORD_CHANNEL_ID
ROLE=DISCORD_ROLE_ID
```
