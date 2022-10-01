import { ActivityType } from "discord.js";
import Config from "./Config.js";
import Client from "./utils/Client.js";
import Database from "./utils/Database.js";
import Deleter from "./utils/Deleter.js";
import PersistentMessage from "./utils/PersistentMessage.js";
import Watcher from "./utils/Watcher.js";

Client.on("ready", () => {
  console.log("Bot is connected as " + Client.user?.tag ?? "Bot error?!");
  // Make sure the Channels we post in are cached!
  Client.channels.fetch(Config.channel, { cache: true });
  Client.channels.fetch(Config.permChannel, { cache: true });
  Client.channels.fetch(Config.pracChannel, { cache: true });
  // Just a default Presence to make it look nicer.
  Client.user?.setPresence({
    status: "dnd",
    activities: [
      {
        name: "for a new Session",
        type: ActivityType.Listening,
      },
    ],
  });
});

// Activate both the watcher and deleter functions.
(async () => {
  await Database.Connect();

  PersistentMessage();
  Watcher();
  Deleter();
  await Client.login(Config.token);
})().catch((e) => console.error(e));
